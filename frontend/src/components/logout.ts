import {Popup} from "./popup";
import {Auth} from "../services/auth";

export class Logout extends Popup {
  readonly imageProfileElement: HTMLElement | null

  constructor() {
    super();
    this.imageProfileElement = document.getElementById('profile-image')
    this.initLogout()
  }

  private initLogout(): void {
    if (this.imageProfileElement) {
      this.imageProfileElement.addEventListener('click', () => {
        if (this.popupElement && this.popupContent &&
          this.popupTextElement && this.popupButtonElement) {
          this.popupElement.classList.remove('hide')
          this.popupContent.style.cssText = `
                        height: 15rem;
                        width: 35rem;
                    `;
          this.popupTextElement.textContent = 'Do you really walk out?'
          this.popupTextElement.style.color = 'red'
          const button: HTMLElement = document.createElement('button');
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
        }
      })
    }
  }

  private async init(): Promise<void> {
    await Auth.logout()
    window.location.href = "#/login"
  }
}