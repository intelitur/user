import TemplatesManager from "../../utils/TemplatesManager"

import { FILES_BASE_URL } from "../../env"
import DesignController from "../../utils/DesignController"
import Snackbar from "../snackbar/snackbar"

import './css/m_contest.css'
import './css/d_contest.css'
import './contest.css'
import Carousel from "../carousel/carousel"
import ContestsService from "../../services/ContestsService"

class ContestView {

    constructor(contest_id) {
        this.contest_id = contest_id
        this.contestPromise = this.getContest()
        if(DesignController.mobile){
            DesignController.showLoadingBar()
            this.show('overlay_contest')
        }
        else{
            this.show('tab1__left__info')
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
        await this.contestPromise
        if (this.contest != undefined) {
            if (DesignController.mobile && document.querySelector(`.contest__overlay`) == undefined) {
                document.body.appendChild(
                    TemplatesManager.createHtmlNode(
                        `<section class="contest__overlay">
                            <render render="${this.where}"></render>
                        </section>`
                    )
                )
            }

            const template = await TemplatesManager.getTemplate('contest')
            //console.log("UNIUNINEFINEFI", template, "")

            const view = TemplatesManager.contextPipe(template, {...this.contest})

            this.el = TemplatesManager.renderElement(this.where, view)

            this.renderContent()
            this.setupListeners()

            if(DesignController.mobile){
                DesignController.hideLoadingBar()
            }
        }
        else{
            if(DesignController.mobile){
                DesignController.hideLoadingBar()
            }
        }
    }

    async renderContent(){
        // this.contest.images = [
        //     `20200826162313572-Full%20Moon%20Ultra%20HD.jpg`,
        //     `20200826162313572-Full%20Moon%20Ultra%20HD.jpg`,
        // ]
        this.carousel = new Carousel(this.contest.images.map(image => `${FILES_BASE_URL}/${image.name}`));
        this.carousel.render('contest_carousel')
    }

    async show(where) {
        this.where = where
        await this.render()
        if(this.contest != undefined)
            this.el.parentElement.classList.add("visible")
    }

    async hide() {
        this.el.parentElement.classList.remove("visible")
        this.carousel.clear()
        this.el.innerHTML = ""
    }

    async getContest() {
        const response = await ContestsService.getContest(this.contest_id)
        if(response.status != 200){
            if(response.status >= 500){
                Snackbar.error(500)
            }
            else if(response.status == 404){
                Snackbar.error("El concurso ya acabó o no existe")
            }
            else if(response.status >= 400){
                Snackbar.error(400)
            }
            this.loading = false
            return
        }
        this.contest = (await response.json())
        console.log(this.contest)
    }

    setupListeners() {
        this.el.querySelector(".contest__back").addEventListener("click", this.hide.bind(this))

        this.el.querySelector(".contest__carousel--button.left").addEventListener("click", this.carousel.pImage.bind(this.carousel))
        this.el.querySelector(".contest__carousel--button.right").addEventListener("click", this.carousel.nImage.bind(this.carousel))

        this.el.querySelector(".contest__address--button").addEventListener("click", (() => {  
            
            if(DesignController.mobile){
                DesignController.hideOverlay(true); 
            }
        }).bind(this))

    }


}

export default ContestView