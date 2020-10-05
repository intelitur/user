import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'

const module = 'intinerary'

class IntineraryService {

    static async getEventCategories(event_id) {
        let response = await ServiceUtils.GET(`${API_URL}/${module}/${event_id}/events`)
        response = await response.json()
        return response
    }
}

export default CategoryService