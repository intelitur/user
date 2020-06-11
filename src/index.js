import footer from './views/footer/footer'
import './styles.css'

function initRender(){
    const initElements = {
        footer
    }

    Object.values(initElements).forEach(el => el.render())
    
}

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




configStringPatch()


initRender()