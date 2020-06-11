import TemplatesManager from "../../utils/TemplatesManager";


import './carousel.css'
var numImage =0;
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
        this.nextImage();
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
    nextImage(){
        const boton = this.el.querySelector("#changeImage");
        boton.addEventListener('click', (() => {
            if (numImage >= this.images.length-1){
                numImage=0;
                this.showImage(numImage)
            }else{
                numImage++;
                this.showImage(numImage)
            }
        }).bind(this))

    }

    pImage(){
        if (numImage <= 0){
            numImage = this.images.length - 1;
            this.showImage(numImage)
        }else{
            numImage--;
            this.showImage(numImage)
        }
    }

    nImage(){
        if (numImage >= this.images.length-1){
            numImage=0;
            this.showImage(numImage)
        }else{
            numImage++;
            this.showImage(numImage)
        }
    }
    
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