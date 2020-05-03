import EventView from '../views/event/event' 

class DesignController {

    static showEvent(event_id){
        console.log(event_id)
        const eventView = new EventView(event_id)
        eventView.render()
        this.showOverlay()
    }

    static showOverlay(){
        const overlay = document.querySelector('.overlay')
        overlay.classList.add('visible')
    }

    static hideOverlay(){
        const overlay = document.querySelector('.overlay')
        overlay.classList.remove('visible')
    }

}

DesignController.mobile = window.screen.width < 700

export default DesignController