class TemplatesManager {

    static async getTemplate(name) {
        if (!TemplatesManager.templates[name]) {
            let request = fetch(`./html/${name}.html`, {mode: 'no-cors'})

            let htmlText = (await request).text()

            TemplatesManager.templates[name] = htmlText
        }
        return TemplatesManager.templates[name]
    }

    static renderElement(name, htmlNode){
        if(typeof htmlNode === 'string')
            htmlNode = TemplatesManager.createHtmlNode(htmlNode)
        htmlNode.setAttribute('render', name)
        const element = document.querySelectorAll(`[render*=${name}]`)[0]
        element.parentNode.insertBefore(htmlNode, element)
        element.parentNode.removeChild(element)
        return htmlNode
    }

    static doLoops(htmlText){
        const template = TemplatesManager.createHtmlNode(htmlText)
        const loops = template.querySelectorAll('[for]')
        loops.forEach((loop) => {
            const {parentNode, outerHTML} = loop
            const forValues = loop.getAttribute('for').split(' of ')
            const iteratorName = forValues[0].split(' & ')[0]
            const withIndex = forValues[0].split(' & ').length === 2
            const iterable = forValues[1]
            parentNode.innerHTML = ''
            this[iterable].forEach((iterator, i) => {
                const obj = Object.fromEntries(withIndex? [[iteratorName, iterator], [i, i]]: [[iteratorName, iterator]])
                const node = TemplatesManager.createHtmlNode(outerHTML.patch(obj))
                node.removeAttribute('for')
                parentNode.appendChild(node)
            })
        })
        return template
    }

    static createHtmlNode(htmlText){
        const node = document.createElement('template')
        node.innerHTML = htmlText.trim()
        return node.content.firstChild
    }
}
TemplatesManager.templates = []
export default TemplatesManager
