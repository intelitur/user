import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'

const module = 'company'

class CompaniesService {

    static async updateCompanies(){
        let response = await ServiceUtils.GET(`${API_URL}/${module}`)
        return response
    }

    static async getCompanies(update = false) {
        // if(CompaniesService.companies === undefined || update){
        //     CompaniesService.companies =  CompaniesService.updateCompanies()
        // }
        // return CompaniesService.companies

        return CompaniesService.updateCompanies()
    }

    static async getCompany(company_id){
        let event = EventsService.events.find((event) => event_id === event.event_id)
        if(event){
            return event
        }
        else{
            let response = await ServiceUtils.GET(`${API_URL}/${module}/${event_id}`)
            //let response = await fetch(`./info/eventImages.json`)
            response = await response.json()
            if(response[0])
                return response[0]
        }
    }
}

export default CompaniesService