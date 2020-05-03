import EventsService from '../../services/EventsService'
import TemplatesManager from '../../utils/TemplatesManager'
import DesignController from '../../utils/DesignController'

class EventView {

    constructor(event_id) {
        this.event_id = event_id
        this.eventPromise = this.updateEvent()
    }

    async render() {
        await this.eventPromise

        const template = await TemplatesManager.getTemplate('event')

        const view = TemplatesManager.contextPipe(template, this)

        this.el = TemplatesManager.renderElement('overlay', view)

        this.addEventListeners()
    }

    addEventListeners(){
        this.el.querySelector('.overlay--event__back').addEventListener('click', this.hide)
    }

    async updateEvent() {
        this.event = await EventsService.getEvent(this.event_id)
        this.event.images = await this.getImages()
    }

    async getImages() {
        return EventsService.getEventImages(this.event_id)
    }

    async getContestants() {
        return EventsService.getContestants(this.event_id)
    }

    hide(){
        DesignController.hideOverlay()
    }
}

export default EventView