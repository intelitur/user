import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'
import Snackbar from '../views/snackbar/snackbar'



class AdsService {

    static async getAds(filters){
        
        let response = await ServiceUtils.GET(`${API_URL}/${AdsService.module}?${ServiceUtils.createQuery(filters)}`)
        return response
    }

    static async getAd(ad_id, add_visit){
        let response; 
        if(add_visit)
            response = await ServiceUtils.GET(`${API_URL}/${AdsService.module}/${ad_id}?add_visit=true`)
        else
            response = await ServiceUtils.GET(`${API_URL}/${AdsService.module}/${ad_id}`)
        if(response)
            return response
        
    }
}
AdsService.module = 'ads'

export default AdsService