import TemplatesManager from "../../utils/TemplatesManager";


import './carousel.css'
class Carousel {

    constructor(medias = [], animationOptions = {autoSlide: {enabled: true, ms: 6000}}){
        this.medias = medias
        this.images = medias.filter(media => !media.split('.').slice(-1)[0].toLowerCase().includes("mp4"))
        this.videos = medias.filter(media => media.split('.').slice(-1)[0].toLowerCase().includes("mp4"))
        
        this.animationOptions = animationOptions

        this.index = 0
    }

    async render(name){
        const template = await TemplatesManager.getTemplate('carousel')
        const view = TemplatesManager.doLoops.bind(this)(template)
        this.el = TemplatesManager.renderElement(name, view)

        this.showImage(this.index)
        if(this.animationOptions.autoSlide.enabled)
            setInterval(this.showImage.bind(this), this.animationOptions.autoSlide.ms)

        console.log(this.images)
        console.log(this.videos)

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

    pImage(){
        if (this.index <= 0){
            this.index = this.medias.length - 1;
        }else{
            this.index--;
        }
        this.showImage()
    }

    nImage(){
        if (this.index >= this.medias.length-1){
            this.index = 0;
        }else{
            this.index++;
        }
        this.showImage()
    }
    
    showImage(){
        const imageContainer = this.el.querySelector(".carousel__images-container")

        console.log(this.index)
        if(this.index < this.videos.length){
            imageContainer.children.item(this.index).play()
        }
        
        imageContainer.style.right = `${this.index}00%`
    }

    clear(){
        const imageContainer = this.el.querySelector(".carousel__images-container")
        imageContainer.innerHTML = ''
    }
}

export default Carousel