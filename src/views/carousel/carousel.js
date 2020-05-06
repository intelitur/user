import TemplatesManager from "../../utils/TemplatesManager";

class Carousel {

    constructor(images, animationOptions = {autoSlide: {enabled: true, ms: 6000}}){
        this.images = images
        this.animationOptions = animationOptions
    }

    async render(name){
        const template = await TemplatesManager.getTemplate('carousel')
        const view = TemplatesManager.doLoops.bind(this)(template)
        this.el = TemplatesManager.renderElement(name, view)

        this.showImage(0)
        if(this.animationOptions.autoSlide.enabled)
            setInterval(this.showImage.bind(this), this.animationOptions.autoSlide.ms)
    }
/** 
    addEventListeners(){
        const items = this.el.querySelectorAll(".carousel__items-container")[0].childNodes
        items.forEach((item, i) => {
            item.addEventListener('click', (() => {
                this.showImage(i)
            }).bind(this))
        })
    }
*/
    showImage(i){
        //const items = this.el.querySelectorAll(".carousel__items-container")[0].childNodes
        const imageContainer = this.el.querySelectorAll(".carousel__images-container")[0]

        /*
        if(!i){
            items.forEach((el, index) => {
                if(el.classList.contains('active')){
                    i = index + 1
                }
            })
        }
        */

        //i = items[i]? i: 0

        let disactiveAll = element => element.classList.remove('active')
        let active = element => element.classList.add('active')

        //items.forEach((disactiveAll))
        imageContainer.style.right = `${i}00%`

        //active(items[i])
    }
}

export default Carousel