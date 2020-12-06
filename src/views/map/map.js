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
import './css/map.event.tooltip.css'
import Snackbar from "../snackbar/snackbar";
import { FILES_BASE_URL } from "../../env";
import AdsService from "../../services/AdsService";
import LayersService from "../../services/LayersService";


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
        this.adsLayers = [];
        this.layers = [];
    }

    async render(htmlName) {
        const view = await TemplatesManager.getTemplate('map')
        this.el = TemplatesManager.renderElement(htmlName, view)
        await this.renderMap()

    }

    async setInitialPosition() {
        this.userCords = await this.getUserPosition()
        if (this.userCords.latitude && this.userCords.longitude) {
            this.setMapView(this.userCords.latitude, this.userCords.longitude, 15)
        }
    }

    async getUserPosition() {
        const promise = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (result) => resolve(result),
                (error) => reject(error),
                { enableHighAccuracy: true, timeout: 10000 }
            )
        })

        try {
            const response = await promise
            return response.coords
        }
        catch (error) {
            return { error: error }
        }

    }

    async renderMap() {
        const { tileConfig, mapConfig } = this.config
        const OSM = leaflet.tileLayer(tileConfig.tileURL, tileConfig.options)
        const googleSatelite = leaflet.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        })
        const googleStreets = leaflet.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        })
        const mapLayersControl = leaflet.control.layers(undefined, undefined, { collapsed: false })


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
            "OSM": OSM,
            "Satélite": googleSatelite,
            "Calles": googleStreets
        }

        const baseControl = leaflet.control.layers(baseLayers, undefined, { collapsed: false })

        this.map.addControl(baseControl)

        if (DesignController.mobile)
            this.map.addControl(mapLayersControl.setPosition('bottomleft'))
        this.map.mapLayersControl = mapLayersControl
        this.setupEventsTile()
        this.setupAdsTile()

        this.setMapView(10.471681129073158, -84.64514404535294, 15);

        baseControl._layerControlInputs[2].checked = true
        baseControl._onInputClick()
    }

    setMapView(lat, lng, zoom) {
        this.map.setView([lat, lng], zoom);
    }

    flyTo(lat, lng, zoom) {
        this.map.flyTo([lat, lng], zoom);
    }

    async setupAdsTile() {



        tab2.loading = true;
        let response = await AdsService.getAds({})

        if (response.status != 200) {
            if (response.status >= 500) {
                Snackbar.error(500)
            }
            else if (response.status >= 400) {
                Snackbar.error(400)
            }
            this.loading = false
            return
        }

        let ads = await response.json()

        const geoJSON = GeoJSONUtils.buildAdsGeoJson(ads)



        let onEachFeature = (feature, layer) => {
            this.adsLayers.push(layer)

            const tooltip = `<div>${feature.properties.point.name}</div>`

            const htmlNode = TemplatesManager.createHtmlNode(tooltip)
            htmlNode.addEventListener('click', (async function () {
                await DesignController.showAd(feature.properties.point.ad_id)
            }))
            layer.bindPopup(htmlNode)
        }

        var icon = leaflet.icon({
            iconUrl: 'assets/event_icon.png',

            iconSize: [40, 35], // size of the icon
            iconAnchor: [20, 17.5], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -12] // point from which the popup should open relative to the iconAnchor
        });

        const layer = leaflet.geoJSON(geoJSON, {
            onEachFeature: onEachFeature,

            pointToLayer: function (feature, latlng) {
                //return leaflet.marker(latlng, {icon})
                return leaflet.circleMarker(latlng, {
                    radius: 8,
                    fillColor: 'red',
                    color: 'red',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        })
        if (DesignController.mobile)
            this.map.mapLayersControl.addOverlay(layer, "Anuncions")
        this.layers.push({ name: "Anuncios", layer })
        this.toggleLayer("Anuncios")

        tab2.loading = false;
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
        let response = await EventsService.getEvents()

        if (response.status != 200) {
            if (response.status >= 500) {
                Snackbar.error(500)
            }
            else if (response.status >= 400) {
                Snackbar.error(400)
            }
            this.loading = false
            return
        }

        let events = await response.json()

        const geoJSON = GeoJSONUtils.buildEventsGeoJson(events)

        const tooltipHTML = await TemplatesManager.getTemplate('map.event.tooltip');

        let onEachFeature = (feature, layer) => {
            this.eventLayers.push(layer)
            const dateString = feature.properties.point.date_range.initial_date.split("T")[0].split("-")

            const schedule = !feature.properties.point.initial_time ? " todo el día" : (" a las " + feature.properties.point.initial_time.substring(0, 5))
            const tooltip = tooltipHTML.patch({ dateString, feature, layer, schedule, ...getDateInfo(feature.properties.point) })

            const htmlNode = TemplatesManager.createHtmlNode(tooltip)
            htmlNode.addEventListener('click', (async function () {
                await DesignController.showEvent(feature.properties.point.event_id)
            }))
            layer.bindPopup(htmlNode)
        }

        var icon = leaflet.icon({
            iconUrl: `${FILES_BASE_URL}/20200912175227166-marker__red.png`,
            iconSize: [40, 40], // size of the icon
            iconAnchor: [20, 0], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -12] // point from which the popup should open relative to the iconAnchor
        });

        const layer = leaflet.geoJSON(geoJSON, {
            onEachFeature: onEachFeature,

            pointToLayer: function (feature, latlng) {
                // return leaflet.marker(latlng, {
                //     icon: icon
                // });
                return leaflet.circleMarker(latlng, {
                    radius: 8,
                    fillColor: 'blue',
                    color: 'blue',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        })
        if (DesignController.mobile)
            this.map.mapLayersControl.addOverlay(layer, "Eventos")
        this.layers.push({ name: "Eventos", layer })
        this.toggleLayer("Eventos")

        tab2.loading = false;
    }

    async showEventPopup(event_id) {
        console.log(event_id)
        let eventLayer = this.eventLayers.find((layer) => layer.feature.properties.point.event_id == event_id)

        await eventLayer._popup.update()
        eventLayer._popup
            .setLatLng(eventLayer._latlng)
            .openOn(this.map)

        this.map.flyTo(eventLayer._latlng, 17)
    }

    async showAdPopup(ad_id) {
        let adLayer = this.adsLayers.find((layer) => layer.feature.properties.point.ad_id == ad_id)

        await adLayer._popup.update()
        adLayer._popup
            .setLatLng(adLayer._latlng)
            .openOn(this.map)

        this.map.flyTo(adLayer._latlng, 17)
    }

    toggleLayer(name) {
        const layer = this.layers.find((layer) => layer.name == name).layer
        if (this.map.hasLayer(layer))
            this.map.removeLayer(layer)
        else
            layer.addTo(this.map)
    }

    isVisible(lat, lng) {
        return this.map.getBounds().contains([lat, lng])
    }

    async toggleOtherLayer(layerB, b) {
        if (b != undefined) {
            if (b == true) {
                const response = await LayersService.getLayerPoints(layerB.layer_id)
                const points = await response.json()

                const geoJSON = GeoJSONUtils.buildOtherLayerGeoJson(points, layerB)

                const onEachFeature = (feature, layer) => {
                    
                    
                    const properties = {...feature.properties}
                    
                    const layerAtributtes = {...layerB}
                    
                    delete layerAtributtes.is_active
                    delete layerAtributtes.layer_id
                    delete layerAtributtes.layer_name
                    
                    const keys = Object.keys(layerAtributtes)
                    
                    let tooltip = ""
                    keys.forEach(key => {
                        tooltip += `<b>${layerAtributtes[key].name}:</b> \t ${properties[key]} <br>`
                    })

                    layer.bindPopup(tooltip)
                }

                const layer = leaflet.geoJSON(geoJSON, {
                    onEachFeature: onEachFeature,

                    pointToLayer: function (feature, latlng) {
                        // return leaflet.marker(latlng, {
                        //     icon: icon
                        // });
                        return leaflet.circleMarker(latlng, {
                            radius: 8,
                            fillColor: 'green',
                            color: 'green',
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.6
                        });
                    }
                })
                if (DesignController.mobile)
                    this.map.mapLayersControl.addOverlay(layer, layerB.layer_name)
                this.layers.push({ name: layerB.layer_name, layer })
                this.toggleLayer(layerB.layer_name)
            }
            else {
                this.toggleLayer(layerB.layer_name)
            }
        }
    }
}

export default Map