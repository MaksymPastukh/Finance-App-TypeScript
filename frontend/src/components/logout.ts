import {Popup} from "./popup.ts";
import {Auth} from "../services/auth.ts";

export class Logout extends Popup {
  constructor() {
    super();
    this.imageProfileElement = document.getElementById('profile-image')
    this.initLogout()
  }

 initLogout() {
    this.imageProfileElement.addEventListener('click', () => {
      this.popupElement.classList.remove('hide')
      this.popupContent.style.cssText = `
                        height: 15rem;
                        width: 35rem;
                    `;
      this.popupTextElement.textContent = 'Do you really walk out?'
      this.popupTextElement.style.color = 'red'
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.classList.add('button');
      button.textContent = 'YES'
      button.style.cssText = `
      
                        width: 15.1rem;
                        font-size: 14px;
                        background: #198754;
                        font-family: "Roboto-Regular", sans-serif;
                        margin-top: 2rem;
                    `;

      this.popupTextElement.append(button)

      button.addEventListener('click', () => {
        this.init()
        this.reset()
        this.hide()
      })
    })
  }

  async init() {
    await Auth.logout()
    window.location.href = "#/login"
  }
}