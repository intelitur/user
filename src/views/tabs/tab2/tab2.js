import TemplatesManager from "../../../utils/TemplatesManager";
import Map from "../../map/map"
import DesignController from "../../../utils/DesignController";



import './tab2.css'
import EventsService from "../../../services/EventsService";
import Snackbar from "../../snackbar/snackbar";
import AdsService from "../../../services/AdsService";
import footer from "../../footer/footer";
import LayersService from "../../../services/LayersService";
import CompaniesService from "../../../services/CompaniesService";
class Tab2 {

    constructor() {
        this.loadingState = false;
    }

    get loading() {
        return this.loadingState
    }

    set loading(value) {
        this.loadingState = value
        if (!DesignController.mobile) {
            if (value === true) {
                this.el.querySelector(".lds-dual-ring").classList.add("visible")
            }
            else {
                this.el.querySelector(".lds-dual-ring").classList.remove("visible")
            }
        }
    }

    async render() {
        const view = await TemplatesManager.getTemplate('tab2')
        this.el = TemplatesManager.renderElement('tab2', view)


        await this.renderContent()
    }

    async renderContent() {
        const htmlName = DesignController.mobile ? 'mobile_tab2_content' : 'tab2_content'
        const view = await TemplatesManager.getTemplate(htmlName)
        const htmlNode = TemplatesManager.contextPipe(view, this)
        TemplatesManager.renderElement('tab2_content', htmlNode)
        this.loading = true;
        await this.renderMap()
        if (DesignController.mobile) {

        }
        else {
            this.setupSrollAnimation()
            this.setupEventListeners()
        }
        this.loading = false;
    }

    async renderMap() {
        const map = new Map()
        await map.render('map')


        this.map = map
    }

    async setupEventListeners() {
        let response = await EventsService.getEvents()
        if (response.status != 200) {
            if (response.status >= 500) {
                Snackbar.error(500)
            }
            else if (response.status >= 400) {
                Snackbar.error(400)
            }
            return
        }
        this.events = await response.json()

        response = await AdsService.getAds({})
        if (response.status != 200) {
            if (response.status >= 500) {
                Snackbar.error(500)
            }
            else if (response.status >= 400) {
                Snackbar.error(400)
            }
            return
        }
        this.ads = await response.json()

        response = await CompaniesService.getCompanies()
        if (response.status != 200) {
            if (response.status >= 500) {
                Snackbar.error(500)
            }
            else if (response.status >= 400) {
                Snackbar.error(400)
            }
            return
        }
        this.companies = await response.json()

        response = await LayersService.getLayers()
        if (response.status != 200) {
            if (response.status >= 500) {
                Snackbar.error(500)
            }
            else if (response.status >= 400) {
                Snackbar.error(400)
            }
            return
        }
        this.layers = await response.json()
        this.showOtherLayers()

        document.querySelectorAll(".tab2__left--item--header").forEach((item) => {
            item.addEventListener("click", (() => {
                let parent = item.parentNode
                if (!parent.classList.contains("expanded")) {
                    parent.classList.add("expanded")
                    this.showObjects()
                }
                else
                    parent.classList.remove("expanded")
            }).bind(this))
        })



        document.querySelector("#tab2_checkbox_Eventos").addEventListener("click", () => this.map.toggleLayer("Eventos"))
        document.querySelector("#tab2_checkbox_ads").addEventListener("click", () => this.map.toggleLayer("Anuncios"))
        document.querySelector("#tab2_checkbox_companies").addEventListener("click", () => this.map.toggleLayer("Empresas"))


        this.map.map.on("moveend", this.showObjects.bind(this))
    }

    showObjects() {
        this.showAds()
        this.showEvents()
        this.showCompanies()
    }

    setupSrollAnimation() {

        const container = this.el.children[0]

        container.addEventListener('scroll', ((e) => {
            const module = Math.floor(container.scrollTop)
            if (module <= 0) {
                this.goTo(1)
            }
            else if (module >= 150) {
                this.goTo(3)
            }
        }).bind(this))

        const button = this.el.querySelector(".tab2--button")

        button.addEventListener("click", () => footer.showTab(3))

    }

    goTo(i) {
        if (!DesignController.mobile)
            this.hideInfoContainer()

        DesignController.showTab(i);
    }

