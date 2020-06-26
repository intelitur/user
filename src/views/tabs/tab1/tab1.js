import TemplatesManager from "../../../utils/TemplatesManager";
import Carousel from "../../carousel/carousel";
import DesignController from "../../../utils/DesignController";
import CalendarView from "../../calendar/calendar";
import EventsService from "../../../services/EventsService";


import './tab1.css'
import './css/tab1_viewEventDesktop.css'


class Tab1 {
    
    constructor() {
        this.carousel = new Carousel([
            "https://cdn.shopify.com/s/files/1/0094/5052/files/LaFortunaWaterfall-1500x1000x300.jpg?v=1540451385",
            "https://puntadelesteibt.com/wp-content/uploads/2012/07/NTN_6571.jpg",
            "https://d3hne3c382ip58.cloudfront.net/resized/750x420/combination-tour-la-fortuna-in-one-day-tour-2-457721_1549285516.JPG"
        ])
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
        let comingEvents = await EventsService.getComingEvents()

        console.log(comingEvents)

        let template = await TemplatesManager.getTemplate("tab1_viewEventDesktop")

        TemplatesManager.renderElement("tab1_comingEvent1", template.patch({...comingEvents[0], ...this.getDateInfo(comingEvents[0])}));
        TemplatesManager.renderElement("tab1_comingEvent2", template.patch({...comingEvents[1], ...this.getDateInfo(comingEvents[1])}));

        const comingEventsDOM = this.el.querySelectorAll(".tab1__coming-event--button")

        comingEventsDOM.forEach(item => {
            item.addEventListener('click', DesignController.showEvent.bind(this, item.getAttribute("event_id")))
        })
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
        padre.children[1].addEventListener('mouseenter', function () {
            padre.children[0].classList.add('hidden');
        });
        padre.children[1].addEventListener('mouseleave', function () {
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
        let events = await EventsService.getComingEvents();
        const htmlNode = TemplatesManager.createHtmlNode(tooltipHTML.patch({events: events[0], ...this.getDateInfo(events[0])}));
        const htmlNode2 = TemplatesManager.createHtmlNode(tooltipHTML.patch({events : events[1]}));

        
        var info = new Tab1(this.el.children[0]);
        const padre = this.el.querySelector('.tab1__calendar__events--container');
        padre.children[0].appendChild(htmlNode);
        
        console.log(padre.children[0].children[0].children[1].children[0]);
        padre.children[1].appendChild(htmlNode2);
        return events;
            
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