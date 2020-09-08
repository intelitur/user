import tab1 from "../tab1";
import CompaniesService from "../../../../services/CompaniesService";
import TemplatesManager from "../../../../utils/TemplatesManager";
import Snackbar from "../../../snackbar/snackbar";
import ads from "../../../ads/ads";


class Tab1Ads {

    async renderAds(){
        ads.show("tab1_ads")
    }


}

export default new Tab1Ads();