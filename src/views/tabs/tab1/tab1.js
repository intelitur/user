import TemplatesManager from "../../../utils/TemplatesManager";

class Tab1 {

    constructor(){
    }
    
    async render(){
        const view = await TemplatesManager.getTemplate('tab1')
        this.el = TemplatesManager.getRenderElement('tab1')
        this.el.innerHTML = view
    }

    show() { this.el.children[0].classList.add('active') }

    hide() { this.el.children[0].classList.remove('active') }
}

export default new Tab1()