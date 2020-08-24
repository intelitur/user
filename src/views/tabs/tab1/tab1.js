

import TemplatesManager from "../../../utils/TemplatesManager";
import Carousel from "../../carousel/carousel";
import DesignController from "../../../utils/DesignController";
import CalendarView from "../../calendar/calendar";
import EventsService from "../../../services/EventsService";
import { IMAGES_BASE_URL } from "../../../env";
import tab1_companies from "./js/tab1_companies";


import './tab1.css'
import './css/d_tab1_event_view.css'
import '../../../utils/css/loader-ellipsis.css'
import Snackbar from "../../snackbar/snackbar";


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
        const htmlName = DesignController.mobile ? 'm_tab1_content' : 'd_tab1_content'
        const view = await TemplatesManager.getTemplate(htmlName)
        TemplatesManager.renderElement('tab1_content', view)

        await this.carousel.render('tab1_carousel')
        this.configCalendarButton()
        
          
        if (DesignController.mobile) {
            this.setupSearchScreen()
            this.renderEventsMobile()
            //this.hiddenDiv();
        }
        else {
            this.setudDesktopListeners()
            await this.renderCalendar()
            this.setupSrollAnimation()
            await this.renderEvents()
            tab1_companies.renderCompanies()
        }

        Snackbar.error("Probando un error", 5000)
        setTimeout(()=> {Snackbar.success("Pronbando un éxito", 5000)}, 5500)
        
        setTimeout(()=>{Snackbar.warning("Probando un warning", 5000)}, 11000)
        
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
            let template = await TemplatesManager.getTemplate("d_tab1_event_view")
            
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

    async renderEventsMobile(){
        const template = await TemplatesManager.getTemplate('m_tab1_event_view');

        const events = await this.getEvents();

        const htmlNode = TemplatesManager.createHtmlNode(template.patch({name: events[0].name, color: events[0].color, ...this.getDateInfo(events[0]), main_image: this.getMainImage(events[0]), event_id: events[0].event_id}));
        const htmlNode2 = TemplatesManager.createHtmlNode(template.patch({name: events[1].name, color: events[1].color, ...this.getDateInfo(events[1]), main_image: this.getMainImage(events[1]), event_id: events[1].event_id}));
           
        const container = this.el.querySelector('.tab1__events--container');
        container.children[0].appendChild(htmlNode);
        container.children[1].appendChild(htmlNode2);

        const eventsDOM = this.el.querySelectorAll(".m_tab1__event--container")
        eventsDOM.forEach(item => {
            item.getAttribute("event_id")
            item.addEventListener('click', DesignController.showEvent.bind(this, item.getAttribute("event_id")))
        })
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

    // hiddenDiv(events) {
    //     const padre = this.el.querySelector('.tab1__calendar__events--container');
    //     /**
    //     padre.children[0].addEventListener('mouseenter', function () {
            
    //         padre.children[0].children[0].children[4].classList.add('size');
    //     }); */
    //     padre.children[1].addEventListener('mouseenter', function () {
    //         padre.children[0].classList.add('hidden');
    //     });
    //     padre.children[1].addEventListener('mouseleave', function () {
    //         padre.children[0].classList.remove('hidden');
    //     });
    //     const consurso = this.el.querySelector('.tab1__calendar__concurso--container')
        
    //         consurso.children[1].addEventListener('mouseenter', function()
    //     {
    //         consurso.children[0].classList.add('hidden');
    //     })
    //     consurso.children[1].addEventListener('mouseleave', function()
    //     {
    //         consurso.children[0].classList.remove('hidden');
    //     })
        
    // }
    
    async getEvents(){
        let events = await EventsService.getComingEvents(0,2);
        return events;
    }

    

    
    async setupSearchScreen(){
        this.el.querySelector('.tab1__search--button').addEventListener('click', DesignController.showSearchScreen)
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