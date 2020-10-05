import Snackbar from "../views/snackbar/snackbar"

class ServiceUtils {
    
    static createQuery(json){
        const query = Object.entries(json).map(item => item.join("=")).join("&")
        return query
    }

    
}

ServiceUtils.GET = async (url) => {
    let response = undefined
    try {
        response = await fetch(url)
    } catch (error) {
        Snackbar.error("Ocurrió un error al conectar con nuestros servidores")
        return {status: 0}
    }
    // if(response.status){
    //     return response
    // }
    // else{
    //     Snackbar.error("Error al conectar con nuestros servidores")
    // }
    return response
}

export default ServiceUtils