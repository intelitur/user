import footer from './views/footer/footer'

function initRender(){
    const initElements = {
        footer
    }

    Object.values(initElements).forEach(el => el.render())

    window.globalFunctions = {
        showTab: footer.showTab.bind(footer)
    }
}

initRender()