import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'
import Snackbar from '../views/snackbar/snackbar'

const module = 'frequentQuestions'

class FrequentQuestionsService {

    static async getFrequentQuestions(){
        let filters = {is_active: true, state: 2}
        let response = await ServiceUtils.GET(`${API_URL}/${module}?${ServiceUtils.createQuery(filters)}`)
        return response
    }
}

export default FrequentQuestionsService