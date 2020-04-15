class TemplatesManager {

    static async getTemplate(name) {
        if (!TemplatesManager.templates[name]) {
            // let request = new Promise((resolve, reject) => {
            //     let xhttp = new XMLHttpRequest()
            //     xhttp.onreadystatechange = function () {
            //         if (this.readyState == 4) {
            //             if (this.status == 200) {
            //                 resolve(this.responseText)
            //             }
            //             if (this.status == 404) {
            //                 console.error(`File not found (${name})`)
            //                 reject()
            //             }
            //         }
            //     }
            //     xhttp.open("GET", name, true)
            //     xhttp.send()
            // })
            let request = fetch(`./html/${name}.html`, {mode: 'no-cors'})

            let htmlText = (await request).text()

            TemplatesManager.templates[name] = htmlText
        }
        return TemplatesManager.templates[name]
    }

    static getRenderElement(name){
        const element = document.querySelectorAll(`render[${name}]`)[0]
        return element
    }
}
TemplatesManager.templates = []
export default TemplatesManager
