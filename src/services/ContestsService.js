import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'



class ContestsService {
    
    static async getContests(state = true){
        const filters = {state} 
        let response = await ServiceUtils.GET(`${API_URL}/${ContestsService.module}?${ServiceUtils.createQuery(filters)}`)
        return response
    }

    static async getContest(id){
        let response = await ServiceUtils.GET(`${API_URL}/${ContestsService.module}/${id}`)
        return response
    }
}

ContestsService.module = "contests"

export default ContestsService

