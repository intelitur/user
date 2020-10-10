import DesignController from "../../../utils/DesignController";
import TemplatesManager from "../../../utils/TemplatesManager";
import frequentQuestions from "../../frequent_questions/frequent_questions";


import './css/m_tab4.css';

class Tab4 {

    constructor() {
    }

    async render() {
        const view = await TemplatesManager.getTemplate('tab4')
        this.el = TemplatesManager.renderElement('tab4', view)

        this.renderContent()
    }

    async renderContent(){
        const view = await TemplatesManager.getTemplate(`${DesignController.mobile? 'm': 'd'}_tab4`)

        const node = TemplatesManager.createHtmlNode(view)

        this.el.appendChild(node)

        this.back = this.el.querySelector(".tab4__back")
        this.items =  this.el.querySelectorAll(".tab4__item")
        if(DesignController.mobile)
            this.setupEventListeners()
    }

    setupEventListeners(){

        this.items.forEach((item, i) => {
            item.addEventListener("click", () => {
                if(!item.classList.contains("expanded")){
                    item.style.zIndex = "1"
                    
                    if(i == 0){
                        frequentQuestions.render("m_frequent_questions")
                    }
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