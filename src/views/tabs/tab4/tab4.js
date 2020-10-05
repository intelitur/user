import DesignController from "../../../utils/DesignController";
import TemplatesManager from "../../../utils/TemplatesManager";


import './css/m_tab2.css';

class Tab4 {

    constructor() {
    }

    async render() {
        const view = await TemplatesManager.getTemplate('tab4')
        this.el = TemplatesManager.renderElement('tab4', view)

        this.renderContent()
    }

    async renderContent(){
        const view = await TemplatesManager.getTemplate(`${DesignController.mobile? 'm': 'd'}_tab2`)

        const node = TemplatesManager.createHtmlNode(view)

        this.el.appendChild(node)

        this.back = this.el.querySelector(".tab2__back")
        this.items =  this.el.querySelectorAll(".tab2__item")
        if(DesignController.mobile)
            this.setupEventListeners()
    }

    setupEventListeners(){

        this.items.forEach(item => {
            console.log(item)
            item.addEventListener("click", () => {
                if(!item.classList.contains("expanded")){
                    item.style.zIndex = "1"
                    item.classList.add("expanded")
                    setTimeout(() => {
                        this.back.classList.add("visible"), 800
                    })
                }
            })
        })

        this.back.addEventListener("click", (()=> {
            this.back.classList.remove("visible")
            this.items.forEach(item => {
                item.classList.remove("expanded")
                setTimeout(() => item.style.zIndex = "0", 800)
            })
        }).bind(this))
    }

    show() { this.el.classList.add('active') }

    hide() { this.el.classList.remove('active') }
}

export default new Tab4()