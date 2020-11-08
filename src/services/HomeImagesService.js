import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'



class HomeImagesService {
    
    static async getHomeImages(){
        const filters = {is_active: true, showed: true} 
        let response = await ServiceUtils.GET(`${API_URL}/${HomeImagesService.module}?${ServiceUtils.createQuery(filters)}`)
        return response
    }
}

HomeImagesService.module = "homeImages"

export default HomeImagesService

