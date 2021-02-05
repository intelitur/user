import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'


/**
 * @class Servicio para obtener las categorías
 */
class CategoryService {
    
    /**
     * Obtiene las categorías de un evento específico
     * @param {*} event_id Id del evento del que se quiere obtener las categorías
     */
    static async getEventCategories(event_id) {
        let response = await ServiceUtils.GET(`${API_URL}/${CategoryService.module}/${event_id}/events`)
        response = await response.json()
        return response
    }

    /**
     * Obtiene todas las categorías de los eventos
     */
    static async getEventsCategories(){
        let response = await ServiceUtils.GET(`${API_URL}/${CategoryService.module}?state=1`) // State es el tipo de la categoría
        response = await response.json()
        return response
    }
}

/**
 * @var CategoryService.module Nombre del recurso o módulo para obtener categorías en la API
 */
CategoryService.module = 'categories'

export default CategoryService