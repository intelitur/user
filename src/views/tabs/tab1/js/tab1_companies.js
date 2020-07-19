import tab1 from "../tab1";
import CompaniesService from "../../../../services/CompaniesService";
import TemplatesManager from "../../../../utils/TemplatesManager";


class Tab1Companies {

    set loading(value){
        this.loadingState = value;
        if(value){
            this.container.querySelector(".tab1__adds--loading").style.display = "block"
            this.container.querySelector(".tab1__adds--no-more").style.display = "none"
        }
        else{
            this.container.querySelector(".tab1__adds--loading").style.display = "none"
            this.container.querySelector(".tab1__adds--no-more").style.display = "block"
        }
    }

    get loading(){
        return this.loadingState
    }

    async renderCompanies(){
        this.container = document.querySelector(".tab1__adds--container")

        this.loading = true;
        await this.refreshCompanies()

        const template = await TemplatesManager.getTemplate("tab1_item_company")

        this.companies.forEach(company => {

            const node = TemplatesManager.contextPipe(template, company, false)

            console.log(company)
            this.container.insertBefore(node, this.container.lastElementChild);

        })
        this.loading = false
    }

    async refreshCompanies(){
        this.companies = await CompaniesService.getCompanies()
    }


}

export default new Tab1Companies();