import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

import TemplatesManager from '../../utils/TemplatesManager'
import DesignController from '../../utils/DesignController'
import EventsService from '../../services/EventsService'

import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/list/main.css';

import './calendar.css'
class CalendarView {

    constructor(config) {
        if (!config) {
            config =
            {
                locale: 'es',
                plugins: [
                    dayGridPlugin, 
                    listPlugin
                ],
                defaultView: DesignController.mobile? 'listWeek' : 'dayGridMonth',
                header: {
                    left: DesignController.mobile? 'back': '',
                    center: '',
                    right: 'title'
                },
                footer: {
                    left: 'dayGridMonth,listWeek',
                    right: 'prev,next'
                },
                height: 'parent',
                buttonText: {
                    month: 'Mes',
                    listWeek: 'Semana'
                },
                eventClick: this.eventClick,
                // eventMouseEnter: function (info) {
                //     if (!DesignController.mobile) {
                //         let props = info.event.extendedProps;
                //         console.log(info.jsEvent)
                //         window.eventPopup.style.right = ''
                //         window.eventPopup.style.left = String(info.jsEvent.clientX) + "px"
                //         window.eventPopup.style.top = String(info.jsEvent.clientY) + "px"
                //         window.eventPopup.innerHTML = ''
                           
                //         window.eventPopup.style.display = 'block';
                //         setTimeout((() => { window.eventPopup.style.opacity = '1' }), 20);
                //         tab1Control.showPopupImage(props.event_id)
                //     }
                // },
                // eventMouseLeave: function (info) {
                //     if (!(window.eventPopup.parentElement.querySelector(':hover') === window.eventPopup) && !DesignController.mobile)
                //         tab1Control.closeEventPopup();
                // },
                customButtons: {
                    back: {
                        text: 'Atras',
                        click: DesignController.hideOverlay
                    }
                }
            }
        }
        this.config = config
    }


    async render(name) {
        const template = await TemplatesManager.getTemplate('calendar')

        this.el = TemplatesManager.renderElement(name, template)

        this.calendar = new Calendar(this.el.children[0], this.config)

        this.calendar.render()
        this.calendar.updateSize()
        this.calendar.renderComponent()
        console.log(this.calendar.tryRerender())

        
        

        await this.renderEvents()
    }


    async renderEvents(){
        let events = await EventsService.getEvents()

        events.forEach((event) => {
            let calendarEvent = {
                title: event.name,
                start: event.date_range.initial_date.split("T")[0] + "T" + (event.initial_time ? event.initial_time : "00:00:00"),
                end: event.date_range.final_date.split("T")[0] + "T" + (event.final_time ? event.final_time : "23:59:00"),
                allDay: event.all_day,
                backgroundColor: event.color,
                borderColor: event.color,
                extendedProps: event
            }
            this.calendar.addEvent(calendarEvent);
        });
    }


    eventClick(eventInfo) {
        DesignController.showEvent(eventInfo.event.extendedProps.event_id, DesignController.showCalendar)
        // if (DesignController.mobile)
        //     tab1Control.openEventPopup(eventInfo);
        // else
        //     tab1Control.showEvent(eventInfo.event.extendedProps.event_id)
    }

    updateSize(){
        this.calendar.isHandlingWindowResize = true
        this.calendar.updateSize()
        this.calendar.publiclyTrigger('windowResize', [this.calendar.view])
        this.calendar.isHandlingWindowResize = false
    }
}
    


export default CalendarView