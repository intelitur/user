import footer from './views/footer/footer'
import './styles.css'
import RouteController from './utils/RouteController'

/**
 * Renderiza los elementos iniciales.
 */
async function initRender(){
    configBounds()

    const initElements = {
        footer
    }

    Promise.all(Object.values(initElements).map(el => el.render())).then((r)=> {
        RouteController.verifyQuery()
    })
    
    
}

/**
 * Crea una nueva función para los Strings que funciona como lo indica el ejemplo
 * @example "{hello} {world}".patch({hello: "hola", world: "mundo"}) == "hola mundo"
 */
function configStringPatch(){
    let Strings = {
        patch: (function () {
            var regexp = /{([^{]+)}/g;
    
            return (str, o) => str.replace(regexp, (ignore, key) => eval(`o.${key}`))
        })()
    };
    
    String.prototype.patch = function(o) {
        return Strings.patch(this, o);
    }
}

/**
 * Configura el height de la aplicación para que no sea menor del que tuvo al inicio
 */
function configBounds(){
    let minHeight = document.body.clientHeight
    document.body.style.minHeight = `${minHeight}px`
}




configStringPatch()


initRender()