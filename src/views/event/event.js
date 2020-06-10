import EventsService from '../../services/EventsService'
import TemplatesManager from '../../utils/TemplatesManager'
import DesignController from '../../utils/DesignController'
import Carousel from "../carousel/carousel";


import './event.css'
class EventView {

    constructor(event_id) {
        this.event_id = event_id
        this.eventPromise = this.updateEvent()
    }

    async render(name) {
        await this.eventPromise

        const template = await TemplatesManager.getTemplate('event')

        const view = TemplatesManager.contextPipe(template, {...this, datetime: this.getDateTimeInfo()})

        this.el = TemplatesManager.renderElement(name, view)

        await this.renderContent();
        this.addEventListeners()
    }

    async renderContent(){
        // this.carousel = new Carousel(this.event.images.map(image => image.url));
        this.carousel = new Carousel([
            "https://intelitur.sytes.net/files/images/file-1590262636507.jpg",
            "https://intelitur.sytes.net/files/images/file-1590262636507.jpg",
        ]);
        this.carousel.render('event_carousel')
    }

    addEventListeners(){
        this.el.querySelector('.event__back').addEventListener('click', this.hide)
        this.el.querySelector(".event__carousel--button.left").addEventListener("click", this.carousel.pImage.bind(this.carousel))
        this.el.querySelector(".event__carousel--button.right").addEventListener("click", this.carousel.nImage.bind(this.carousel))
    }

    async updateEvent() {
        this.event = await EventsService.getEvent(this.event_id)
        console.log(this.event)
        if(this.event.images === undefined)
            this.event.images = await this.getImages()
    }

    async getImages() {
        return EventsService.getEventImages(this.event_id)
    }

    async getContestants() {
        return EventsService.getContestants(this.event_id)
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
}

export default EventView