import TemplatesManager from "../../../utils/TemplatesManager";
import Map from "../../map/map"

class Tab2 {

    constructor(){
    }
    
    async render(){
        const view = await TemplatesManager.getTemplate('tab2')
        this.el = TemplatesManager.renderElement('tab2', view)

        await this.renderContent()
    }

    async renderContent(){
        const map = new Map()
        await map.render('map')
        map.setMapView(10.471681129073158, -84.64514404535294, 15);
    }

    show() { this.el.classList.add('active') }

    hide() { this.el.classList.remove('active') }
}

export default new Tab2()