    show() {
        this.el.classList.add('active')
        if (this.map.userCords == undefined && !this.showingObject) {
            this.map.setInitialPosition()
        }
        this.showingObject = false

    }

    hide() {
        if (!DesignController.mobile)
            this.hideInfoContainer()
        this.el.classList.remove('active')
    }

    showInfoContainer() {
        this.el.querySelector('.tab2__left__info--container').classList.add('visible')
    }

    hideInfoContainer() {
        this.el.querySelector('.tab2__left__info--container').classList.remove('visible')
    }

    async showEvents() {
        if (document.querySelector("#tab2_checkbox_Eventos").checked) {
            let container = document.querySelector(".tab2__left--item")

            if (container.classList.contains("expanded")) {
                container = this.el.querySelector("#events_container")
                container.innerHTML = ""

                let visibleEvents = this.events.filter((item) => this.map.isVisible(item.latitude, item.longitude))

                let template = await TemplatesManager.getTemplate("event_item")

                if(visibleEvents.length > 0){

                    visibleEvents.forEach(event => {
                        let node = TemplatesManager.contextPipe(template, { ...event, color: "inherit" }, false)
                        container.appendChild(node)
                        node.addEventListener("click", this.map.showEventPopup.bind(this.map, event.event_id))
                    })   
                }
                else{
                    container.appendChild(TemplatesManager.contextPipe(`<div style="margin: 10px; color: gray">En esta zona no hay ningún evento</div>`, {}, false))
                }



            }

        }
    }

    async showAds() {

        if (document.querySelector("#tab2_checkbox_ads").checked) {
            let container = document.querySelectorAll(".tab2__left--item")[1]

            if (container.classList.contains("expanded")) {
                container = this.el.querySelector("#ads_container")
                container.innerHTML = ""

                let visibleAds = this.ads.filter((item) => this.map.isVisible(item.latitude, item.longitude))

                let template = await TemplatesManager.getTemplate("event_item")

                if(visibleAds.length > 0){

                    
                    
                    visibleAds.forEach(ad => {
                        let node = TemplatesManager.contextPipe(template, { ...ad, color: "inherit" }, false)
                        container.appendChild(node)
                        node.addEventListener("click", this.map.showAdPopup.bind(this.map, ad.ad_id))
                    })
                }
                else{
                    container.appendChild(TemplatesManager.contextPipe(`<div style="margin: 10px; color: gray">En esta zona no hay ningún anuncio</div>`, {}, false))
                }



            }

        }
    }


    async showOtherLayers() {

        let container = document.querySelectorAll(".tab2__left--item")[2]
        container = this.el.querySelector("#layers_container")
        container.innerHTML = ""

        let template = await TemplatesManager.getTemplate("layer_item")
        let initialized = []
        this.layers.forEach(layer => {
            let node = TemplatesManager.contextPipe(template, { ...layer, color: "inherit" }, false)
            container.appendChild(node)
            node.addEventListener("click", (() => {
                const checkbox = node.querySelector("input")
                checkbox.checked = !checkbox.checked
                let hasToInit = !initialized.includes(layer.layer_name)
                this.map.toggleOtherLayer(layer, hasToInit)
                if(hasToInit == true){
                    initialized.push(layer.layer_name)
                }
            }).bind(this))
        })

    }

    async showCompanies() {

        if (document.querySelector("#tab2_checkbox_companies").checked) {
            let container = document.querySelectorAll(".tab2__left--item")[2]

            if (container.classList.contains("expanded")) {
                container = this.el.querySelector("#companies_container")
                container.innerHTML = ""

                let visibleCompanies = this.companies.filter((item) => item.latitude && item.longitude && this.map.isVisible(item.latitude, item.longitude))

                let template = await TemplatesManager.getTemplate("event_item")

                if(visibleCompanies.length > 0){

                    
                    
                    visibleCompanies.forEach(company => {
                        let node = TemplatesManager.contextPipe(template, { ...company, color: "inherit" }, false)
                        container.appendChild(node)
                        node.addEventListener("click", this.map.showCompanyPopup.bind(this.map, company.company_id))
                    })
                }
                else{
                    container.appendChild(TemplatesManager.contextPipe(`<div style="margin: 10px; color: gray">En esta zona no hay ninguna empresa</div>`, {}, false))
                }



            }

        }

    }
}

export default new Tab2()