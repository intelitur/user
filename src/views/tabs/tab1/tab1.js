

import TemplatesManager from "../../../utils/TemplatesManager";
import Carousel from "../../carousel/carousel";
import DesignController from "../../../utils/DesignController";
import CalendarView from "../../calendar/calendar";
import EventsService from "../../../services/EventsService";
import { FILES_BASE_URL } from "../../../env";
import ads from "../../ads/ads";


import './tab1.css'
import './css/d_tab1_event_view.css'
import '../../../utils/css/loader-ellipsis.css'
import Snackbar from "../../snackbar/snackbar";
import ContestsService from "../../../services/ContestsService";
import HomeImagesService from "../../../services/HomeImagesService";


class Tab1 {
    

    constructor() {
        this.index = 0;
        this.pageSize = 3;
    }

    set loading(value){
        this.loadingState = value;
    }

    get loading(){
        return this.loadingState
    }

    get noMore(){
        return this.el.querySelector(".tab1__coming-events--no-more").style.display == "block"
    }

    set noMore(value){
        if(value){
            this.el.querySelector(".tab1__coming-events--no-more").style.display = "block"
            this.el.querySelector(".lds-ellipsis").style.display = "none"
        }
        else{
            this.el.querySelector(".tab1__coming-events--no-more").style.display = "none"
            this.el.querySelector(".lds-ellipsis").style.display = "block"
        }
    }

    set badge(value){
        const id = DesignController.mobile? "#badge_m_tab1": "#badge_d_tab1"
        if(value <= 0){
            this.el.querySelector(id).classList.add("hidden")
            return
        }
        this.el.querySelector(id).classList.remove("hidden")

        this.el.querySelector(id).innerHTML = value
    }

    get badge(){
        const id = DesignController.mobile? "#badge_m_tab1": "#badge_d_tab1"
        return Number(this.el.querySelector(id).innerHTML)
    }

    async render() {
        const view = await TemplatesManager.getTemplate('tab1')
        this.el = TemplatesManager.renderElement('tab1', view)
        await this.renderContent()
    }

    async renderContent() {
        const htmlName = DesignController.mobile ? 'm_tab1_content' : 'd_tab1_content'
        const view = await TemplatesManager.getTemplate(htmlName)
        TemplatesManager.renderElement('tab1_content', view)

        
        this.configCalendarButton()
        this.renderHomeImages()
        
          
        if (DesignController.mobile) {
            this.setupSearchScreen()
            this.renderEventsMobile()
            this.renderContestsMobile()
            this.setupMobileListeners()
            //this.hiddenDiv();
        }
        else {
            this.setudDesktopListeners()
            await this.renderCalendar()
            this.setupSrollAnimation()
            this.renderEvents()
            this.renderContests()
            ads.show("tab1_ads")
        }
    }

    async renderHomeImages() {
        const response = await HomeImagesService.getHomeImages()

        if(response.status != 200){
            if(response.status >= 500){
                Snackbar.error("Error al conectar y obetener los <b>eventos</b> de nuestros servidores")
            }
            else if(response.status >= 400){
                Snackbar.error("Error al conectar y obetener las <b>imágenes de inicio</b> de nuestros servidores")
            }
            this.loading = false
            
            return
        }

        const images = await response.json()

        console.log(images)
        
        this.carousel = new Carousel(images.map(image => `${FILES_BASE_URL}/${image.name}`))

        await this.carousel.render('tab1_carousel')

        setInterval(this.carousel.nImage.bind(this.carousel), 5000)
    }

    async renderCalendar() {
        this.calendar = new CalendarView()
        await this.calendar.render('tab1_calendar')
        
    }

    resetContainer(){
        let container = document.querySelector(".tab1__coming-events--container")
            container.innerHTML = `<div>
            <div class="tab1__coming-events--no-more" style="font-size: 12px; color: gray; margin: 20px auto; margin-bottom: 40px; display: none;"> No hay más eventos próximos para mostrar</div>
            <div class="lds-ellipsis" style="margin: 0 auto; color: tomato; margin-bottom: 100px; height: 0;">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>`
    }

    async renderEvents(){
        if(this.index == 0){
            this.resetContainer()
        }
        this.loading = true;
        let response = await EventsService.getComingEvents(this.index, this.pageSize)

        if(response.status != 200){
            if(response.status >= 500){
                Snackbar.error("Error al conectar y obetener los <b>eventos</b> de nuestros servidores")
            }
            else if(response.status >= 400){
                Snackbar.error("Error al conectar y obetener los <b>eventos</b> de nuestros servidores")
            }
            this.loading = false
            
            return
        }
        
        let events = await response.json()
        
        if(events.length > 0){
            let template = await TemplatesManager.getTemplate("d_tab1_event_view")
            
            events.forEach((event) => {
                let node = TemplatesManager.contextPipe(template, {...event, ...this.getDateInfo(event), main_image: this.getMainImage(event)}, false)
                node.classList.add("tab1__coming-events--item")
                document.querySelector(".tab1__coming-events--container").insertBefore(node, document.querySelector(".tab1__coming-events--container").lastElementChild)
            })
                
            const eventsDOM = this.el.querySelectorAll(".tab1__coming-event--button")
            eventsDOM.forEach(item => {
                item.addEventListener('click', DesignController.showEvent.bind(this, item.getAttribute("event_id")))
            })

            if(events.length != this.pageSize){
                this.noMore = true
            }
        }
        else{
            this.noMore = true
        }
        this.loading = false;
    }

