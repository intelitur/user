import TemplatesManager from "../../utils/TemplatesManager"

import { FILES_BASE_URL } from "../../env"
import DesignController from "../../utils/DesignController"
import Snackbar from "../snackbar/snackbar"

import './css/m_routes.css'
import './css/d_routes.css'
import './routes.css'
import Carousel from "../carousel/carousel"
import RoutesService from "../../services/RoutesService"

class RoutesView {

    constructor() {
        this.promise = this.getRoutes()
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

            const template = await TemplatesManager.getTemplate('routes')

            this.el = TemplatesManager.renderElement('routes', template)

            this.renderContent()
            this.setupListeners()

            if(DesignController.mobile){
                DesignController.hideLoadingBar()
            }
    }

    async renderContent(){
    }

    async getRoutes() {
        const response = await RoutesService.getRoutes()
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
        this.routes = (await response.json())

        this.routes = [...this.routes, ...this.routes, ...this.routes]
        console.log(this.routes)
    }

    setupListeners() {
        // this.el.querySelector(".contest__back").addEventListener("click", this.hide.bind(this))

        // this.el.querySelector(".contest__carousel--button.left").addEventListener("click", this.carousel.pImage.bind(this.carousel))
        // this.el.querySelector(".contest__carousel--button.right").addEventListener("click", this.carousel.nImage.bind(this.carousel))


    }


}

export default new RoutesView()