import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'

const module = 'ads'

class AdsService {

    static async getAds(filters){
        
        let response = await fetch(`${API_URL}/${module}?${ServiceUtils.createQuery(filters)}`)
        return response
    }

    static async getAd(ad_id, add_visit){
        let response; 
        if(add_visit)
            response = await fetch(`${API_URL}/${module}/${ad_id}?add_visit=true`)
        else
            response = await fetch(`${API_URL}/${module}/${ad_id}`)
        if(response)
            return response
    }
}

export default AdsService