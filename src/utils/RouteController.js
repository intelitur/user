import QrsService from "../services/QrsService"
import footer from "../views/footer/footer"
import tab4 from "../views/tabs/tab4/tab4"
import DesignController from "./DesignController"

export default class RouteController {

    static async verifyQuery(){
        let query = Object.fromEntries(location.search.substring(1).split("&").map((e) => e.split("=")))

        if(!query.qr){
            return
        }

        const response = await QrsService.getQrInfo(query.qr)

        if(response.status == 200){
            const data = await response.json()
            if(data.e_id){
                switch(data.e_type){
                    case "event":
                        DesignController.showEvent(data.e_id)
                        break
                    case "ad":
                        DesignController.showAd(data.e_id)
                        break
                    case "contest":
                        DesignController.showContest(data.e_id)
                        break
                }
                
            }
            else{
                switch(data.e_type){
                    case "questions":
                        {
                            footer.showTab(4)
                            tab4.showFrequentQuestions()
                        }
                }
            }
        }

        
        
    }
}