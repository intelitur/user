import TemplatesManager from "../../utils/TemplatesManager"

import AdsService from "../../services/AdsService"
import { FILES_BASE_URL } from "../../env"
import DesignController from "../../utils/DesignController"
import Snackbar from "../snackbar/snackbar"

import './css/m_ad.css'
import './css/d_ad.css'
import './ad.css'
import Carousel from "../carousel/carousel"
import tab2 from "../tabs/tab2/tab2"
import footer from "../footer/footer"

class AdView {

    constructor(ad_id) {
        this.ad_id = ad_id
        this.adPromise = this.getAd()
        if(DesignController.mobile){
            DesignController.showLoadingBar()
            this.show('overlay_ad')
        }
        else{
            footer.showTab(2)
            tab2.loading = true
            this.show('tab2__left__info')
        }
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

            if (DesignController.mobile && document.querySelector(`.ad__overlay`) == undefined) {
                
                document.body.appendChild(
                    TemplatesManager.createHtmlNode(
                        `<section class="ad__overlay">
                            <render render="${this.where}"></render>
                        </section>`
                    )
                )

            }

            const template = await TemplatesManager.getTemplate('ad')

            const view = TemplatesManager.contextPipe(template, {...this.ad})

            this.el = TemplatesManager.renderElement(this.where, view)

            this.renderContent()
            this.setupListeners()

            if(DesignController.mobile){
                DesignController.hideLoadingBar()
            }
            else{
                tab2.map.showAdPopup(this.ad.ad_id)
                tab2.loading = false
            }

            
        }
        else{

            if(DesignController.mobile){
                DesignController.hideLoadingBar()
            }
            else{
                tab2.loading = false
                footer.showTab(1)
            }
        }
    }

    async renderContent(){
        this.ad.images = [
            `20200826162313572-Full%20Moon%20Ultra%20HD.jpg`,
            `20200826162313572-Full%20Moon%20Ultra%20HD.jpg`,
        ]
        this.carousel = new Carousel(this.ad.images.map(image => `${FILES_BASE_URL}/${image}`));
        this.carousel.render('ad_carousel')
    }

    async show(where) {
        this.where = where
        await this.render()
        if(this.ad != undefined)
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
            else if(response.status == 404){
                Snackbar.error("El anuncio ya acabó o no existe")
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
        this.el.querySelector(".ad__back").addEventListener("click", this.hide.bind(this))

        this.el.querySelector(".ad__carousel--button.left").addEventListener("click", this.carousel.pImage.bind(this.carousel))
        this.el.querySelector(".ad__carousel--button.right").addEventListener("click", this.carousel.nImage.bind(this.carousel))

        this.el.querySelector(".ad__address--button").addEventListener("click", (() => { 
            tab2.map.showAdPopup(this.ad.ad_id); 
            if(DesignController.mobile){
                footer.showTab(2);
                DesignController.hideOverlay(true); 
            }
        }).bind(this))

    }

    renderAd(){
        //console.log(this.ad)
    }


}

export default AdView