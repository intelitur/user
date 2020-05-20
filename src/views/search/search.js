
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

import TemplatesManager from '../../utils/TemplatesManager'
import './search.css'
import DesignController from '../../utils/DesignController'

class SearchView{
    
    constructor() {
        
    }
    async render() {
        const template = await TemplatesManager.getTemplate('search')

        this.el = TemplatesManager.renderElement('searchScreen', template)

    }

}
export default SearchView