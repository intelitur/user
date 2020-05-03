import { API_URL } from '../env'

const module = 'events'

class EventsService {

    static async updateEvents(){
        let response = await fetch(`${API_URL}/${module}`)
        response = await response.json()
        return response
    }

    static async getEvents(update = false) {
        if(EventsService.events === undefined || update){
            EventsService.events =  await EventsService.updateEvents()
        }
        return EventsService.events
    }

    static async getEvent(event_id){
        let event = EventsService.events.find((event) => event_id === event.event_id)
        if(event){
            return event
        }
    }

    static async getEventImages(event_id, quantity = 0) {
        let response = await fetch(`${API_URL}/${module}/${event_id}/images/${quantity}`)
        response = await response.json()
        return response
    }
}

export default EventsService