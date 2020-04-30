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
}

export default EventsService