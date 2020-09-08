import TemplatesManager from "../../utils/TemplatesManager"

import AdsService from "../../services/AdsService"
import { FILES_BASE_URL } from "../../env"
import DesignController from "../../utils/DesignController"
import Snackbar from "../snackbar/snackbar"

import './css/m_ad.css'
import './css/d_ad.css'

class AdView {

    constructor(ad_id) {
        this.ad_id = ad_id
        this.adPromise = this.getAd()
    }

    get loading() {
        // return !this.el.querySelector(".lds-ellipsis").classList.contains("invisible")
    }

    set loading(value) {
        // if (value)
        //     this.el.querySelector(".lds-ellipsis").classList.remove("invisible")
        // else
        //     this.el.querySelector(".lds-ellipsis").classList.add("invisible")
    }

    async render() {
        await this.adPromise

        if (this.ad != undefined) {


            if (DesignController.mobile && document.querySelector(`[render="ad_overlay"]`) == undefined) {
                
                this.where = "ad_overlay"
                document.body.appendChild(
                    TemplatesManager.createHtmlNode(
                        `<section class="ad__overlay">
                            <render render="${this.where}"></render>
                        </section>`
                    )
                )

            }

            const template = await TemplatesManager.getTemplate('ad')

            const view = TemplatesManager.contextPipe(template, {})

            this.el = TemplatesManager.renderElement(this.where, view)

            this.setupListeners()
            this.renderAd()
        }
    }

    async show(where) {
        this.where = where
        if (this.el == undefined) {
            await this.render()
        }
        this.el.parentElement.classList.add("visible")
    }

    async hide() {
        this.el.parentElement.classList.remove("visible")
        this.el.innerHTML = ""
    }

    async getAd() {
        const response = await AdsService.getAd(this.ad_id, true)
        if(response.status != 200){
            if(response.status >= 500){
                Snackbar.error(500)
            }
            else if(response.status >= 400){
                Snackbar.error(400)
            }
            this.loading = false
            return
        }
        this.ad = (await response.json())
    }

    setupListeners() {
        // this.el.querySelector(".ads__button").addEventListener("click", this.toggleFiltersView.bind(this))
        // this.el.querySelector(".ads__back").addEventListener("click", this.hide.bind(this))

        // let disabledListeners = () => {

        //     this.elements.checkbox.ubication.addEventListener("change", ((e) => {
        //         if (e.target.checked) {
        //             navigator.geolocation.getCurrentPosition(
        //                 ((result) => {
        //                     this.coords = result.coords
        //                     this.elements.inputs.ubication.disabled = false
        //                     Snackbar.success("Se tomó la ubicación actual como base")
        //                 }).bind(this),
        //                 ((error) => {
        //                     this.elements.checkbox.ubication.checked = false
        //                     if (error.code == 1) {
        //                         //Usuario bloqueó la vara
        //                         Snackbar.error("Debe brindarle permisos de ubicación a la aplicación")
        //                     }
        //                 }).bind(this)
        //             )
        //         }
        //         else
        //             this.elements.inputs.ubication.disabled = true
        //     }).bind(this))

        //     this.elements.checkbox.dates.addEventListener("change", ((e) => {
        //         if (e.target.checked) {
        //             this.elements.inputs.dates.start.disabled = false
        //             this.elements.inputs.dates.end.disabled = false
        //         }
        //         else {
        //             this.elements.inputs.dates.start.disabled = true
        //             this.elements.inputs.dates.end.disabled = true
        //         }
        //     }).bind(this))
        // }

        // disabledListeners()

        // this.elements.buttons.no.addEventListener("click", (() => {
        //     this.elements.inputs.dates.start.value = ""
        //     this.elements.inputs.dates.end.value = ""
        //     this.elements.inputs.ubication.value = ""

        //     Object.values(this.elements.checkbox).forEach(el => el.checked = false)
        // }).bind(this))

        // this.elements.buttons.yes.addEventListener("click", this.searchAds.bind(this))

    }

    renderAd(){
        console.log(this.ad)
    }


}

export default AdView