import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'

const module = 'categories'

class CategoryService {

    static async getEventCategories(event_id) {
        let response = await ServiceUtils.GET(`${API_URL}/${module}/${event_id}/events`)
        response = await response.json()
        return response
    }

    static async getEventsCategories(){
        let response = await ServiceUtils.GET(`${API_URL}/${module}?state=1`) // State es el tipo de la categoría
        response = await response.json()
        return response
    }
}

export default CategoryService