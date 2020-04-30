import TemplatesManager from "../../utils/TemplatesManager";
import leaflet from "leaflet/dist/leaflet";
import leaflet_fullscreen from "leaflet.fullscreen/Control.FullScreen"
import EventsService from '../../services/EventsService'
import GeoJSONUtils from '../../utils/GeoJSONUtils'

class Map{
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
    }){
        this.config = config
    }

    async render(htmlName){
        const view = await TemplatesManager.getTemplate('map')
        this.el = TemplatesManager.renderElement(htmlName, view)
        
        await this.renderMap()
    }

    async renderMap(){
        const {tileConfig, mapConfig} = this.config
        const mainTile = leaflet.tileLayer(tileConfig.tileURL, tileConfig.options)
        this.map = leaflet.map(mapConfig.elementName, 
            {
                layers: [mainTile],
                ...mapConfig.options,
            }
        )

        this.setupEventsTile()
    }

    setMapView(lat, lng, zoom){
        this.map.setView([lat, lng], zoom);
    }

    flyTo(lat, lng, zoom){
        this.map.flyTo([lat, lng], zoom);
    }

    async setupEventsTile(){
        const events = await EventsService.getEvents()

        console.log(GeoJSONUtils.buildEventsGeoJson(events))

    }
}

export default Map