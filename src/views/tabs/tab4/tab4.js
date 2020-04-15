import TemplatesManager from "../../../utils/TemplatesManager";

class Tab4 {

    constructor() {
    }

    async render() {
        const view = await TemplatesManager.getTemplate('tab4')
        this.el = TemplatesManager.getRenderElement('tab4')
        this.el.innerHTML = view
    }

    show() { this.el.children[0].classList.add('active') }

    hide() { this.el.children[0].classList.remove('active') }
}

export default new Tab4()