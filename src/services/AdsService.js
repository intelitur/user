import { API_URL } from '../env'
import ServiceUtils from '../utils/ServiceUtils'


/**
 * @class Servicio para obtener los anuncios
 */
class AdsService {

    /**
     * Obtiene los anuncios en una HttpResponse | HttpErrorResponse
     * @param {*} filters Es un objeto con diferentes filtros diferentes filtros: initial_date, final_date, meters, latitude, longitude
     */
    static async getAds(filters){
        
        let response = await ServiceUtils.GET(`${API_URL}/${AdsService.module}?${ServiceUtils.createQuery(filters)}`)
        return response
    }

    /**
     * Obtiene un anuncio en una HttpResponse | HttpErrorResponse
     * @param {*} ad_id Id del anuncio que se quiere obtener
     * @param {*} add_visit Booleano que determina si añade una visita al anuncio o no
     */
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

/**
 * @var AdsService.module Nombre del recurso o módulo para obtener anuncios en la API
 */
AdsService.module = 'ads'

export default AdsService