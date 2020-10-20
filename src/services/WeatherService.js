


class WeatherService {


    static async getWeather(filters){
        
        //let response = await fetch(`${API_URL}/${module}?${ServiceUtils.createQuery(filters)}`)
        //return response

        let weather = {datetime: "25/08/2020 02:23:39 p.m.", temp: "30,36", rh: "66,17", avrWindSpeed: "7,28", thermalSensation: "34,37", rainDatetime: "25/08/2020 02:00 p.m.", rain: "0,00" }
        return {status: 200, body: {...weather}}

        

        /*
            print ("""Variables en la fortuna a las {0}: 
            <ul>
                <li>Temperatura: {1} °C</li>
                <li>Humedad relativa: {2} %</li>
                <li>Velocidad del viento promedio: {3} km/h</li>
                <li>Sensación térmica: {4} °C</li>
                <li>Lluvia (reporte a las {5}): {6} mm</li>
            </ul>""".format(hora,temperatura,humedadRelativa,velocidadVientoPromedio,sensacionTermica,horalluvia,lluvia))

            Variables en la fortuna a las 25/08/2020 02:23:39 p.m.:
            Temperatura: 30,36 °C
            Humedad relativa: 66,17 %
            Velocidad del viento promedio: 7,28 km/h
            Sensación térmica: 34,37 °C
            Lluvia (reporte a las 25/08/2020 02:00 p.m.): 0,00 mm
        */
    }
}
WeatherService.module = "weather"

export default WeatherService