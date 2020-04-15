import TemplatesManager from "../../../utils/TemplatesManager";

class Tab3 {

    constructor(){
    }
    
    async render(){
        const view = await TemplatesManager.getTemplate('tab3')
        this.el = TemplatesManager.renderElement('tab3', view)
    }

    show() { this.el.classList.add('active') }

    hide() { this.el.classList.remove('active') }
}

export default new Tab3()