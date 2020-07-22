import TemplatesManager from "../../utils/TemplatesManager";
import tab1 from "./tab1/tab1";
import tab2 from "./tab2/tab2";
import tab3 from "./tab3/tab3";
import tab4 from "./tab4/tab4";
import tab5 from "./tab5/tab5";

import './tabs.css'
import DesignController from "../../utils/DesignController";
class Tabs {

    constructor(){
        this.tabs = [
            tab1,
            tab2,
            tab3,
            tab4,
            tab5
        ]
    }

    async renderTabs(){
        await Promise.all(this.tabs.map(tab => tab.render()))
    }
    
    async render(){
        const view = await TemplatesManager.getTemplate('tabs')
        const el = TemplatesManager.renderElement('tabs', view)

        await this.renderTabs()
    }

    showTab(i = 1){
        this.tabs.forEach(tab => tab.hide())
        this.tabs[i - 1].show()
        if(i == 2){
            this.tabs[i - 1].map.map._onResize()
            if(!DesignController.mobile){
                this.tabs[1].el.children[0].scrollTop = 15
            }
        }
        
    }

}

export default new Tabs()