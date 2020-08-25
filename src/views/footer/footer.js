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
        this.showTab(1)
        DesignController.showTab = this.showTab.bind(this)

    }

    showTab(i = 1){
        this.tabLinks.forEach(tabLink => tabLink.classList.remove('active'))
        this.tabLinks[i - 1].classList.add('active')
        tabs.showTab(i)

        if(i == 1){
            this.badge1 = 0
        }
        else{
            this.badge1 = DesignController.badges
        }
    }

    addEventListeners(){
        const tablinks = this.el.querySelectorAll(".footer__tablink")
        tablinks.forEach((tablink, i) => {
            tablink.addEventListener('click', (() => {
                this.showTab(i + 1)
            }).bind(this))
        })
    }

    set badge1(value){
        if(value <= 0){
            this.el.querySelector("#badge_tablink1").classList.add("hidden")
            return
        }
        this.el.querySelector("#badge_tablink1").classList.remove("hidden")

        this.el.querySelector("#badge_tablink1").innerHTML = value
    }

    get badge1(){
        return Number(this.el.querySelector("#badge_tablink1").innerHTML)
    }

    

    
}
export default new Footer()