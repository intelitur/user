
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

import TemplatesManager from '../../utils/TemplatesManager'
import './search.css'
import DesignController from '../../utils/DesignController'
import search_events from '../search_events/search_events'

class SearchView{
    
    constructor() {
        
    }
    async render() {
        const template = await TemplatesManager.getTemplate('search')

        this.el = TemplatesManager.renderElement('search', template)
        this.hideSearch();
        this.setupListeners()
    }

    hideSearch(){
        const button = this.el.querySelector('.search__back');
        const overlay = document.querySelector('.search')
        button.addEventListener('mouseenter', function () {
            overlay.classList.remove('visible')
        });

    }

    setupListeners(){
        document.getElementById("search_card_events").addEventListener("click", DesignController.showSearchEventsScreen)
    }

    set badgeAdds(value){
        if(value <= 0){
            this.el.querySelector("#badge_adds").classList.add("hidden")
            return
        }
        this.el.querySelector("#badge_adds").classList.remove("hidden")

        this.el.querySelector("#badge_adds").innerHTML = value
    }

    get badgeAdds(){
        return Number(this.el.querySelector("#badge_adds").innerHTML)
    }

}
export default SearchView