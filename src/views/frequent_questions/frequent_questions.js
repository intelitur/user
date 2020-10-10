import FrequentQuestionsService from "../../services/FrequentQuestionsService"
import TemplatesManager from "../../utils/TemplatesManager"


import './frequent_questions.css'

class FrequentQuestions {

    get loading() {
        return !this.el.querySelector(".lds-ellipsis").classList.contains("invisible")
    }

    set loading(value) {
        if (value)
            this.el.querySelector(".lds-ellipsis").classList.remove("invisible")
        else
            this.el.querySelector(".lds-ellipsis").classList.add("invisible")
    }

    async render(renderElement) {

        const template = await TemplatesManager.getTemplate('frequent_questions')

        this.el = TemplatesManager.renderElement(renderElement, template)

        this.setupElements()
        this.refreshFQ()
    }

    setupElements(){
        this.elements = {}
        this.elements.container = this.el.querySelector(".frequent_questions--container")
    }

    async refreshFQ(){
        this.elements.container.innerHTML = ""
        this.loading = true

        const response = await FrequentQuestionsService.getFrequentQuestions()

        if(response.status != 200){
            if(response.status >= 500){
                Snackbar.error(500)
            }
            else if(response.status >= 400){
                Snackbar.error(400)
            }
            this.elements.container.innerHTML = `<div style="margin: auto; font-size: 12px; color: rgb(196, 71, 71);">Error al conectar con nuestros servidores</div>`
            this.loading = false
            return
        }

        const fqs = await response.json()

        const template = await TemplatesManager.getTemplate("item_frequent_question")

        if(fqs.length <= 0){
            this.elements.container.innerHTML = `<div style="margin: auto; font-size: 12px; font-weight: 100">No existen preguntas frecuentes para mostrar</div>`
            this.loading = false
            return
        }

        fqs.forEach(item =>{
            let node = TemplatesManager.contextPipe(template, item, false)
            this.elements.container.appendChild(node)
        })


        this.loading = false
    }

}

export default new FrequentQuestions()