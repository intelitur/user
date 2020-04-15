import TemplatesManager from "../../../utils/TemplatesManager";

class Tab4 {

    constructor() {
    }

    async render() {
        const view = await TemplatesManager.getTemplate('tab4')
        this.el = TemplatesManager.renderElement('tab4', view)
    }

    show() { this.el.classList.add('active') }

    hide() { this.el.classList.remove('active') }
}

export default new Tab4()