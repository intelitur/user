import { API_URL } from "../env"



class LayersService {


    static async getLayers(){
        
        let response = fetch(`${API_URL}/${LayersService.module}`)
        return response
        // let weather = {datetime: "25/08/2020 02:23:39 p.m.", temp: "30,36", rh: "66,17", avrWindSpeed: "7,28", thermalSensation: "34,37", rainDatetime: "25/08/2020 02:00 p.m.", rain: "0,00" }
        // return {status: 200, body: {...weather}}
    }

    static async getLayerPoints(layer_id){
        
        let response = fetch(`${API_URL}/${LayersService.module}/${layer_id}/point`)
        return response
        // let weather = {datetime: "25/08/2020 02:23:39 p.m.", temp: "30,36", rh: "66,17", avrWindSpeed: "7,28", thermalSensation: "34,37", rainDatetime: "25/08/2020 02:00 p.m.", rain: "0,00" }
        // return {status: 200, body: {...weather}}
    }
}
LayersService.module = "geographicLayers"


export default LayersService