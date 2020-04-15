import TemplatesManager from "../../utils/TemplatesManager";
import tabs from "../tabs/tabs";

class Footer {

    constructor(){
    }

    async render(){
        const view = await TemplatesManager.getTemplate('footer')
        this.el = TemplatesManager.getRenderElement('footer')
        this.el.innerHTML = view

        this.initTabs()
    }

    async initTabs(){
        this.tabLinks = [
            ...this.el.children[0].children
        ]
        await tabs.render()
        this.showTab()
    }

    showTab(i = 1){
        this.tabLinks.forEach(tabLink => tabLink.classList.remove('active'))
        this.tabLinks[i - 1].classList.add('active')
        tabs.showTab(i)
    }

    
}
export default new Footer()