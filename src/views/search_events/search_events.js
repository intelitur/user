import TemplatesManager from "../../utils/TemplatesManager"


import './search_events.css'
import './css/m_search_events.css'
import './css/d_search_events.css'
import EventsService from "../../services/EventsService"
import CategoryService from "../../services/CategoryService"
import { FILES_BASE_URL } from "../../env"
import DesignController from "../../utils/DesignController"
import Snackbar from "../snackbar/snackbar"

class SearchEvents {

    constructor() {

    }

    get loading(){
        return !this.el.querySelector(".lds-ellipsis").classList.contains("invisible")
    }

    set loading(value){
        if(value)
            this.el.querySelector(".lds-ellipsis").classList.remove("invisible")
        else
            this.el.querySelector(".lds-ellipsis").classList.add("invisible")
    }

    async render() {
        let renderElement = 'tab1_search_events'
        if(DesignController.mobile)
            renderElement = 'search_events'

        const template = await TemplatesManager.getTemplate('search_events')

        this.el = TemplatesManager.renderElement(renderElement, template)

        this.setupElements()
        this.setupListeners()
        this.setupCategories()
        this.searchEvents()
    }

    async show() {
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
        let name = this.el.querySelector("#checkbox_search_events_name")
        let dates = this.el.querySelector("#checkbox_search_events_dates")
        let category = this.el.querySelector("#checkbox_search_events_category")
        let ubication = this.el.querySelector("#checkbox_search_events_ubication")

        const checkbox = {
            name, dates, category, ubication
        }

        name = this.el.querySelector("#input_search_events_name")
        dates = {
            start: this.el.querySelector("#input_search_events_start_date"),
            end: this.el.querySelector("#input_search_events_end_date")
        }
        category = this.el.querySelector("#select_search_events_categories")
        ubication = this.el.querySelector("#input_search_events_ubication")

        const inputs = {
            name, dates, category, ubication
        }

        let yes = this.el.querySelector("#button_search_events_yes")
        let no = this.el.querySelector("#button_search_events_no")

        const buttons = { yes, no }


        let eventsContainer = this.el.querySelector(".search__events__events--container")

        this.elements = { checkbox, inputs, buttons, eventsContainer }
    
    }

    setupListeners() {
        this.el.querySelector(".search__events__button").addEventListener("click", this.toggleFiltersView.bind(this))
        this.el.querySelector(".search__events__back").addEventListener("click", this.hide.bind(this))



        let disabledListeners = () => {
            this.elements.checkbox.name.addEventListener("change", ((e) => {
                if (e.target.checked)
                    this.elements.inputs.name.disabled = false
                else
                    this.elements.inputs.name.disabled = true
            }).bind(this))

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

            this.elements.checkbox.category.addEventListener("change", ((e) => {
                if (e.target.checked)
                    this.elements.inputs.category.disabled = false
                else
                    this.elements.inputs.category.disabled = true
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
            this.elements.inputs.name.value = ""
            this.elements.inputs.dates.start.value = ""
            this.elements.inputs.dates.end.value = ""
            this.elements.inputs.ubication.value = ""
            this.elements.inputs.category.value = ""

            Object.values(this.elements.checkbox).forEach(el => el.checked = false)
        }).bind(this))

        this.elements.buttons.yes.addEventListener("click", this.searchEvents.bind(this))
    }

    async setupCategories() {
        this.categories = await CategoryService.getEventsCategories()

        let template = `<option value="{category_id}">{name}</option>`

        this.categories.forEach((category) => {
            let htmlNode = TemplatesManager.contextPipe(template, category, false)
            this.elements.inputs.category.appendChild(htmlNode)
        })

        this.elements.inputs.category.value = ""
    }

    toggleFiltersView() {
        if (this.el.querySelector(".search__events__filter--container").classList.contains("expanded")) {
            this.hideFiltersView()
        }
        else
            this.showFiltersView()
    }

    showFiltersView() {
        this.el.querySelector(".search__events__filter--container").classList.add("expanded")
        setTimeout((() => this.el.querySelector(".search__events__filter--container i").className = "fas fa-times").bind(this), 300)
    }

    hideFiltersView() {
        this.el.querySelector(".search__events__filter--container").classList.remove("expanded")
        setTimeout((() => this.el.querySelector(".search__events__filter--container i").className = "fas fa-search-plus").bind(this), 300)
    }

    async searchEvents() {
        this.loading = true
        let filters = {}
        if (this.elements.checkbox.name.checked)
            filters.name = this.elements.inputs.name.value
        if (this.elements.checkbox.dates.checked){
            filters.initial_date = this.elements.inputs.dates.start.value
            filters.final_date = this.elements.inputs.dates.end.value 
        }
        if (this.elements.checkbox.category.checked)
            filters.category_id = this.elements.inputs.category.value
        if (this.elements.checkbox.ubication.checked && this.coords != undefined){
            filters.meters = this.elements.inputs.ubication.value * 1000
            filters.latitude = this.coords.latitude
            filters.longitude = this.coords.longitude
        }
        const response = await EventsService.getEventsFiltered(filters)
        if(response.status != 200){
            if(response.status >= 500){
                Snackbar.error(500)
            }
            else if(response.status >= 400){
                Snackbar.error(400)
            }
            this.elements.eventsContainer.innerHTML = `<div style="margin: auto; font-size: 12px; color: rgb(196, 71, 71);">Error al conectar con nuestros servidores</div>`
            this.loading = false
            return
        }
        let events = await response.json()
        this.renderEvents(events)
    }

    async renderEvents(events){
        this.elements.eventsContainer.innerHTML = ""
        this.loading = true
        const template = await TemplatesManager.getTemplate(`${DesignController.mobile? 'm': 'd'}_tab1_event_view`);


        let getDateInfo = (event) => {

                const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        
                const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
        
                const date = new Date(event.date_range.initial_date.split("T")+"-00:00")
        
                
                const monthName = months[date.getMonth()]
        
                const dayName = days[date.getDay() - 1]
        
                const dateI = date.getDate() 
        
                return {
                    monthName,
                    dayName,
                    dateI
                }
        }
    
        let getMainImage = (event) => {
            return event.images && event.images.length > 0?`${FILES_BASE_URL}/${event.images[0].name}`: ``
        }

        events.forEach(event => {
            let htmlNode = TemplatesManager.createHtmlNode(template.patch({name: event.name, color: event.color, ...getDateInfo(event), main_image: getMainImage(event), event_id: event.event_id}));
            htmlNode.className = ""
            htmlNode.classList.add("search__events__event--item")
            this.elements.eventsContainer.appendChild(htmlNode)
        })
           
        Array.from(this.elements.eventsContainer.children).forEach(item => {

            item.addEventListener('click', (()=>{
                DesignController.showEvent(item.getAttribute("event_id"))
                if(!DesignController.mobile){
                    this.hide()
                }
            }).bind(this))
        })

        this.loading = false
    }
}

export default new SearchEvents()