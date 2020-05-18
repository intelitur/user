import TemplatesManager from "../../../utils/TemplatesManager";
import Map from "../../map/map"
import DesignController from "../../../utils/DesignController"


import './tab2.css'
class Tab2 {

    constructor(){
    }
    
    async render(){
        const view = await TemplatesManager.getTemplate('tab2')
        this.el = TemplatesManager.renderElement('tab2', view)
        

        await this.renderContent()
    }

    async renderContent() {
        const htmlName = DesignController.mobile ? 'mobile_tab2_content' : 'tab2_content'
        const view = await TemplatesManager.getTemplate(htmlName)
        TemplatesManager.renderElement('tab2_content', view)

        await this.renderMap()
        this.setupSrollAnimation()

    }

    async renderMap(){
        const map = new Map()
        await map.render('map')
        map.setMapView(10.471681129073158, -84.64514404535294, 15);
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
        DesignController.showTab(i);
    }

    show() { this.el.classList.add('active') }

    hide() { this.el.classList.remove('active') }
}

export default new Tab2()