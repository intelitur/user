import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

import TemplatesManager from '../../utils/TemplatesManager'
import DesignController from '../../utils/DesignController'

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
                    left: 'back',
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
                eventClick: this.eventClick(),
                eventMouseEnter: function (info) {
                    if (!DesignController.mobile) {
                        let props = info.event.extendedProps;
                        console.log(info.jsEvent)
                        window.eventPopup.style.right = ''
                        window.eventPopup.style.left = String(info.jsEvent.clientX) + "px"
                        window.eventPopup.style.top = String(info.jsEvent.clientY) + "px"
                        window.eventPopup.innerHTML =
                           
                        window.eventPopup.style.display = 'block';
                        setTimeout((() => { window.eventPopup.style.opacity = '1' }), 20);
                        tab1Control.showPopupImage(props.event_id)
                    }
                },
                eventMouseLeave: function (info) {
                    if (!(window.eventPopup.parentElement.querySelector(':hover') === window.eventPopup) && !DesignController.mobile)
                        tab1Control.closeEventPopup();
                },
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


    async render() {
        const template = await TemplatesManager.getTemplate('calendar')

        this.el = TemplatesManager.renderElement('overlay', template)

        this.calendar = new Calendar(this.el.children[0], this.config)

        this.calendar.render()
        this.calendar.updateSize()

        console.log(this)
    }


    eventClick(eventInfo) {
        // if (DesignController.mobile)
        //     tab1Control.openEventPopup(eventInfo);
        // else
        //     tab1Control.showEvent(eventInfo.event.extendedProps.event_id)
    }
}
    


export default CalendarView