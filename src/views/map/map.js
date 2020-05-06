import TemplatesManager from "../../utils/TemplatesManager";
import leaflet from "leaflet/dist/leaflet";
import leaflet_fullscreen from "leaflet.fullscreen/Control.FullScreen"
import EventsService from '../../services/EventsService'
import GeoJSONUtils from '../../utils/GeoJSONUtils'
import DesignController from '../../utils/DesignController'


import 'leaflet/dist/leaflet.css'
import 'leaflet.fullscreen/Control.FullScreen.css'
import './map.css'


class Map {
    constructor(config = {
        tileConfig: {
            tileURL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            options: {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        },
        mapConfig: {
            elementName: 'map',
            options: {
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: 'topleft'
                }
            }
        }
    }) {
        this.config = config

        //Quitar
        DesignController.showCalendar()
    }

    async render(htmlName) {
        const view = await TemplatesManager.getTemplate('map')
        this.el = TemplatesManager.renderElement(htmlName, view)

        await this.renderMap()
    }

    async renderMap() {
        const { tileConfig, mapConfig } = this.config
        const mainTile = leaflet.tileLayer(tileConfig.tileURL, tileConfig.options)
        const mapLayersControl = leaflet.control.layers(undefined, undefined, {collapsed: false})
        

        this.map = leaflet.map(mapConfig.elementName,
            {
                layers: [
                    mainTile
                ],
                ...mapConfig.options,
            }
        )

        this.map.addControl(mapLayersControl.setPosition('bottomleft'))
        this.map.mapLayersControl = mapLayersControl
        this.setupEventsTile()
    }

    setMapView(lat, lng, zoom) {
        this.map.setView([lat, lng], zoom);
    }

    flyTo(lat, lng, zoom) {
        this.map.flyTo([lat, lng], zoom);
    }

    async setupEventsTile() {
        let events = await EventsService.getEvents()

        events = events.slice(0, 4) // Quitar esta línea

        const geoJSON = GeoJSONUtils.buildEventsGeoJson(events)

        const tooltipHTML =  await TemplatesManager.getTemplate('map.event.tooltip');

        let onEachFeature = (feature, layer) => {
            const dateString = feature.properties.point.date_range.initial_date.split("T")[0].split("-")
            
            const schedule = !feature.properties.point.initial_time? " todo el día" : (" a las " + feature.properties.point.initial_time.substring(0, 5))
            const tooltip = tooltipHTML.patch({dateString, feature, layer, schedule})

            const htmlNode = TemplatesManager.createHtmlNode(tooltip)
            htmlNode.addEventListener('click', (function() {
                DesignController.showEvent(feature.properties.point.event_id)
            }))
            layer.bindPopup(htmlNode)
        }

        const layer = leaflet.geoJSON(geoJSON, {
            onEachFeature: onEachFeature,

            pointToLayer: function (feature, latlng) {
                return leaflet.circleMarker(latlng, {
                    radius: 8,
                    fillColor: feature.properties.point.color,
                    color: feature.properties.point.color,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        })
        this.map.mapLayersControl.addOverlay(layer, "Eventos")
        this.map.mapLayersControl._layers.filter((layer) => layer.name == "Eventos")[0].layer.addTo(this.map)

    }
}

export default Map