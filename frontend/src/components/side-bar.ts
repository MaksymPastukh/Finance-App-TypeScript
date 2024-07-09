import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {Auth} from "../services/auth";
import {Popup} from "./popup";
import {WarningMessageType} from "../types/warning-message.type";
import {UserInfoType} from "../types/user-info.type";
import {BalanceSideBarPutType, BalanceSidebarType} from "../types/balance-sidebar.type";

export class SideBar extends Popup {
  readonly balanceElement: HTMLElement | null
  readonly profileElement: HTMLElement | null
  readonly chengeBalanceElement: HTMLElement | null
  readonly buttonSave: HTMLButtonElement
  readonly buttonCancel: HTMLButtonElement
  readonly message: WarningMessageType


  constructor() {
    super()
    this.buttonSave = document.createElement('button');
    this.buttonCancel = document.createElement('button');
    this.balanceElement = document.getElementById('amount')
    this.profileElement = document.getElementById('profile')
    this.chengeBalanceElement = document.getElementById('change-balance-popup')
    this.message = {
      success: 'The balance amount has been successfully changed.',
      error: 'Please enter numeric value.',
    }

    this.init()
    this.popupChangeBalance()
  }

  private async init(): Promise<void> {
    const token: string | null = localStorage.getItem(Auth.accessToken)
    const userInfo: UserInfoType | null = Auth.getUserInfo()

    if (!userInfo && !token) {
      location.href = "#/login"
      return
    }

    if (token) {
      try {
        const resultBalance: BalanceSidebarType = await CustomHttp.request(config.host + "/balance")
        if (resultBalance) {
          if (resultBalance.error) {
            throw new Error(resultBalance.message)
          }


          if (this.balanceElement) (this.balanceElement as HTMLElement).innerText = resultBalance.balance.toString()
          if (this.profileElement && userInfo) this.profileElement.innerText = `${userInfo.name} ${userInfo.lastName}`
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  private popupChangeBalance(): void {
    if (this.chengeBalanceElement) {
      this.chengeBalanceElement.addEventListener('click', (): void => {
        this.popupElement?.classList.remove('hide')
        if (this.popupTextElement) this.popupTextElement.textContent = 'You have the option of changing the amount'
        const input: HTMLInputElement = document.createElement('input')
        input.type = 'text';
        input.pattern = '[1-9]'
        input.classList.add('input')
        this.popupTextElement?.append(input)

        this.buttonSave.setAttribute('type', 'button');
        this.buttonSave.classList.add('button');
        this.buttonSave.textContent = 'Save'
        this.buttonSave.style.cssText = `
      
                        width: 11.1rem;
        font-size: 14px;
        background: #198754;
        font-family: 'Roboto-Regular', sans-serif;
                    `;

        this.popupButtonElement?.append(this.buttonSave)
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

        this.popupButtonElement?.append(this.buttonCancel)
      })
    }

    this.buttonSave.addEventListener('click', (): void => {
      let element: HTMLInputElement | null = document.querySelector('.input')
      if (element) {
        const value: string = element.value
        this.initChange(value)
      }
    })

    this.targetCloseModal()
  }

  private async initChange(amount: string): Promise<void> {
    try {
      const num: number = Number(amount);
      if (isNaN(num) || amount === '') {
        if (this.popupContent) this.popupContent.style.cssText = `
                        height: 10rem;
                    `;
        if (this.popupTextElement) this.popupTextElement.textContent = this.message.error
        if (this.popupTextElement) this.popupTextElement.style.color = 'red'
        if (this.popupButtonElement) this.popupButtonElement.style.display = 'none'

        setTimeout((): void => {
          this.hide()
          this.reset()
        }, 3000)
        return
      }

      const result: BalanceSideBarPutType = await CustomHttp.request(config.host + "/balance", "PUT", {
        newBalance: amount,
      })

      if (result) {
        if (!result) {
          throw new Error('Error')
        }
        const button: HTMLButtonElement = document.createElement('button')
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

        this.popupTextElement?.append(button)
        if (this.popupContent) this.popupContent.style.cssText = `
                        height: 10rem;
                    `;
        if (this.popupTextElement) this.popupTextElement.textContent = this.message.success
        if (this.popupTextElement) this.popupTextElement.style.color = 'green'
        if (this.popupButtonElement) this.popupButtonElement.style.display = 'none'

        setTimeout((): void => {
          this.hide()
          window.location.reload()
        }, 3000)
      }
    } catch (e) {
      return console.log(e)
    }
  }
}