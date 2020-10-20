import footer from "../views/footer/footer"
import tab4 from "../views/tabs/tab4/tab4"
import DesignController from "./DesignController"

export default class RouteController {

    static verifyQuery(){
        let query = Object.fromEntries(location.search.substring(1).split("&").map((e) => e.split("=")))
        
        if(query.id){
            switch(query.e){
                case "event":
                    DesignController.showEvent(query.id)
                    break
                case "ad":
                    DesignController.showAd(query.id)
                    break
                case "contest":
                    DesignController.showContest(query.id)
                    break
            }
            
        }
        else{
            switch(query.e){
                case "questions":
                    {
                        footer.showTab(4)
                        tab4.showFrequentQuestions()
                    }
            }
        }
    }
}