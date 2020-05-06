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
}


export default GeoJSONUtils