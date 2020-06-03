
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

import TemplatesManager from '../../utils/TemplatesManager'
import './search.css'
import DesignController from '../../utils/DesignController'

class SearchView{
    
    constructor() {
        
    }
    async render(name) {
        const template = await TemplatesManager.getTemplate('search')

        this.el = TemplatesManager.renderElement('search', template)
        this.hideSearch();

    }
    hideSearch(){
        const button = this.el.querySelector('.search_container_button');
        const overlay = document.querySelector('.searchScreen')
        button.addEventListener('mouseenter', function () {
            
        overlay.classList.remove('visible')
        });

    }

}
export default SearchView