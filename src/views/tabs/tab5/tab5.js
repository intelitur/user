import TemplatesManager from "../../../utils/TemplatesManager";


import './tab5.css'
import './css/m_login.css'
import AuthService from "../../../auth/AuthService";
import DesignController from "../../../utils/DesignController";

class Tab5 {

    constructor() {
    }

    async render() {
        const view = await TemplatesManager.getTemplate('tab5')
        this.el = TemplatesManager.renderElement('tab5', view)

        if(AuthService.isLogged()){

        }
        else{
            if(DesignController.mobile){
                const template = await TemplatesManager.getTemplate('m_login')
                
                const node = TemplatesManager.createHtmlNode(template)

                this.el.appendChild(node)
            }
        }
    }

    show() { this.el.classList.add('active') }

    hide() { this.el.classList.remove('active') }
}

export default new Tab5()