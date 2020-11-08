import { API_URL } from "../env"



class QrsService {


    static async getQrInfo(qr_id){
        
        let response = await fetch(`${API_URL}/${QrsService.module}/${qr_id}`)
        return response

        // let weather = {datetime: "25/08/2020 02:23:39 p.m.", temp: "30,36", rh: "66,17", avrWindSpeed: "7,28", thermalSensation: "34,37", rainDatetime: "25/08/2020 02:00 p.m.", rain: "0,00" }
        // return {status: 200, body: {...weather}}
    }
}
QrsService.module = "qrs"

export default QrsService