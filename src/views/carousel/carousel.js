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
            this.interval = setInterval(this.nImage.bind(this), this.animationOptions.autoSlide.ms)


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

        if(byUser || this.lastVideo == undefined  || this.lastVideo.paused || this.lastVideo.ended)
            this.showImage()
        else{
            this.index++
        }
    }

    nImage(byUser){
        if (this.index >= this.medias.length-1){
            this.index = 0;
        }else{
            this.index++;
        }

        if(byUser || this.lastVideo == undefined  || this.lastVideo.paused || this.lastVideo.ended)
            this.showImage()
        else{
            this.index--
        }
            

    }
    
    showImage(){
        const imageContainer = this.el.querySelector(".carousel__images-container")

        imageContainer.style.right = `${this.index}00%`

        
        if(this.index < this.videos.length){
            if(imageContainer.children.item(this.index).paused)
                imageContainer.children.item(this.index).muted = true
            imageContainer.children.item(this.index).play()
    
            this.lastVideo = imageContainer.children.item(this.index)
        }
    }

    clear(){
        if(this.interval != undefined)
            clearInterval(this.interval)
        const imageContainer = this.el.querySelector(".carousel__images-container")
        imageContainer.innerHTML = ''
    }
}

export default Carousel