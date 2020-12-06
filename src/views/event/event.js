import EventsService from '../../services/EventsService'
import TemplatesManager from '../../utils/TemplatesManager'
import DesignController from '../../utils/DesignController'
import Carousel from "../carousel/carousel";
import CategoryService from "../../services/CategoryService"
import tab2 from "../tabs/tab2/tab2"
import footer from "../footer/footer"
import { FILES_BASE_URL } from '../../env';


import './event.css'
import Snackbar from '../snackbar/snackbar';
class EventView {

    constructor(event_id, render) {
        this.event_id = event_id
        this.eventPromise = this.updateEvent()
        this.render(render)
    }

    async render(name) {
        await this.eventPromise
        
        if(this.event != undefined){
            const template = await TemplatesManager.getTemplate('event')

            const view = TemplatesManager.contextPipe(template, {...this, datetime: this.getDateTimeInfo()})
    
            this.el = TemplatesManager.renderElement(name, view)

            if(DesignController.mobile){
                DesignController.showOverlay()
            }
            else {
                tab2.map.showEventPopup(this.event.event_id)
                document.querySelector(".tab2__left__info--container").classList.add('visible')
                tab2.map.showEventPopup(this.event.event_id)
                tab2.loading = false
            }
            await this.renderContent();
            this.addEventListeners()
        }
        else{
            footer.showTab(1)
            tab2.loading = false
        }

    }

    async renderContent(){
        this.carousel = new Carousel(this.event.images.map(image => `${FILES_BASE_URL}/${image.name}`));
        // this.carousel = new Carousel([
        //     "https://intelitur.sytes.net/files/images/file-1590262636507.jpg",
        //     "https://intelitur.sytes.net/files/images/file-1590262636507.jpg",
        // ]);
        this.carousel.render('event_carousel')
    }

    addEventListeners(){
        this.el.querySelector('.event__back').addEventListener('click', this.hide)
        this.el.querySelector(".event__carousel--button.left").addEventListener("click", this.carousel.pImage.bind(this.carousel))
        this.el.querySelector(".event__carousel--button.right").addEventListener("click", this.carousel.nImage.bind(this.carousel))
        this.el.querySelector(".event__save--button").addEventListener("click", this.downloadEvent.bind(this))
        this.el.querySelector(".event__address--button").addEventListener("click", (() => { 
            tab2.map.showEventPopup(this.event.event_id); 
            if(DesignController.mobile){
                footer.showTab(2);
                DesignController.hideOverlay(true); 
            }
        }).bind(this))
    }

    async updateEvent() {
        const response = await EventsService.getEvent(this.event_id)
        if(response.status != 200){
            if(response.status >= 500){
                Snackbar.error(500)
            }
            else if(response.status >= 400){
                Snackbar.error(400)
            }
            this.loading = false
            return
        }
        this.event = (await response.json())[0]
        if(this.event != undefined){
            if(this.event.categories === undefined)
            this.event.categories = await this.getCategories()
            console.log(this.event.categories)
        }
        else
            Snackbar.error("El evento no existe o fue eliminado")

    }

    async getContestants() {
        return EventsService.getContestants(this.event_id)
    }

    async getCategories() {
        return CategoryService.getEventCategories(this.event_id)
    }

    getDateTimeInfo(){

        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

        const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

        const startDate = new Date(this.event.date_range.initial_date.split("T")[0])
        
        const startMonthName = months[startDate.getMonth()]

        const startDayName = days[startDate.getDay()]

        const startDateI = startDate.getDate() + 1

        const startTime = this.event.initial_time != null? this.event.initial_time.split(":").slice(0, 2).join(":"): undefined

        const endDate = new Date(this.event.date_range.final_date.split("T")[0])
        
        const endMonthName = months[endDate.getMonth()]

        const endDayName = days[endDate.getDay()]

        const endDateI = endDate.getDate() + 1

        const endTime = this.event.final_time != null? this.event.final_time.split(":").slice(0, 2).join(":"): undefined

        return {
            startMonthName,
            startDayName,
            startDateI,
            startTime,
            endMonthName,
            endDayName,
            endDateI,
            endTime
        }
    }
    

    hide(){
        if(DesignController.mobile)
            DesignController.hideOverlay()
        else
            document.querySelector(".tab2__left__info--container").classList.remove('visible')
    }

    downloadEvent() {
        const SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';

        let start = this.event.date_range.initial_date.split("T")[0] + "T" + (this.event.initial_time != null?  this.event.initial_time: "00:00:00")
        start = start.replace(/:|-/gi, '')

        
        let end = this.event.date_range.final_date.split("T")[0] + "T" + (this.event.final_time != null?  this.event.final_time: "23:59:59")
        end = end.replace(/:|-/gi, '')

        const description = this.event.detail
        const location = this.event.address
        const subject = this.event.name

        const calendarEvent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            'CLASS:PUBLIC',
            'DESCRIPTION:' + description,
            'DTSTART:' + start,
            'DTEND:' + end,
            'LOCATION:' + location,
            'SUMMARY:' + subject,
            'TRANSP:TRANSPARENT',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join(SEPARATOR);

        window.open("data:text/calendar;charset=utf8," + escape(calendarEvent), "event.ics");
    }
}

export default EventView