
/**
 * @class Clase de utilidad para construir geoJSON con los diferentes elementos de la aplicación
 */
class GeoJSONUtils {

    /**
     * Construye un JSON con estructura de GeoJSON con la lista de eventos recibida
     * @param {*} events Lista de eventos 
     */
    static buildEventsGeoJson(events) {
        const geoJson =
        {
            "type": "FeatureCollection",
            "features": events.map(point => ({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [point.longitude, point.latitude]
                    },
                    "properties": {
                        point
                    }
            }))
        }

        return geoJson;
    }

    /**
     * Construye un JSON con estructura de GeoJSON con la lista de anuncios recibida
     * @param {*} ads Lista de anuncios 
     */
    static buildAdsGeoJson(ads) {
        const geoJson =
        {
            "type": "FeatureCollection",
            "features": ads.map(point => ({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [point.longitude, point.latitude]
                    },
                    "properties": {
                        point
                    }
            }))
        }

        return geoJson;
    }

    /**
     * Construye un JSON con estructura de GeoJSON con la lista de empresas recibida
     * @param {*} companies Lista de empreas 
     */
    static buildCompaniesGeoJson(companies) {
        const geoJson =
        {
            "type": "FeatureCollection",
            "features": companies.map(point => ({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [point.longitude, point.latitude]
                    },
                    "properties": {
                        point
                    }
            }))
        }

        return geoJson;
    }

    /**
     * Construye un JSON con estructura de GeoJSON con la lista de capas geográficas recibida
     * @param {*} events Lista de capas geográficas 
     */
    static buildOtherLayerGeoJson(points, layer){
        const geoJson =
        {
            "type": "FeatureCollection",
            "features": points.map(point => ({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [point.longitude, point.latitude]
                    },
                    "properties": {
                        ...point, layer: layer                   
                    }
            }))
        }

        return geoJson;
    }
}


export default GeoJSONUtils