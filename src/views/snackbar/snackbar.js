import './snackbar.css'
import TemplatesManager from '../../utils/TemplatesManager'

class Snackbar {


    constructor(){

    }

    static async render(){
        const template = await TemplatesManager.getTemplate('snackbar')

        Snackbar.el = TemplatesManager.renderElement('snackbar', template)

        Snackbar.el.addEventListener("click", Snackbar.hide)
    }

    static async success(message, ms = 5000){
        if(Snackbar.el == undefined)
            await Snackbar.render()
        Snackbar.el.classList.add("success")
        Snackbar.el.firstElementChild.className = "far fa-check-circle"
        Snackbar.show(message, ms)
    }
    
    static async error(message, ms = 5000){
        if(Snackbar.el == undefined)
        await Snackbar.render()
        Snackbar.el.classList.add("error")
        Snackbar.el.firstElementChild.className = "far fa-times-circle"
        Snackbar.show(message, ms)
    }
    
    static async warning(message, ms = 5000){
        if(Snackbar.el == undefined)
        await Snackbar.render()
        Snackbar.el.classList.add("warning")
        Snackbar.el.firstElementChild.className = "fas fa-exclamation-circle"
        Snackbar.show(message, ms)
    }

    static hide(){
        Snackbar.el.className = "snackbar"
    }

    static async show(message, ms){
        if(message)
            Snackbar.el.lastElementChild.innerHTML = message  
        if(ms)
            setTimeout(Snackbar.hide, ms)
        Snackbar.el.classList.add("active")
    }
}

export default Snackbar