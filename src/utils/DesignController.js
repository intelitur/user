import EventView from '../views/event/event'
import CalendarView from '../views/calendar/calendar'
import SearchView from '../views/search/search'

class DesignController {

    static showOverlay() {
        const overlay = document.querySelector('.overlay')
        overlay.classList.add('visible')
    }

    static hideOverlay() {
        const overlay = document.querySelector('.overlay')
        overlay.classList.remove('visible')
    }


    static async showEvent(event_id) {
        DesignController.showLoadingBar()
        const eventView = new EventView(event_id)
        await eventView.render()
        DesignController.hideLoadingBar()
        DesignController.showOverlay()

    }

    static async showCalendar(){
        DesignController.showLoadingBar()
        if(!DesignController.calendar){
            DesignController.calendar = new CalendarView()
        }
        let calendar = DesignController.calendar
        await calendar.render()
        DesignController.hideLoadingBar()
        DesignController.showOverlay()
    }
    static showOverlaySearch() {
        const overlay = document.querySelector('.searchScreen')
        overlay.classList.add('visible')
    }

    static hideOverlaySearch() {
        const overlay = document.querySelector('.searchScreen')
        overlay.classList.remove('visible')
    }

    
    static async showSearchScreen(){
        DesignController.showLoadingBar()
        
        let search = new SearchView()
        await search.render()
        DesignController.hideLoadingBar()
        DesignController.showOverlaySearch()
        
    }

    static showLoadingBar(){
        document.querySelector('.main-loading').classList.add('visible')
    }

    static hideLoadingBar(){
        document.querySelector('.main-loading').classList.remove('visible')
    }
}

DesignController.mobile = window.screen.width < 700

export default DesignController