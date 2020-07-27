import TemplatesManager from "../../utils/TemplatesManager";
import leaflet from "leaflet/dist/leaflet";
import leaflet_fullscreen from "leaflet.fullscreen/Control.FullScreen"
import EventsService from '../../services/EventsService'
import GeoJSONUtils from '../../utils/GeoJSONUtils'
import DesignController from '../../utils/DesignController'
import tab2 from "../tabs/tab2/tab2";


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
        this.eventLayers = [];
        this.layers = [];
    }

    async render(htmlName) {
        const view = await TemplatesManager.getTemplate('map')
        this.el = TemplatesManager.renderElement(htmlName, view)
        console.log(await this.getUserPosition())
        this.userCords = await this.getUserPosition()
        await this.renderMap()
    }

    async getUserPosition(){
        const promise = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (result) => resolve(result),
                (error) => reject(error),
                {enableHighAccuracy: true, timeout: 10000}
            )
        })

        try{
            const response = await promise
            console.log(response)
            return response.coords
        }
        catch (error) {
            console.error(error)
            return undefined
        }

    }

    async renderMap() {
        const { tileConfig, mapConfig } = this.config
        const OSM = leaflet.tileLayer(tileConfig.tileURL, tileConfig.options)
        const googleSatelite = leaflet.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3']
        })
        const googleStreets = leaflet.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3']
        })
        const mapLayersControl = leaflet.control.layers(undefined, undefined, {collapsed: false})
        

        this.map = leaflet.map(mapConfig.elementName,
            {
                layers: [
                    OSM,
                    googleSatelite,
                    googleStreets
                ],
                ...mapConfig.options,
            }
        )

        const baseLayers = {
            "Mapa": OSM,
            "Satélite": googleSatelite,
            "Google": googleStreets
        }

        this.map.addControl(leaflet.control.layers(baseLayers, undefined, {collapsed: false}))

        if (DesignController.mobile)
            this.map.addControl(mapLayersControl.setPosition('bottomleft'))
        this.map.mapLayersControl = mapLayersControl
        this.setupEventsTile()

        if(this.userCords){
            this.setMapView(this.userCords.latitude, this.userCords.longitude, 15)
        }
        else{
            this.setMapView(10.471681129073158, -84.64514404535294, 15);
        }
    }

    setMapView(lat, lng, zoom) {
        this.map.setView([lat, lng], zoom);
    }

    flyTo(lat, lng, zoom) {
        this.map.flyTo([lat, lng], zoom);
    }

    async setupEventsTile() {

        const getDateInfo = event => {

            const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    
            const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    
            const date = new Date(event.date_range.initial_date.split("T")[0])
    
            
            const monthName = months[date.getMonth()]
    
            const dayName = days[date.getDay()]
    
            const dateI = date.getDate() + 1
    
            return {
                monthName,
                dayName,
                dateI
            }
        }

        tab2.loading = true;
        let events = await EventsService.getEvents()

        const geoJSON = GeoJSONUtils.buildEventsGeoJson(events)

        const tooltipHTML =  await TemplatesManager.getTemplate('map.event.tooltip');

        let onEachFeature = (feature, layer) => {
            this.eventLayers.push(layer)
            const dateString = feature.properties.point.date_range.initial_date.split("T")[0].split("-")
            
            const schedule = !feature.properties.point.initial_time? " todo el día" : (" a las " + feature.properties.point.initial_time.substring(0, 5))
            const tooltip = tooltipHTML.patch({dateString, feature, layer, schedule, ...getDateInfo(feature.properties.point)})

            const htmlNode = TemplatesManager.createHtmlNode(tooltip)
            htmlNode.addEventListener('click', (async function() {
                await DesignController.showEvent(feature.properties.point.event_id)
            }))
            layer.bindPopup(htmlNode)
        }

        var icon = leaflet.icon({
            iconUrl: 'assets/event_icon.png',
        
            iconSize:     [40, 45], // size of the icon
            iconAnchor:   [20, 22.5], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, -12] // point from which the popup should open relative to the iconAnchor
        });

        const layer = leaflet.geoJSON(geoJSON, {
            onEachFeature: onEachFeature,

            pointToLayer: function (feature, latlng) {
                //return leaflet.marker(latlng, {icon})
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
        if(DesignController.mobile)
            this.map.mapLayersControl.addOverlay(layer, "Eventos")
        this.layers.push({name: "Eventos", layer})
        this.toggleLayer("Eventos")

        tab2.loading = false;
    }

    async showEventPopup(event_id){
        let eventLayer = this.eventLayers.find((layer) => layer.feature.properties.point.event_id == event_id)

        await eventLayer._popup.update()
        eventLayer._popup
        .setLatLng(eventLayer._latlng)
        .openOn(this.map)
        
        this.map.flyTo(eventLayer._latlng, 17)
    }

    toggleLayer(name){
        const layer = this.layers.find((layer) => layer.name == name).layer
        if(this.map.hasLayer(layer))
            this.map.removeLayer(layer)
        else    
            layer.addTo(this.map)
    }

    isVisible(lat, lng){ 
        return this.map.getBounds().contains([lat, lng])
    }
}

export default Map