    async renderEventsMobile(){
        
        this.loading = true;

        const container = this.el.querySelector('.tab1__events--container');

        const template = await TemplatesManager.getTemplate('m_tab1_event_view');

        const response = await EventsService.getComingEvents(this.index, this.pageSize);

        if(response.status != 200){
            if(response.status >= 500){
                Snackbar.error("Error al conectar y obetener los <b>eventos</b> de nuestros servidores")
            }
            else if(response.status >= 400){
                Snackbar.error("Error al conectar y obetener los <b>eventos</b> de nuestros servidores")
            }
            this.loading = false
            return
        }
        
        let events = await response.json()


        if(events.length > 0){

            events.forEach(item => {
                const htmlNode = TemplatesManager.createHtmlNode(template.patch({name: item.name, color: item.color, ...this.getDateInfo(item), main_image: this.getMainImage(item), event_id: item.event_id}));

                htmlNode.classList.add("tab1__events--item")
                container.insertBefore(htmlNode, container.lastElementChild);
            })

            const eventsDOM = this.el.querySelectorAll(".m_tab1__event--container")
            eventsDOM.forEach(item => {
                item.getAttribute("event_id")
                item.addEventListener('click', DesignController.showEvent.bind(this, item.getAttribute("event_id")))
            })

            if(events.length != this.pageSize){
                this.noMore = true
            }
        }
        else{
            this.noMore = true
        }
        this.loading = false
    }

    setupMobileListeners(){
        document.querySelector(".tab1__events--container").addEventListener("scroll", (async (e) => {
            if(e.target.scrollLeft + 70 > e.target.scrollWidth - e.target.clientWidth && !this.loading && !this.noMore){
                this.index += 1
                await this.renderEventsMobile()
            }
                
        }).bind(this)) 

        this.el.querySelector(".tab1__weather--container").addEventListener("click", DesignController.showWeather)
    }

    setudDesktopListeners(){
        document.querySelector(".tab1__coming-events--container").addEventListener("scroll", (async (e) => {
            if(e.target.scrollTop + 70 > e.target.scrollHeight - e.target.clientHeight && !this.loading && !this.noMore){
                this.index += 1
                await this.renderEvents()
            }
                
        }).bind(this)) 

        this.el.querySelector(".tab1__search-events--open").addEventListener("click", DesignController.showSearchEventsScreen)

        document.querySelector(".tab1_coming-events--input").addEventListener("keyup", ((e) => {
            this.filter = e.target.value
                this.index = 0
                this.renderEvents()
        }).bind(this))

        document.querySelector(".tab1_coming-events--search-button").addEventListener("click", (() => {this.index = 0; this.renderEvents()}).bind(this))

        document.querySelector(".tab1__weather__temperature--button").addEventListener("click", DesignController.showWeather)
    }

    getDateInfo(event){

        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

        const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

        const date = new Date(event.date_range.initial_date.split("T")[0])

        
        const monthName = months[date.getMonth()]

        const dayName = days[date.getDay()]

        const dateI = date.getDate() + 1

        return {
            monthName,
            dayName,
            dateI
        }
    }

    getMainImage(event){
        return event.images && event.images.length > 0?`${FILES_BASE_URL}/${event.images[0].name}`: ``
    }

    setupSrollAnimation() {
        const container = this.el.children[0]
        container.addEventListener('scroll', ((e) => {
            const module = Math.floor(container.scrollTop / 150)
            this.showModule(module)
        }).bind(this))
    }

    showModule(module) {
        const icons = [
            'far fa-images',
            'fas fa-calendar-alt',
            'fas fa-bullhorn',
        ]
        const mosaicRightItems = [
            this.el.querySelector('.tab1__carousel--right'),
            this.el.querySelector('.tab1__calendar--right'),
            this.el.querySelector('.tab1__contests--right'),
        ]
        const mosaicLeftItems = [
            this.el.querySelector('.tab1__carousel--left'),
            this.el.querySelector('.tab1__calendar--left'),
            this.el.querySelector('.tab1__contests--left'),
        ]
        this.el.querySelector('.tab1--icon').className = `${icons[module === 3? 2: module]} tab1--icon`

        mosaicRightItems.forEach((item, i) => {
            if (i === (module === 3? 2: module)) {
                item.classList.add('active')
            }
            else{
                item.classList.remove('active')
            }
        })
        mosaicLeftItems.forEach((item, i) => {
            if (i === (module === 3? 2: module)) {
                item.classList.add('active')
            }
            else{
                item.classList.remove('active')
            }
        })

        if(module === 1 && !this.calendar.updated){
            this.calendar.updateSize()       
            this.calendar.updated = true
        }
        
        if (module === 3) {
            DesignController.showTab(2)
        }
    }

