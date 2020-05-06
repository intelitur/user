import EventView from '../views/event/event'
import CalendarView from '../views/calendar/calendar'

class DesignController {

    static showOverlay() {
        const overlay = document.querySelector('.overlay')
        overlay.classList.add('visible')
    }

    static hideOverlay() {
        const overlay = document.querySelector('.overlay')
        overlay.classList.remove('visible')
    }


    static showEvent(event_id) {
        const eventView = new EventView(event_id)
        eventView.render()
        this.showOverlay()
    }

    static showCalendar(){
        if(!DesignController.calendar){
            DesignController.calendar = new CalendarView()
        }
        let calendar = DesignController.calendar
        calendar.render()
        this.showOverlay()
    }
}

DesignController.mobile = window.screen.width < 700

export default DesignController