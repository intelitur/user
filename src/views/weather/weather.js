import TemplatesManager from "../../utils/TemplatesManager"

import { FILES_BASE_URL } from "../../env"
import DesignController from "../../utils/DesignController"
import Snackbar from "../snackbar/snackbar"

import './css/m_weather.css'
import './css/d_weather.css'
import WeatherService from "../../services/WeatherService"

class Weather {

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
                    `<section class="weather__overlay">
                        <render render="weather_overlay"></render>
                    </section>`
                )
            )
        }

        const template = await TemplatesManager.getTemplate('weather')

        this.el = TemplatesManager.renderElement(this.where, template)

        const response = await WeatherService.getWeather()
        const data = await response.json()

        this.el.innerHTML = this.el.innerHTML.patch(data)
        
        this.setupListeners()
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

    setupListeners() {
        this.el.querySelector(".weather__back").addEventListener("click", this.hide.bind(this))
    }

}

export default new Weather()