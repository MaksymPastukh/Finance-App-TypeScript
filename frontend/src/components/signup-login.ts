import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {Popup} from "./popup";
import {Auth} from "../services/auth"
import {WarningMessageType} from "../types/warning-message.type";
import {UserInfoType} from "../types/user-info.type";
import {LoginResponseType} from "../types/login-response.type";
import {SignupResponseType} from "../types/signup-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class SignupLogin extends Popup {
  readonly userInfo: UserInfoType | null
  readonly accessToken: string | null
  readonly page: string
  readonly fullNameElement: HTMLInputElement | null
  readonly emailElement: HTMLInputElement | null
  readonly passwordElement: HTMLInputElement | null
  readonly repeatPasswordElement: HTMLInputElement | null
  readonly checkBoxElement: HTMLInputElement | null
  readonly buttonElementSingUp: HTMLElement | null
  readonly buttonElementLogin: HTMLElement | null
  readonly message: WarningMessageType
  private firstName: string | undefined
  private lastName: string | undefined

  constructor(page: string) {
    super()
    this.userInfo = Auth.getUserInfo()
    this.accessToken = localStorage.getItem(Auth.accessToken)
    if (this.accessToken && this.userInfo) location.href = "#/"
    this.page = page
    this.fullNameElement = document.getElementById('fullName') as HTMLInputElement
    this.emailElement = document.getElementById('email') as HTMLInputElement
    this.passwordElement = document.getElementById('password') as HTMLInputElement
    this.repeatPasswordElement = document.getElementById('checkPassword') as HTMLInputElement
    this.checkBoxElement = document.getElementById('checked') as HTMLInputElement
    this.buttonElementSingUp = document.getElementById("signUp")
    this.buttonElementLogin = document.getElementById("logIn")
    this.message = {
      success: 'You have successfully registered and will soon be redirected to the login page',
      error: 'Something went wrong... Try again.',
    }

    if (this.page === 'login' && this.buttonElementLogin) this.buttonElementLogin.addEventListener('click', this.processLogin.bind(this))
    if (this.page === 'signup' && this.buttonElementSingUp) this.buttonElementSingUp.addEventListener('click', this.processSingUp.bind(this))
  }

  private validateForm(): boolean {
    let isValid: boolean = true
    if (this.emailElement) {
      if (this.emailElement.value && this.emailElement.value.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)) {
        this.emailElement.classList.remove('error-input')
      } else {
        this.emailElement.classList.add('error-input')
        isValid = false;
      }
    }

    if (this.fullNameElement) {
      if (this.page === 'signup') {
        if (this.fullNameElement.value && this.fullNameElement.value.match(/^[a-zA-Z\s]+$/)) {
          this.fullNameElement.classList.remove('error-input')
        } else {
          this.fullNameElement.classList.add('error-input')
          isValid = false;
        }
      }


      if (this.passwordElement) {
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
          this.passwordElement.classList.remove('error-input')
        } else {
          this.passwordElement.classList.add('error-input')
          isValid = false;
        }
      }

      if (this.repeatPasswordElement && this.passwordElement) {
        if (this.repeatPasswordElement.value && this.repeatPasswordElement.value === this.passwordElement.value) {
          this.repeatPasswordElement.classList.remove('error-input')
        } else {
          this.repeatPasswordElement.classList.add('error-input')
          isValid = false;
        }
      }
    }

    if (this.page === 'login') {
      if (this.checkBoxElement) {
        if (!this.checkBoxElement.checked) {
          const nextElement: HTMLElement | null = this.checkBoxElement.nextElementSibling as HTMLElement | null
          if (nextElement) nextElement.style.color = 'red'
          isValid = false;
        }
      }

      if (this.passwordElement) {
        if (this.passwordElement.value) {
          this.passwordElement.classList.remove('error-input')
        } else {
          this.passwordElement.classList.add('error-input')
          isValid = false;
        }
      }
    }

    return isValid
  }

  private async processSingUp(): Promise<void> {
    if (this.validateForm()) {
      if (this.fullNameElement) {
        const fullName: string | null = this.fullNameElement.value
        let parts: string[] = fullName.split(' ')
        this.firstName = parts.shift();
        this.lastName = parts.join(' ');
      }

      try {
        const result: SignupResponseType | DefaultResponseType = await CustomHttp.request(config.host + "/signup", "POST", {
            name: this.firstName,
            lastName: this.lastName,
            email: this.emailElement?.value,
            password: this.passwordElement?.value,
            passwordRepeat: this.repeatPasswordElement?.value
          }
        )

        if (result) {
          if ((result as DefaultResponseType).error !== undefined) {

            this.popupElement?.classList.remove('hide')
            if (this.popupContent && this.popupTextElement && this.popupButtonElement) {
              this.popupContent.style.cssText = `
                        height: 10rem;
                    `;
              this.popupTextElement.textContent = (result as DefaultResponseType).message
              this.popupTextElement.style.color = 'red'
              this.popupButtonElement.style.display = 'none'

              setTimeout((): void => {
                this.reset()
                this.hide()
                location.href = '#/signup'
              }, 3000)

            }

          } else {
            this.popupElement?.classList.remove('hide')
            if (this.popupContent && this.popupTextElement && this.popupButtonElement) {
              this.popupContent.style.cssText = `
                        height: 13rem;
                    `;
              this.popupTextElement.textContent = this.message.success
              this.popupTextElement.style.color = 'green'
              this.popupButtonElement.style.display = 'none'

              setTimeout((): void => {
                this.reset()
                this.hide()
                location.href = '#/login'
              }, 5000)
            }
          }
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }

    }
  }


  private async processLogin(): Promise<void> {
    if (this.validateForm()) {
      const email: string | undefined = this.emailElement?.value
      const password: string | undefined = this.passwordElement?.value
      try {
        const result: LoginResponseType | DefaultResponseType = await CustomHttp.request(config.host + "/login", "POST", {
          email: email,
          password: password
        })

        if (result) {
          if ((result as DefaultResponseType).error || !(result as LoginResponseType).tokens.accessToken ||
            !(result as LoginResponseType).tokens.refreshToken || !(result as LoginResponseType).user.name ||
            !(result as LoginResponseType).user.lastName || !(result as LoginResponseType).user.id) {
            this.popupElement?.classList.remove('hide')
            if (this.popupContent && this.popupTextElement && this.popupButtonElement) {
              this.popupContent.style.cssText = `
                        height: 10rem;
                    `;
              this.popupTextElement.textContent = result.message
              this.popupTextElement.style.color = 'red'
              this.popupButtonElement.style.display = 'none'
            }

            setTimeout((): void => {
              this.reset()
              this.hide()
              location.href = '#/login'
            }, 3000)

            throw new Error(result.message)
          }

          Auth.setTokens((result as LoginResponseType).tokens.accessToken, (result as LoginResponseType).tokens.refreshToken)
          Auth.setUserInfo({
            name: (result as LoginResponseType).user.name,
            lastName: (result as LoginResponseType).user.lastName,
            email: email
          })

          location.href = "#/"
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }
}
