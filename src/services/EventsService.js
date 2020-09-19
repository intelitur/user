import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'

const module = 'events'

class EventsService {

    static async getEventsFiltered(filters){
        
        let response = await fetch(`${API_URL}/${module}?${ServiceUtils.createQuery(filters)}`)
        return response
    }

    static getEvents(update = false) {
        const now = new Date()
        const later = new Date()
        later.setMonth(now.getMonth() + 3)
        let filter = {
            initial_date: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`,
            final_date: `${later.getFullYear()}-${(later.getMonth() + 1).toString().padStart(2, "0")}-${later.getDate().toString().padStart(2, "0")}`
        }
        // if(EventsService.events === undefined || update){
        //     EventsService.events = EventsService.getEventsFiltered(filter)
        // }
        // return EventsService.events

        return EventsService.getEventsFiltered(filter)
    }

    static async getEvent(event_id){
        // let event = EventsService.events.find((event) => event_id === event.event_id)
        // if(event){
        //     return {event, status: 200}
        // }
        // else{
            let response = await fetch(`${API_URL}/${module}/${event_id}?add_visit=true`)
            if(response)
                return response
        //}
    }

    static async getEventImages(event_id, quantity = 0) {
        let response = await fetch(`${API_URL}/${module}/${event_id}/images/${quantity}`)
        //let response = await fetch(`./info/eventImages.json`)
        response = await response.json()
        return response
    }

    static async getComingEvents(index, pageSize){
        let url = `${API_URL}/${module}/incoming`
        if(index != undefined && pageSize != undefined)
            url += `?index=${index}&pageSize=${pageSize}`
        
        let response = await fetch(url)
        return response
    }

    static async addVisit(event_id){
        
    }
}

export default EventsService