import TemplatesManager from "../../../utils/TemplatesManager";
import Carousel from "../../carousel/carousel";

class Tab1 {

    constructor(){
        this.carousel =  new Carousel([
            "https://cdn.shopify.com/s/files/1/0094/5052/files/LaFortunaWaterfall-1500x1000x300.jpg?v=1540451385",
            "https://puntadelesteibt.com/wp-content/uploads/2012/07/NTN_6571.jpg",
            "https://d3hne3c382ip58.cloudfront.net/resized/750x420/combination-tour-la-fortuna-in-one-day-tour-2-457721_1549285516.JPG"
        ])
    }
    
    async render(){
        const view = await TemplatesManager.getTemplate('tab1')
        this.el = TemplatesManager.renderElement('tab1', view)
        await this.carousel.render('tab1_carousel')
    }

    show() { this.el.classList.add('active') }

    hide() { this.el.classList.remove('active') }
}

export default new Tab1()