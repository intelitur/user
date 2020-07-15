class TemplatesManager {

    static async getTemplate(name) {
        if (!TemplatesManager.templates[name] || (typeof TemplatesManager.templates[name] !== 'string')) {
            let request = fetch(`./html/${name}.html`, {mode: 'no-cors'})

            let htmlText = await (await request).text()

            TemplatesManager.templates[name] = htmlText
        }
        return TemplatesManager.templates[name]
    }

    static renderElement(name, htmlNode){
        if(typeof htmlNode === 'string')
            htmlNode = TemplatesManager.createHtmlNode(htmlNode)
        htmlNode.setAttribute('render', name)
        const element = document.querySelectorAll(`[render*=${name}]`)[0]
        htmlNode.className = `${element.className} ${htmlNode.className}`
        element.parentNode.insertBefore(htmlNode, element)
        element.parentNode.removeChild(element)
        return htmlNode
    }

    static contextPipe(htmlText, context, returnText = true){
        const withLoops = TemplatesManager.doLoops.bind(context)(htmlText)
        let html = withLoops.outerHTML
        html = html.patch(context)
        if(returnText)
            return html
        return TemplatesManager.createHtmlNode(html)
    }

    static doLoops(htmlText){
        const template = TemplatesManager.createHtmlNode(htmlText)
        const loops = template.querySelectorAll('[foreach]')
        loops.forEach((loop) => {
            const {parentNode, outerHTML} = loop
            const forValues = loop.getAttribute('foreach').split(' of ')
            const iteratorName = forValues[0].split(' & ')[0]
            const withIndex = forValues[0].split(' & ').length === 2
            const iterableS = forValues[1].split(".")
            let iterable = this[iterableS[0]]
            if(iterableS.length > 1)
                iterableS.slice(1).forEach((e) => {iterable = iterable[e]})
            parentNode.innerHTML = ''
            iterable.forEach((iterator, i) => {
                const obj = Object.fromEntries(withIndex? [[iteratorName, iterator], [i, i]]: [[iteratorName, iterator]])
                const node = TemplatesManager.createHtmlNode(outerHTML.patch(obj))
                node.removeAttribute('foreach')
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
