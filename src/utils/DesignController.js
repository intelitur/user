import EventView from '../views/event/event'
import CalendarView from '../views/calendar/calendar'
import SearchView from '../views/search/search'

class DesignController {

    static showOverlay(doWhenHide) {
        const overlay = document.querySelector('.overlay')
        overlay.classList.add('visible')
        if(typeof doWhenHide === 'function')
            DesignController.doWhenHide = doWhenHide
    }

    static hideOverlay() {
        const overlay = document.querySelector('.overlay')
        overlay.classList.remove('visible')
        if(DesignController.doWhenHide){
            DesignController.doWhenHide()
            DesignController.doWhenHide = undefined
        }
    }


    static async showEvent(event_id, doWhenHide) {
        DesignController.showLoadingBar()
        const eventView = new EventView(event_id)
        await eventView.render()
        DesignController.hideLoadingBar()
        DesignController.showOverlay(doWhenHide)

    }

    static async showCalendar(doWhenHide){
        DesignController.showLoadingBar()
        if(!DesignController.calendar){
            DesignController.calendar = new CalendarView()
        }
        let calendar = DesignController.calendar
        await calendar.render('overlay')
        DesignController.hideLoadingBar()
        DesignController.showOverlay(doWhenHide)
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