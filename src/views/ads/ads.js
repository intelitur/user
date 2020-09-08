import TemplatesManager from "../../utils/TemplatesManager"

import AdsService from "../../services/AdsService"
import { FILES_BASE_URL } from "../../env"
import DesignController from "../../utils/DesignController"
import Snackbar from "../snackbar/snackbar"

import './css/m_ads.css'
import './css/d_ads.css'

class Ads {

    constructor(where) {
        this.where = where
    }

    get loading() {
        return !this.el.querySelector(".lds-ellipsis").classList.contains("invisible")
    }

    set loading(value) {
        if (value)
            this.el.querySelector(".lds-ellipsis").classList.remove("invisible")
        else
            this.el.querySelector(".lds-ellipsis").classList.add("invisible")
    }

    async render() {
        if(DesignController.mobile){
            
            document.body.appendChild(
                TemplatesManager.createHtmlNode(
                    `<section class="ads__overlay">
                        <render render="ads_overlay"></render>
                    </section>`
                )
            )
        }

        const template = await TemplatesManager.getTemplate('ads')

        this.el = TemplatesManager.renderElement(this.where, template)

        this.setupElements()
        this.setupListeners()
        this.searchAds()
    }

    async show(where) {
        this.where = where
        if (this.el == undefined) {
            await this.render()
        }
        this.el.parentElement.classList.add("visible")
    }

    async hide() {
        if (this.el == undefined) {
            await this.render()
        }
        this.el.parentElement.classList.remove("visible")
    }

    setupElements() {
        let dates = this.el.querySelector("#checkbox_ads_dates")
        let ubication = this.el.querySelector("#checkbox_ads_ubication")

        const checkbox = {
            dates, ubication
        }

        dates = {
            start: this.el.querySelector("#input_ads_start_date"),
            end: this.el.querySelector("#input_ads_end_date")
        }
        ubication = this.el.querySelector("#input_ads_ubication")

        const inputs = {
            dates, ubication
        }

        let yes = this.el.querySelector("#button_ads_yes")
        let no = this.el.querySelector("#button_ads_no")

        const buttons = { yes, no }


        let adsContainer = this.el.querySelector(".ads__item--container")

        this.elements = { checkbox, inputs, buttons, adsContainer }

    }

    setupListeners() {
        this.el.querySelector(".ads__button").addEventListener("click", this.toggleFiltersView.bind(this))
        this.el.querySelector(".ads__back").addEventListener("click", this.hide.bind(this))

        let disabledListeners = () => {

            this.elements.checkbox.ubication.addEventListener("change", ((e) => {
                if (e.target.checked){
                    navigator.geolocation.getCurrentPosition(
                        ((result) => {
                            this.coords = result.coords
                            this.elements.inputs.ubication.disabled = false
                            Snackbar.success("Se tomó la ubicación actual como base")
                        }).bind(this),
                        ((error) => {
                            this.elements.checkbox.ubication.checked = false
                            if(error.code == 1){
                                //Usuario bloqueó la vara
                                Snackbar.error("Debe brindarle permisos de ubicación a la aplicación")
                            }
                        }).bind(this)
                    )
                }
                else
                    this.elements.inputs.ubication.disabled = true
            }).bind(this))

            this.elements.checkbox.dates.addEventListener("change", ((e) => {
                if (e.target.checked) {
                    this.elements.inputs.dates.start.disabled = false
                    this.elements.inputs.dates.end.disabled = false
                }
                else {
                    this.elements.inputs.dates.start.disabled = true
                    this.elements.inputs.dates.end.disabled = true
                }
            }).bind(this))
        }

        disabledListeners()

        this.elements.buttons.no.addEventListener("click", (() => {
            this.elements.inputs.dates.start.value = ""
            this.elements.inputs.dates.end.value = ""
            this.elements.inputs.ubication.value = ""

            Object.values(this.elements.checkbox).forEach(el => el.checked = false)
        }).bind(this))

        this.elements.buttons.yes.addEventListener("click", this.searchAds.bind(this))

    }

    toggleFiltersView() {
        if (this.el.querySelector(".ads__filter--container").classList.contains("expanded")) {
            this.hideFiltersView()
        }
        else
            this.showFiltersView()
    }

    showFiltersView() {
        this.el.querySelector(".ads__filter--container").classList.add("expanded")
        setTimeout((() => this.el.querySelector(".ads__filter--container i").className = "fas fa-times").bind(this), 300)
    }

    hideFiltersView() {
        this.el.querySelector(".ads__filter--container").classList.remove("expanded")
        setTimeout((() => this.el.querySelector(".ads__filter--container i").className = "fas fa-search-plus").bind(this), 300)
    }

    async searchAds() {
        this.loading = true
        let filters = {}
        if (this.elements.checkbox.dates.checked){
            filters.initial_date = this.elements.inputs.dates.start.value
            filters.final_date = this.elements.inputs.dates.end.value 
        }
        if (this.elements.checkbox.ubication.checked && this.coords != undefined){
            filters.meters = this.elements.inputs.ubication.value * 1000
            filters.latitude = this.coords.latitude
            filters.longitude = this.coords.longitude
        }
        const response = await AdsService.getAds(filters)

        if(response.status != 200){
            if(response.status >= 500){
                Snackbar.error(500)
            }
            else if(response.status >= 400){
                Snackbar.error(400)
            }
            this.elements.adsContainer.innerHTML = `<div style="margin: auto; font-size: 12px; color: rgb(196, 71, 71);">Error al conectar con nuestros servidores</div>`
            this.loading = false
            return
        }
        const ads = await response.json()
        this.renderAds(ads)
    }

    async renderAds(ads){
        this.elements.adsContainer.innerHTML = ""
        this.loading = true
        const template = await TemplatesManager.getTemplate(`${DesignController.mobile? 'm': 'd'}_ads_item`);


        let getDateInfo = (event) => {

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
    
        let getMainImage = (ad) => {
            return `${FILES_BASE_URL}/20200826162313572-Full%20Moon%20Ultra%20HD.jpg`
            return ad.images?`${FILES_BASE_URL}/${ad.images[0]}`: ``
        }

        ads.forEach(ad => {
            let htmlNode = TemplatesManager.createHtmlNode(template.patch({name: ad.name, image: getMainImage(ad), ad_id: ad.ad_id, }));
            htmlNode.classList.add("ads__item")
            this.elements.adsContainer.appendChild(htmlNode)
        })
           
        Array.from(this.elements.adsContainer.children).forEach(item => {
            item.addEventListener('click', (()=>{
                DesignController.showAd(item.getAttribute("ad_id"))
            }).bind(this))
        })

        this.loading = false
    }


}

export default new Ads()