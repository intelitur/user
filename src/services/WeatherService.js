import { API_URL } from "../env"



class WeatherService {


    static async updateWeather(){
        
        let response = fetch(`${API_URL}/${WeatherService.module}`)
        WeatherService.weatherResponse = await (await (response)).json()
        return WeatherService.weatherResponse

        // let weather = {datetime: "25/08/2020 02:23:39 p.m.", temp: "30,36", rh: "66,17", avrWindSpeed: "7,28", thermalSensation: "34,37", rainDatetime: "25/08/2020 02:00 p.m.", rain: "0,00" }
        // return {status: 200, body: {...weather}}
    }

    static get weather(){

        if(WeatherService.weatherResponse == undefined){
            return WeatherService.updateWeather()
        }
        return WeatherService.weatherResponse
    }
}
WeatherService.module = "weather"


export default WeatherService