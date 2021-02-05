import TemplatesManager from "../../../utils/TemplatesManager";


import './tab5.css'
import './css/m_login.css'
import AuthService from "../../../auth/AuthService";
import DesignController from "../../../utils/DesignController";
import { FILES_BASE_URL } from "../../../env";

class Tab5 {

    constructor() {
    }

    async render() {
        const view = await TemplatesManager.getTemplate('tab5')
        this.el = TemplatesManager.renderElement('tab5', view)

        if (AuthService.isLogged()) {

        }
        else {
            if (DesignController.mobile) {
                const template = await TemplatesManager.getTemplate('m_login')

                const node = TemplatesManager.createHtmlNode(
                    template.patch({ googleImage: `${FILES_BASE_URL}/20200919193159432-google.png`, facebookImage: `${FILES_BASE_URL}/20200919193251333-facebook.png` })
                )

                this.el.appendChild(node)

                window.onSignIn = (googleUser) => {
                    var profile = googleUser.getBasicProfile();
                    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
                    console.log('Name: ' + profile.getName());
                    console.log('Image URL: ' + profile.getImageUrl());
                    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
                }
                const script = document.createElement('script');
                document.body.appendChild(script);
                script.async = true;
                //script.src = 'https://apis.google.com/js/platform.js';
            }
        }
    }

    show() { this.el.classList.add('active') }

    hide() { this.el.classList.remove('active') }
}

export default new Tab5()