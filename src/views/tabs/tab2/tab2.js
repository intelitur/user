import TemplatesManager from "../../../utils/TemplatesManager";
import Map from "../../map/map"
import DesignController from "../../../utils/DesignController";



import './tab2.css'
import EventsService from "../../../services/EventsService";
import Snackbar from "../../snackbar/snackbar";
import AdsService from "../../../services/AdsService";
import footer from "../../footer/footer";
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

        document.querySelectorAll(".tab2__left--item--header").forEach((item) => {
            item.addEventListener("click", (() => {
                let parent = item.parentNode
                if (!parent.classList.contains("expanded")) {
                    parent.classList.add("expanded")
                    this.showObjects()
                    console.log("CLICK")
                }
                else
                    parent.classList.remove("expanded")
            }).bind(this))
        })



        document.querySelector("#tab2_checkbox_Eventos").addEventListener("click", () => this.map.toggleLayer("Eventos"))
        document.querySelector("#tab2_checkbox_ads").addEventListener("click", () => this.map.toggleLayer("Anuncios"))

        
        this.map.map.on("moveend", this.showObjects.bind(this))
    }

    showObjects(){
        this.showAds()
        this.showEvents()
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

        button.addEventListener("click", ()=> footer.showTab(3))

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

                visibleEvents.forEach(event => {
                    let node = TemplatesManager.contextPipe(template, {...event, color: "inherit"}, false)
                    container.appendChild(node)
                    node.addEventListener("click", this.map.showEventPopup.bind(this.map, event.event_id))
                })



            }

        }
    }

    async showAds(){
        if (document.querySelector("#tab2_checkbox_ads").checked) {
            let container = document.querySelectorAll(".tab2__left--item")[1]

            if (container.classList.contains("expanded")) {
                container = this.el.querySelector("#ads_container")
                container.innerHTML = ""

                let visibleAds = this.ads.filter((item) => this.map.isVisible(item.latitude, item.longitude))

                let template = await TemplatesManager.getTemplate("event_item")

                visibleAds.forEach(ad => {
                    let node = TemplatesManager.contextPipe(template, {...ad, color: "inherit"}, false)
                    container.appendChild(node)
                    node.addEventListener("click", this.map.showAdPopup.bind(this.map, ad.ad_id))
                })



            }

        }
    }
}

export default new Tab2()