    // hiddenDiv(events) {
    //     const padre = this.el.querySelector('.tab1__calendar__events--container');
    //     /**
    //     padre.children[0].addEventListener('mouseenter', function () {
            
    //         padre.children[0].children[0].children[4].classList.add('size');
    //     }); */
    //     padre.children[1].addEventListener('mouseenter', function () {
    //         padre.children[0].classList.add('hidden');
    //     });
    //     padre.children[1].addEventListener('mouseleave', function () {
    //         padre.children[0].classList.remove('hidden');
    //     });
    //     const consurso = this.el.querySelector('.tab1__calendar__concurso--container')
        
    //         consurso.children[1].addEventListener('mouseenter', function()
    //     {
    //         consurso.children[0].classList.add('hidden');
    //     })
    //     consurso.children[1].addEventListener('mouseleave', function()
    //     {
    //         consurso.children[0].classList.remove('hidden');
    //     })
        
    // }

    

    
    async setupSearchScreen(){
        this.el.querySelector('.tab1__search--button').addEventListener('click', DesignController.showSearchScreen)
    }
   

    configCalendarButton() {
        if (DesignController.mobile)
            this.el.querySelector('.tab1__calendar--button').addEventListener('click', DesignController.showCalendar)
        else {
            const container = this.el.children[0]
            this.el.querySelector('.tab1--button').addEventListener('click', (function () {
                container.scrollTop += 151
            }).bind(this))
        }
    }

    async renderContestsMobile(){
        this.loading = true;

        const container = this.el.querySelector('.tab1__contests--container');

        const template = await TemplatesManager.getTemplate('m_tab1_contest_view');

        const response = await ContestsService.getContests();

        if(response.status != 200){
            if(response.status >= 500){
                Snackbar.error("Error al conectar y obetener los <b>concursos</b> de nuestros servidores")
            }
            else if(response.status >= 400){
                Snackbar.error("Error al conectar y obetener los <b>concursos</b> de nuestros servidores")
            }
            this.loading = false
            return
        }
        
        let contests = await response.json()


        if(contests.length > 0){

            contests.forEach(item => {
                const htmlNode = TemplatesManager.createHtmlNode(template.patch({...item, main_image: this.getMainImageContest(item)}));

                htmlNode.classList.add("tab1__contests--item")
                container.appendChild(htmlNode);
            })

            const contestsDOM = this.el.querySelectorAll(".tab1__contests--item")
            contestsDOM.forEach(item => {
                item.addEventListener('click', DesignController.showContest.bind(this, item.getAttribute("contest_id")))
            })
        }
        this.loading = false
    }

    async renderContests(){
        this.loading = true;

        const container = this.el.querySelector('.tab1__contests--container');

        const template = await TemplatesManager.getTemplate('d_tab1_contest_view');

        const response = await ContestsService.getContests();

        if(response.status != 200){
            if(response.status >= 500){
                Snackbar.error("Error al conectar y obetener los <b>concursos</b> de nuestros servidores")
            }
            else if(response.status >= 400){
                Snackbar.error("Error al conectar y obetener los <b>concursos</b> de nuestros servidores")
            }
            this.loading = false
            return
        }
        
        let contests = await response.json()


        if(contests.length > 0){

            contests.forEach(item => {
                const htmlNode = TemplatesManager.createHtmlNode(template.patch({...item, main_image: this.getMainImageContest(item)}));

                htmlNode.classList.add("tab1__contests--item")
                container.appendChild(htmlNode);
            })
            contests.forEach(item => {
                const htmlNode = TemplatesManager.createHtmlNode(template.patch({...item, main_image: this.getMainImageContest(item)}));

                htmlNode.classList.add("tab1__contests--item")
                container.appendChild(htmlNode);
            })

            const contestsDOM = this.el.querySelectorAll(".tab1__contests--item")
            contestsDOM.forEach(item => {
                item.addEventListener('click', DesignController.showContest.bind(this, item.getAttribute("contest_id")))
            })
        }
        this.loading = false
    }

    getDateInfoContest(contest){

        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

        const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

        const date = new Date(contest.initial_date.split("T")[0])

        
        const monthName = months[date.getMonth()]

        const dayName = days[date.getDay()]

        const dateI = date.getDate() + 1

        return {
            monthName,
            dayName,
            dateI
        }
    }

    getMainImageContest(contest){
        return contest.images.length > 0 ? `${FILES_BASE_URL}/${contest.images[0].name}`: "https://intelitur.arenalcostarica.cr:7031/files/20201024145734255-7.jpg";
    }

    show() { this.el.classList.add('active') }

    hide() { this.el.classList.remove('active') }
}

export default new Tab1()