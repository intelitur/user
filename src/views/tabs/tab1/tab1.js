import TemplatesManager from "../../../utils/TemplatesManager";
import Carousel from "../../carousel/carousel";
import DesignController from "../../../utils/DesignController";
import CalendarView from "../../calendar/calendar";
import EventsService from "../../../services/EventsService";
import { IMAGES_BASE_URL } from "../../../env";
import tab1_companies from "./js/tab1_companies";


import './tab1.css'
import './css/tab1_viewEventDesktop.css'
import '../../../utils/css/loader-ellipsis.css'


class Tab1 {
    

    constructor() {
        this.carousel = new Carousel([
            "https://cdn.shopify.com/s/files/1/0094/5052/files/LaFortunaWaterfall-1500x1000x300.jpg?v=1540451385",
            "https://puntadelesteibt.com/wp-content/uploads/2012/07/NTN_6571.jpg",
            "https://d3hne3c382ip58.cloudfront.net/resized/750x420/combination-tour-la-fortuna-in-one-day-tour-2-457721_1549285516.JPG"
        ])
        this.index = 0;
        this.pageSize = 3;
    }

    set loading(value){
        this.loadingState = value;
        if(value){
            this.el.querySelector(".lds-ellipsis").style.display = "block"
            this.el.querySelector(".tab1__coming-events--no-more").style.display = "none"
        }
        else{
            this.el.querySelector(".lds-ellipsis").style.display = "none"
            this.el.querySelector(".tab1__coming-events--no-more").style.display = "block"
        }
    }

    get loading(){
        return this.loadingState
    }

    get noMore(){
        return this.el.querySelector(".tab1__coming-events--no-more").style.display == "block"
    }

    async render() {
        const view = await TemplatesManager.getTemplate('tab1')
        this.el = TemplatesManager.renderElement('tab1', view)
        await this.renderContent()
        
    }

    async renderContent() {
        const htmlName = DesignController.mobile ? 'mobile_tab1_content' : 'tab1_content'
        const view = await TemplatesManager.getTemplate(htmlName)
        TemplatesManager.renderElement('tab1_content', view)

        await this.carousel.render('tab1_carousel')
        this.configCalendarButton()
        
          
        if (DesignController.mobile) {
            this.hiddenDiv(await this.getEvents());
            this.showSearchScreen()
        }
        else {
            this.setudDesktopListeners()
            await this.renderCalendar()
            this.setupSrollAnimation()
            await this.renderEvents()
            tab1_companies.renderCompanies()
        }
    }

    async renderCalendar() {
        this.calendar = new CalendarView()
        await this.calendar.render('tab1_calendar')
        
    }

    resetContainer(){
        let container = document.querySelector(".tab1__coming-events--container")
            container.innerHTML = `<div>
            <div class="tab1__coming-events--no-more" style="font-size: 12px; color: gray; margin: 20px auto; margin-bottom: 40px; display: none;"> No hay más eventos próximos para mostrar</div>
            <div class="lds-ellipsis" style="margin: 0 auto; color: tomato; margin-bottom: 100px; height: 0;">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>`
        this.el.querySelector(".tab1__coming-events--no-more").innerHTML = 
                this.filter != undefined && this.filter != ""? 
                `No hay más eventos que coincidan con <b>${this.filter}<b/>`: 
                "No hay más eventos próximos para mostrar"
    }

    async renderEvents(){
        if(this.index == 0){
            this.resetContainer()
        }
        this.loading = true;
        let events = []
        if(this.filter != undefined && this.filter != ""){
            this.events = await EventsService.getEvents();
            events = this.events.filter(item => item.name.toLowerCase().includes(this.filter.toLowerCase()))
            events = events.slice(this.pageSize * this.index, this.pageSize * (this.index + 1))
        }
        else{
            events = await EventsService.getComingEvents(this.index, this.pageSize)
        }

        
        if(events.length > 0){
            let template = await TemplatesManager.getTemplate("tab1_viewEventDesktop")
    
            events.forEach((event) => {
                let node = TemplatesManager.contextPipe(template, {...event, ...this.getDateInfo(event), main_image: this.getMainImage(event)}, false)
                node.classList.add("tab1__coming-events--item")
                document.querySelector(".tab1__coming-events--container").insertBefore(node, document.querySelector(".tab1__coming-events--container").lastElementChild)
            })
                
            const eventsDOM = this.el.querySelectorAll(".tab1__coming-event--button")
            eventsDOM.forEach(item => {
                item.addEventListener('click', DesignController.showEvent.bind(this, item.getAttribute("event_id")))
            })
        }
        this.loading = false;
    }

    setudDesktopListeners(){
        document.querySelector(".tab1__coming-events--container").addEventListener("scroll", (async (e) => {
            if(e.target.scrollTop + 70 > e.target.scrollHeight - e.target.clientHeight && !this.loading && !this.noMore){
                this.index += 1
                await this.renderEvents()
            }
                
        }).bind(this)) 

        document.querySelector(".tab1_coming-events--input").addEventListener("keyup", ((e) => {
            this.filter = e.target.value
                this.index = 0
                this.renderEvents()
        }).bind(this))

        document.querySelector(".tab1_coming-events--search-button").addEventListener("click", (() => {this.index = 0; this.renderEvents()}).bind(this))
    }

