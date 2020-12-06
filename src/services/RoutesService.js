import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'
import Snackbar from '../views/snackbar/snackbar'



class RoutesService {

    static async getRoutes(){
        const filters = {is_active: true}
        let response = await ServiceUtils.GET(`${API_URL}/${RoutesService.module}?${ServiceUtils.createQuery(filters)}`)
        return response
    }

    static async getRouteOffers(route_id){
        const filters = {is_active: true}
        let response = await ServiceUtils.GET(`${API_URL}/${RoutesService.module}/${route_id}/offers`)
        return response
    }
}
RoutesService.module = 'touristRoutes'

export default RoutesService