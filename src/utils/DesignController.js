import EventView from '../views/event/event'
import CalendarView from '../views/calendar/calendar'
import tab2 from '../views/tabs/tab2/tab2'

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
        if(DesignController.mobile){
            DesignController.showLoadingBar()
            const eventView = new EventView(event_id)
            await eventView.render('overlay')
            DesignController.hideLoadingBar()
            DesignController.showOverlay(doWhenHide)
        }   
        else{
            tab2.loading = true
            tab2.map.showEventPopup(event_id)
            const eventView = new EventView(event_id)
            await eventView.render('tab2__left__info')
            document.querySelector(".tab2__left__info--container").classList.add('visible')
            tab2.map.showEventPopup(event_id)
            tab2.loading = false
        }

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

    static showLoadingBar(){
        document.querySelector('.main-loading').classList.add('visible')
    }

    static hideLoadingBar(){
        document.querySelector('.main-loading').classList.remove('visible')
    }

    static setupImageView(){
        console.log("Change")
        document.querySelectorAll("img:not([config='true'])").forEach((img) => {
            img.setAttribute('config', 'true')
            img.addEventListener('click', ()=> {
                DesignController.showImage(img.getAttribute('src'))
            })
        })
    }

    static showImage(imgUrl){
        document.querySelector(".img--overlay").children[0].setAttribute('src', imgUrl)
        document.querySelector(".img--overlay").classList.add('visible')
    }

}

DesignController.mobile = window.screen.width < 700

document.addEventListener('DOMSubtreeModified', DesignController.setupImageView)
document.querySelector('.img--overlay').addEventListener("click", ()=> document.querySelector('.img--overlay').classList.remove("visible"))

export default DesignController