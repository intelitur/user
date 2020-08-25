export default class ServiceUtils {
    
    static createQuery(json){
        const query = Object.entries(json).map(item => item.join("=")).join("&")
        return query
    }
}