    getDateInfo(event){

        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

        const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

        const date = new Date(event.date_range.initial_date.split("T")[0])

        
        const monthName = months[date.getMonth()]

        const dayName = days[date.getDay()]

        const dateI = date.getDate() + 1

        return {
            monthName,
            dayName,
            dateI
        }
    }

    getMainImage(event){
        return `${IMAGES_BASE_URL}/${event.images[0]}`
    }

    setupSrollAnimation() {
        const container = this.el.children[0]
        container.addEventListener('scroll', ((e) => {
            const module = Math.floor(container.scrollTop / 150)
            this.showModule(module)
        }).bind(this))
    }

    showModule(module) {
        const icons = [
            'far fa-images',
            'fas fa-calendar-alt',
            'fas fa-bullhorn',
        ]
        const mosaicRightItems = [
            this.el.querySelector('.tab1__carousel--right'),
            this.el.querySelector('.tab1__calendar--right'),
            this.el.querySelector('.tab1__contests--right'),
        ]
        const mosaicLeftItems = [
            this.el.querySelector('.tab1__carousel--left'),
            this.el.querySelector('.tab1__calendar--left'),
            this.el.querySelector('.tab1__contests--left'),
        ]
        this.el.querySelector('.tab1--icon').className = `${icons[module === 3? 2: module]} tab1--icon`

        mosaicRightItems.forEach((item, i) => {
            if (i === (module === 3? 2: module)) {
                item.classList.add('active')
            }
            else{
                item.classList.remove('active')
            }
        })
        mosaicLeftItems.forEach((item, i) => {
            if (i === (module === 3? 2: module)) {
                item.classList.add('active')
            }
            else{
                item.classList.remove('active')
            }
        })

        if(module === 1 && !this.calendar.updated){
            this.calendar.updateSize()       
            this.calendar.updated = true
        }
        
        if (module === 3) {
            DesignController.showTab(2)
        }
    }

    hiddenDiv(events) {
        const padre = this.el.querySelector('.tab1__calendar__events--container');
        console.log(padre.children[0]);
        /**
        padre.children[0].addEventListener('mouseenter', function () {
            
            padre.children[0].children[0].children[4].classList.add('size');
        }); */
        padre.children[1].addEventListener('mouseenter', function () {
            padre.children[0].classList.add('hidden');
            //padre.children[1].children[2].text = events[0].detail;
            //padre.children[1].children[3].style.marginTop = "30px";
        });
        padre.children[1].addEventListener('mouseleave', function () {
            //padre.children[1].children[3].text ="";
            padre.children[0].classList.remove('hidden');
        });
        const consurso = this.el.querySelector('.tab1__calendar__concurso--container')
        
            consurso.children[1].addEventListener('mouseenter', function()
        {
            consurso.children[0].classList.add('hidden');
        })
        consurso.children[1].addEventListener('mouseleave', function()
        {
            consurso.children[0].classList.remove('hidden');
        })
        
    }
    
    async getEvents(){
        
        const tooltipHTML = await TemplatesManager.getTemplate('tab1_viewEvent');
        let events = await EventsService.getEvents();
        const htmlNode = TemplatesManager.createHtmlNode(tooltipHTML.patch({events: events[0].name}));
        const htmlNode2 = TemplatesManager.createHtmlNode(tooltipHTML.patch({name: "walter2"}));
        
        console.log(events);
        var info = new Tab1(this.el.children[0]);
        //var date = new Date();
        //console.log(events[0].date_range.initial_date);
        const padre = this.el.querySelector('.tab1__calendar__events--container');
        console.log(htmlNode);
        padre.children[0].appendChild(htmlNode);

        padre.children[1].appendChild(htmlNode2);
        //padre.children[0].children[1].text= "jueves 03:40"; padre.children[0].children[2].text= "Martes 3:20";
        //padre.children[0].children[1].text= events[0].name; date = events[0].date_range.initial_date;
        
        //padre.children[1].children[1].text = events[1].name;
        //padre.children[1].children[0].children[0].style.backgroundColor = events[1].color;
        //padre.children[1].children[1].text= "viernes 4:05"; padre.children[1].children[2].text= "Martes 3:20";
        return events;

       /*
                 event.date_range.initial_date.split("T")[0] + "T" + (event.initial_time ? event.initial_time : "00:00:00"),
                 event.date_range.final_date.split("T")[0] + "T" + (event.final_time ? event.final_time : "23:59:00"),
             event.all_day,*/
            
    }

    
    async showSearchScreen(){
        this.el.querySelector('.search-input').addEventListener('click', DesignController.showSearchScreen)

    }
   

    configCalendarButton() {
        if (DesignController.mobile)
            this.el.querySelector('.tab1__calendar--button').addEventListener('click', DesignController.showCalendar)
        else {
            const container = this.el.children[0]
            this.el.querySelector('.tab1--button').addEventListener('click', (function () {
                container.scrollTop += 151
            }).bind(this))
        }
    }

    show() { this.el.classList.add('active') }

    hide() { this.el.classList.remove('active') }
}

export default new Tab1()