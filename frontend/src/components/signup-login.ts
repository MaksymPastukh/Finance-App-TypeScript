import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {Popup} from "./popup";
import {Auth} from "../services/auth"
import {AuthorizationMessageType} from "../types/authorization-message.type";
import {UserInfoType} from "../types/user-info.type";

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
  readonly message: AuthorizationMessageType

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

  validateForm(): boolean {
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

  async processSingUp(): Promise<void> {
    if (this.validateForm() && this.fullNameElement && this.emailElement && this.passwordElement && this.repeatPasswordElement) {

      const fullName: string | null = this.fullNameElement.value
      const email: string | null = this.emailElement.value
      const password: string | null = this.passwordElement.value
      const checkPassword: string | null = this.repeatPasswordElement.value

      let first_name: string | null = fullName.split(' ')[0]
      let last_name: string | null = fullName.substring(first_name.length).trim()
      if (last_name === '') last_name = first_name

      try {
        const result = await CustomHttp.request(config.host + "/signup", "POST", {
            name: first_name,
            lastName: last_name,
            email: email,
            password: password,
            passwordRepeat: checkPassword
          }
        )

        if (result) {
          if (result.error) {
            if(this.popupElement)
            this.popupElement.classList.remove('hide')
            this.popupContent.style.cssText = `
                        height: 10rem;
                    `;
            this.popupTextElement.textContent = result.message
            this.popupTextElement.style.color = 'red'
            this.popupButtonElement.style.display = 'none'

            setTimeout(() => {
              this.reset()
              this.hide()
              location.href = '#/signup'
            }, 3000)
          } else {
            this.popupElement.classList.remove('hide')
            this.popupContent.style.cssText = `
                        height: 13rem;
                    `;
            this.popupTextElement.textContent = this.message.success
            this.popupTextElement.style.color = 'green'
            this.popupButtonElement.style.display = 'none'

            setTimeout(() => {
              this.reset()
              this.hide()
              location.href = '#/login'
            }, 5000)
          }
        }
      } catch (error) {
        return error
      }
    } else {
      console.log('error')
    }
  }

  async processLogin() {
    if (this.validateForm()) {
      const email = this.emailElement.value
      const password = this.passwordElement.value

      try {
        // Отправляем данные на бекэнд
        const result = await CustomHttp.request(config.host + "/login", "POST", {
          email: email,
          password: password
        })

        if (result) {
          if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
            this.popupElement.classList.remove('hide')
            this.popupContent.style.cssText = `
                        height: 10rem;
                    `;
            this.popupTextElement.textContent = result.message
            this.popupTextElement.style.color = 'red'
            this.popupButtonElement.style.display = 'none'

            setTimeout(() => {
              this.reset()
              this.hide()
              location.href = '#/login'
            }, 3000)

            throw new Error(result.message)
          }

          Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken)
          Auth.setUserInfo({
            name: result.user.name,
            lastName: result.user.lastName,
            email: email
          })

          location.href = "#/"

        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
