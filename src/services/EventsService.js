import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'

const module = 'events'

class EventsService {

    static async getEventsFiltered(filters){
        
        let response = await fetch(`${API_URL}/${module}?${ServiceUtils.createQuery(filters)}`)
        response = await response.json()
        return response
    }

    static async updateEvents(){
        let response = await fetch(`${API_URL}/${module}`)
        //let response = await fetch(`./info/events.json`)
        response = await response.json()
        return response
    }

    static async getEvents(update = false) {
        const now = new Date()
        const later = new Date()
        later.setMonth(now.getMonth() + 3)
        let filter = {
            initial_date: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`,
            final_date: `${later.getFullYear()}-${(later.getMonth() + 1).toString().padStart(2, "0")}-${later.getDate().toString().padStart(2, "0")}`
        }
        if(EventsService.events === undefined || update){
            EventsService.events =  await EventsService.getEventsFiltered(filter)
        }
        return EventsService.events
    }

    static async getEvent(event_id){
        let event = EventsService.events.find((event) => event_id === event.event_id)
        if(event){
            return event
        }
        else{
            let response = await fetch(`${API_URL}/${module}/${event_id}`)
            //let response = await fetch(`./info/eventImages.json`)
            response = await response.json()
            if(response[0])
                return response[0]
        }
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
        response = await response.json()
        return response
    }

    static async addVisit(event_id){
        
    }
}

export default EventsService