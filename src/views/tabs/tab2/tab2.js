import TemplatesManager from "../../../utils/TemplatesManager";
import Map from "../../map/map"
import DesignController from "../../../utils/DesignController";



import './tab2.css'
import EventsService from "../../../services/EventsService";
class Tab2 {

    constructor(){
        this.loadingState = false;
    }

    get loading(){
        return this.loadingState
    }

    set loading(value){
        this.loadingState = value
        if(!DesignController.mobile){
            if(value === true){
                this.el.querySelector(".lds-dual-ring").classList.add("visible")
            }
            else{
                this.el.querySelector(".lds-dual-ring").classList.remove("visible")
            }
        }
    }
    
    async render(){
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
        if(DesignController.mobile){

        }
        else{
            this.setupSrollAnimation()
            this.setupEventListeners()
        }
        this.loading = false;
    }

    async renderMap(){
        const map = new Map()
        await map.render('map')
        map.setMapView(10.471681129073158, -84.64514404535294, 15);

        this.map = map
        console.log(this.map)
    }

    setupEventListeners(){


        document.querySelectorAll(".tab2__left--item--header").forEach((item) => {
            item.addEventListener("click", (() => {
                let parent = item.parentNode
                if(!parent.classList.contains("expanded")){
                    parent.classList.add("expanded")
                    this.showEvents()
                }
                else
                    parent.classList.remove("expanded")
            }).bind(this))
        })

        

        document.querySelector("#tab2_checkbox_Eventos").addEventListener("click", ()=> this.map.toggleLayer("Eventos"))

        this.map.map.on("moveend", this.showEvents.bind(this))
        
    }

    setupSrollAnimation() {
        
        const container = this.el.children[0]
        
        container.addEventListener('scroll', ((e) => {
            const module = Math.floor(container.scrollTop)
            if(module <= 0){
                this.goTo(1)
            }
            else if(module >= 150){
                this.goTo(3)
            }
        }).bind(this))

    }

    goTo(i) {
        if(!DesignController.mobile)
            this.hideInfoContainer()
            
        DesignController.showTab(i);
    }

    show() { 
        this.el.classList.add('active')
     }

    hide() {
        if(!DesignController.mobile)
            this.hideInfoContainer() 
        this.el.classList.remove('active') 
    }

    showInfoContainer(){
        this.el.querySelector('.tab2__left__info--container').classList.add('visible')
    }

    hideInfoContainer(){
        this.el.querySelector('.tab2__left__info--container').classList.remove('visible')
    }

    async showEvents(){
        if(document.querySelector("#tab2_checkbox_Eventos").checked){
            let container = document.querySelector(".tab2__left--item")
            
            if(container.classList.contains("expanded")){
                container = document.querySelector(".tab2__left--item--content")
                container.innerHTML = ""
                let events = await EventsService.getEvents()
                let visibleEvents = events.filter((item) => this.map.isVisible(item.latitude, item.longitude))
    
                let template = await TemplatesManager.getTemplate("event_item")

                visibleEvents.forEach(event => {
                    let node = TemplatesManager.contextPipe(template, event, false)
                    container.appendChild(node)
                    node.addEventListener("click", this.map.showEventPopup.bind(this.map, event.event_id))
                })

                
                
            }

        }
    }
}

export default new Tab2()