import {CustomHttp} from "../services/custom-http.ts";
import config from "../config/config.ts";
import {Auth} from "../services/auth.ts";
import {Popup} from "./popup";

export class SideBar extends Popup {
  constructor() {
    super()
    this.balanceElement = document.getElementById('amount')
    this.profilElement = document.getElementById('profile')
    this.chengeBalanceElement = document.getElementById('change-balance-popup')
    this.buttonSave = document.createElement('button');
    this.buttonCancel = document.createElement('button');
    this.message = {
      success: 'The balance amount has been successfully changed.',
      error: 'Please enter numeric value.',
    }

    this.init()
    this.popupChangeBalance()
  }

  async init() {
    const token = localStorage.getItem(Auth.accessToken)
    const userInfo = Auth.getUserInfo()

    if (!userInfo && !token) {
      location.href = "#/login"
    }

    if (token) {
      try {
        const resultBalance = await CustomHttp.request(config.host + "/balance")
        if (resultBalance) {
          if (resultBalance.error) {
            throw new Error(resultBalance.error)
          }
          this.balanceElement.innerText = resultBalance.balance
          this.profilElement.innerText = `${userInfo.name} ${userInfo.lastName}`
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  popupChangeBalance() {
    this.chengeBalanceElement.addEventListener('click', () => {
      this.popupElement.classList.remove('hide')
      this.popupTextElement.textContent = 'You have the option of changing the amount'
      const input = document.createElement('input')
      input.type = 'text';
      input.pattern = '[1-9]'
      input.classList.add('input')
      this.popupTextElement.append(input)

      this.buttonSave.setAttribute('type', 'button');
      this.buttonSave.classList.add('button');
      this.buttonSave.textContent = 'Save'
      this.buttonSave.style.cssText = `
      
                        width: 11.1rem;
        font-size: 14px;
        background: #198754;
        font-family: 'Roboto-Regular', sans-serif;
                    `;

      this.popupButtonElement.append(this.buttonSave)
      this.buttonCancel.setAttribute('type', 'button');
      this.buttonCancel.classList.add('button');
      this.buttonCancel.textContent = 'Cancel'
      this.buttonCancel.style.cssText = `
      
                        font-family: 'Roboto-Regular', sans-serif;
          font-size: 14px;
          width: 10.7rem;
          margin-left: 1.2rem;
          background: #dc3545;
                    `;

      this.popupButtonElement.append(this.buttonCancel)
    })

    this.buttonSave.addEventListener('click', (event) => {
      let value = document.querySelector('.input').value
      this.initChange(value)
    })

    this.targetCloseModal()
  }

  async initChange(amount) {
    try {
      if (isNaN(amount) || amount === '') {
        this.popupContent.style.cssText = `
                        height: 10rem;
                    `;
        this.popupTextElement.textContent = this.message.error
        this.popupTextElement.style.color = 'red'
        this.popupButtonElement.style.display = 'none'

        setTimeout(() => {
          this.hide()
          this.reset()
        }, 3000)
        return false
      }

      const result = await CustomHttp.request(config.host + "/balance", "PUT", {
        newBalance: amount,
      })

      if (result) {
        if (!result) {
          throw new Error('Error')
        }
        const button = document.createElement('button')
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
        this.popupContent.style.cssText = `
                        height: 10rem;
                    `;
        this.popupTextElement.textContent = this.message.success
        this.popupTextElement.style.color = 'green'
        this.popupButtonElement.style.display = 'none'

        setTimeout(() => {
          this.hide()
          window.location.reload()
        }, 3000)
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}