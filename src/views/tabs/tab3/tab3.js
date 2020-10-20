import DesignController from "../../../utils/DesignController";
import TemplatesManager from "../../../utils/TemplatesManager";

import './css/d_tab3.css';
import './css/m_tab3.css';

class Tab3 {

    constructor(){
    }
    
    async render(){
        const view = await TemplatesManager.getTemplate('tab3')
        this.el = TemplatesManager.renderElement('tab3', view)

        await this.renderContent()
    }

    async renderContent(){
        const view = await TemplatesManager.getTemplate(`${DesignController.mobile? 'm': 'd'}_tab3`)

        const node = TemplatesManager.createHtmlNode(view)

        this.el.appendChild(node)
    }

    show() { this.el.classList.add('active') }

    hide() { this.el.classList.remove('active') }
}

export default new Tab3()