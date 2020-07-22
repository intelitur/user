import TemplatesManager from "../../../utils/TemplatesManager";
import Carousel from "../../carousel/carousel";
import DesignController from "../../../utils/DesignController";
import CalendarView from "../../calendar/calendar";
import EventsService from "../../../services/EventsService";
import { IMAGES_BASE_URL } from "../../../env";


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
            this.showSearchScreen()
            this.hiddenDiv(await this.getEvents());
        }
        else {
            this.setudDesktopListeners()
            await this.renderCalendar()
            this.setupSrollAnimation()
            await this.renderComingEvents()
        }
    }

    async renderCalendar() {
        this.calendar = new CalendarView()
        await this.calendar.render('tab1_calendar')
        
    }

    async renderComingEvents(){
        let template = await TemplatesManager.getTemplate("tab1_viewEventDesktop")
        
        let comingEvents = await EventsService.getComingEvents(this.index, this.pageSize)
        
        comingEvents.forEach((event) => {
            let node = TemplatesManager.contextPipe(template, {...event, ...this.getDateInfo(event), main_image: this.getMainImage(event)}, false)
            node.classList.add("tab1__coming-events--item")
            document.querySelector(".tab1__coming-events--container").insertBefore(node, document.querySelector(".tab1__coming-events--container").lastElementChild)
        })

        if(comingEvents.length < this.pageSize){
            this.el.querySelector(".lds-ellipsis").style.display = "none"
            this.el.querySelector(".tab1__coming-events--no-more").style.display = "block"
        }
        

        const comingEventsDOM = this.el.querySelectorAll(".tab1__coming-event--button")
        comingEventsDOM.forEach(item => {
            item.addEventListener('click', DesignController.showEvent.bind(this, item.getAttribute("event_id")))
        })
    }

    setudDesktopListeners(){
        let loading = false;
        document.querySelector(".tab1__coming-events--container").addEventListener("scroll", (async (e) => {
            if(e.target.scrollTop + 70 > e.target.scrollHeight - e.target.clientHeight && !loading){
                loading = true
                console.log("Carga")
                this.index += 1
                await this.renderComingEvents()
                loading = false
                console.log("Ya no carga")
            }
                
        }).bind(this))
        

        
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
        console.log(event)
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
        let events = await EventsService.getComingEvents(0,2);
        console.log(events);
            const htmlNode = TemplatesManager.createHtmlNode(tooltipHTML.patch({name: events[0].name, color: events[0].color, ...this.getDateInfo(events[0]), main_image: this.getMainImage(events[0])}));
            const htmlNode2 = TemplatesManager.createHtmlNode(tooltipHTML.patch({name: events[1].name, color: events[1].color, ...this.getDateInfo(events[1]), main_image: this.getMainImage(events[1])}));
            //const htmlNode2 = TemplatesManager.createHtmlNode(tooltipHTML.patch({name: events[1].name, color: events[1].color, ...this.getDateInfo(events[1]), main_image: this.getMainImage(events[1])}));
           
            var info = new Tab1(this.el.children[0]);
            //var date = new Date();
            //console.log(events[0].date_range.initial_date);
            const padre = this.el.querySelector('.tab1__calendar__events--container');
            padre.children[0].appendChild(htmlNode);
            padre.children[1].appendChild(htmlNode2);
            //padre.children[1].appendChild(htmlNode2);
      
        
      
        //padre.children[0].children[1].text= "jueves 03:40"; padre.children[0].children[2].text= "Martes 3:20";
        //padre.children[0].children[1].text= events[0].name; date = events[0].date_range.initial_date;
        
        //padre.children[1].children[1].text = events[1].name;
        //padre.children[1].children[0].children[0].style.backgroundColor = events[1].color;
        //padre.children[1].children[1].text= "viernes 4:05"; padre.children[1].children[2].text= "Martes 3:20";
        console.log(events)
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