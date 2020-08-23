import TemplatesManager from "../../utils/TemplatesManager"


import './search_events.css'
import './css/m_search_events.css'
import './css/d_search_events.css'
import EventsService from "../../services/EventsService"
import CategoryService from "../../services/CategoryService"
import { IMAGES_BASE_URL } from "../../env"
import DesignController from "../../utils/DesignController"

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
        const template = await TemplatesManager.getTemplate('search_events')

        this.el = TemplatesManager.renderElement('search_events', template)

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
                if (e.target.checked)
                    this.elements.inputs.ubication.disabled = false
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
        if (this.elements.checkbox.dates.checked)
            filters.date_range = { start: this.elements.inputs.dates.start.value, end: this.elements.inputs.dates.end.value }
        if (this.elements.checkbox.category.checked)
            filters.category = this.elements.inputs.category.value
        if (this.elements.checkbox.ubication.checked)
            filters.ubication = this.elements.inputs.ubication.value
        const events = await EventsService.getEventsFiltered(filters)
        console.log(events)
        this.renderEvents(events)
    }

    async renderEvents(events){
        this.loading = true
        const template = await TemplatesManager.getTemplate('m_tab1_event_view');


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
    
        let getMainImage = (event) => {

            return event.images?`${IMAGES_BASE_URL}/${event.images[0]}`: ``
        }

        events.forEach(event => {
            let htmlNode = TemplatesManager.createHtmlNode(template.patch({name: event.name, color: event.color, ...getDateInfo(event), main_image: getMainImage(event), event_id: event.event_id}));
            htmlNode.className = ""
            htmlNode.classList.add("search__events__event--item")
            this.elements.eventsContainer.appendChild(htmlNode)
        })
           
        Array.from(this.elements.eventsContainer.children).forEach(item => {
            item.getAttribute("event_id")
            item.addEventListener('click', DesignController.showEvent.bind(this, item.getAttribute("event_id")))
        })

        this.loading = false
    }
}

export default new SearchEvents()