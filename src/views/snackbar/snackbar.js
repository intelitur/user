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
        if(message == 500){
            message = "Error al conectar con nuestros servidores"
        }
        else if(message == 400){
            message = "Ha ocurrido un error con la consulta, reintente"
        }
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
        delete Snackbar.timeout
    }

    static async show(message, ms){
        if(Snackbar.timeout != undefined){
            clearTimeout(Snackbar.timeout)
            Snackbar.hide()
        }
        if(message)
            Snackbar.el.lastElementChild.innerHTML = message  
        if(ms)
            Snackbar.timeout = setTimeout(Snackbar.hide, ms)
        Snackbar.el.classList.add("active")
    }
}

export default Snackbar