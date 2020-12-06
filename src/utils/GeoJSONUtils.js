class GeoJSONUtils {

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