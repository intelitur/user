import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'



class IntineraryService {

    static async getEventCategories(event_id) {
        let response = await ServiceUtils.GET(`${API_URL}/${IntineraryService.module}/${event_id}/events`)
        response = await response.json()
        return response
    }
}
IntineraryService.module = 'intinerary'

export default CategoryService