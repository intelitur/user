import EventView from '../views/event/event'
import CalendarView from '../views/calendar/calendar'
import tab2 from '../views/tabs/tab2/tab2'
import SearchView from '../views/search/search'
import tabs from '../views/tabs/tabs'
import footer from '../views/footer/footer'
import EventsService from '../services/EventsService'
import searchEvents from '../views/search_events/search_events'
import ads from '../views/ads/ads'
import AdView from '../views/ad/ad'
import weather from '../views/weather/weather'

class DesignController {

    static showOverlay(doWhenHide) {
        const overlay = document.querySelector('.overlay')
        overlay.classList.add('visible')
        if(typeof doWhenHide === 'function')
            DesignController.doWhenHide = doWhenHide
    }

    static hideOverlay(force) {
        const overlay = document.querySelector('.overlay')
        overlay.classList.remove('visible')
        if(force){
            DesignController.doWhenHide = undefined
            setTimeout(()=>overlay.firstElementChild.className = "", 500);
        }
        if(DesignController.doWhenHide){
            DesignController.doWhenHide()
            DesignController.doWhenHide = undefined
        }
    }


    static async showEvent(event_id, doWhenHide) {
        tab2.showingObject = true
        if(DesignController.mobile){
            DesignController.showLoadingBar()
            const eventView = new EventView(event_id)
            await eventView.render('overlay')
            DesignController.hideLoadingBar()
            DesignController.showOverlay(doWhenHide)
        }   
        else{
            footer.showTab(2)
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
    static showOverlaySearch() {
        const search = document.querySelector('.search')
        search.classList.add('visible')
    }

    static hideOverlaySearch() {
        const overlay = document.querySelector('.searchScreen')
        overlay.classList.remove('visible')
    }

    
    static async showSearchScreen(){
        DesignController.showLoadingBar()
        if(!DesignController.search){
            DesignController.search = new SearchView()
        }
        let search = DesignController.search
        await search.render('search')
        DesignController.hideLoadingBar()
        DesignController.showOverlaySearch()
        
    }

    static async showSearchEventsScreen(){
        DesignController.showLoadingBar()
        await searchEvents.show()
        DesignController.hideLoadingBar()
    }

    static async showAdsScreen(){
        DesignController.showLoadingBar()
        await ads.show('ads_overlay')
        DesignController.hideLoadingBar()
    }

    static async showAd(ad_id) {
        tab2.showingObject = true
        const adView = new AdView(ad_id)
        if(DesignController.mobile){
            DesignController.showLoadingBar()
            await adView.show('overlay_ad')
            DesignController.hideLoadingBar()
        }   
        else{
            footer.showTab(2)
            tab2.loading = true
            tab2.map.showAdPopup(ad_id)
            await adView.show('tab2__left__info')
            document.querySelector(".tab2__left__info--container").classList.add('visible')
            tab2.loading = false
        }

    }

    static async showWeather(){
        DesignController.showLoadingBar()
        await weather.show('weather_overlay')
        DesignController.hideLoadingBar()
    }

    static showLoadingBar(){
        document.querySelector('.main-loading').classList.add('visible')
    }

    static hideLoadingBar(){
        document.querySelector('.main-loading').classList.remove('visible')
    }

    static setupImageView(){
        if(document.querySelector("#map"))
            document.querySelector("#map").querySelectorAll("img:not([config='true'])").forEach((img) => {
                img.setAttribute('config', 'true')
            })
        document.querySelectorAll("img:not([config='true'])").forEach((img) => {
            img.setAttribute('config', 'true')
            img.addEventListener('click', (e)=> {
                e.stopPropagation();
                DesignController.showImage(img.getAttribute('src'))
            })
        })
    }

    static showImage(imgUrl){
        document.querySelector(".img--overlay").children[0].setAttribute('src', imgUrl)
        document.querySelector(".img--overlay").classList.add('visible')
    }

}

DesignController.badges = 3

DesignController.mobile = window.screen.width < 700

document.addEventListener('DOMSubtreeModified', () => {
    DesignController.setupImageView()
})
document.querySelector('.img--overlay').addEventListener("click", ()=> document.querySelector('.img--overlay').classList.remove("visible"))


export default DesignController