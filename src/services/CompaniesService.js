import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'




class CompaniesService {

    static async getCompanies(update = true) {
        let response = await ServiceUtils.GET(`${API_URL}/${CompaniesService.module}?state=1f`)
        return response
    }

    static async getCompany(company_id){
        let event = EventsService.events.find((event) => event_id === event.event_id)
        if(event){
            return event
        }
        else{
            let response = await ServiceUtils.GET(`${API_URL}/${CompaniesService.module}/${event_id}`)
            //let response = await fetch(`./info/eventImages.json`)
            response = await response.json()
            if(response[0])
                return response[0]
        }
    }
}
CompaniesService.module = "company"

export default CompaniesService