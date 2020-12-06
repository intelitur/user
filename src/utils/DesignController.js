import EventView from '../views/event/event'
import CalendarView from '../views/calendar/calendar'
import tab2 from '../views/tabs/tab2/tab2'
import SearchView from '../views/search/search'
import footer from '../views/footer/footer'
import searchEvents from '../views/search_events/search_events'
import ads from '../views/ads/ads'
import AdView from '../views/ad/ad'
import weather from '../views/weather/weather'
import ContestView from '../views/contest/contest'

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
        tab2.showingObject = true
        if(DesignController.mobile){
            DesignController.showLoadingBar()
            new EventView(event_id, "overlay")
            DesignController.hideLoadingBar()
        }   
        else{
            footer.showTab(2)
            tab2.loading = true
            new EventView(event_id, 'tab2__left__info')
        }

    }

    static async showCalendar(doWhenHide){
        DesignController.showLoadingBar()
        if(!DesignController.calendar){
            DesignController.calendar = new CalendarView()
        }
        let calendar = DesignController.calendar
        await calendar.render('calendar')
        DesignController.hideLoadingBar()
        const overlay = document.querySelector('.calendar--overlay')
        overlay.classList.add('visible')
    }

    static async showContest(contest_id) {
        new ContestView(contest_id)
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
        new AdView(ad_id)
    }

    static async showWeather(){
        DesignController.showLoadingBar()
        if(DesignController.mobile)
            await weather.show('weather_overlay')
        else
            await weather.show('tab1_weather_details')
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