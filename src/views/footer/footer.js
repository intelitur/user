import TemplatesManager from "../../utils/TemplatesManager";
import tabs from "../tabs/tabs";
import DesignController from "../../utils/DesignController";


import './footer.css'

class Footer {

    constructor(){
        this.initTabs.bind(this)
    }

    async render(){
        const view = await TemplatesManager.getTemplate('footer')
        this.el = TemplatesManager.renderElement('footer', view)

        this.initTabs()
    }

    async initTabs(){
        this.tabLinks = [
            ...this.el.children
        ]
        await tabs.render()
        this.addEventListeners()
        this.showTab(2)
        DesignController.showTab = this.showTab.bind(this)

    }

    showTab(i = 1){
        this.tabLinks.forEach(tabLink => tabLink.classList.remove('active'))
        this.tabLinks[i - 1].classList.add('active')
        tabs.showTab(i)
    }

    addEventListeners(){
        const tablinks = this.el.querySelectorAll(".footer__tablink")
        tablinks.forEach((tablink, i) => {
            tablink.addEventListener('click', (() => {
                this.showTab(i + 1)
            }).bind(this))
        })
    }

    

    
}
export default new Footer()