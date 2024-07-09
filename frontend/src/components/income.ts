import {Popup} from "./popup";
import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {IncomeArrayType} from "../types/income-array.type";
import {DefaultResponseType} from "../types/default-response.type";
import {UserInfoType} from "../types/user-info.type";

export class Income extends Popup {
  readonly buttonSaveIncomeEditing: HTMLElement | null
  readonly buttonCancelIncomeEditing: HTMLElement | null
  readonly incomeCreatingInput: HTMLInputElement | null
  readonly buttonCreateIncomeCreating: HTMLElement | null
  readonly buttonCancelIncomeCreating: HTMLElement | null
  readonly incomeElements: HTMLElement | null
  private incomeElement: HTMLElement | null
  private buttonDelete: HTMLElement | null
  private atrributId: string | null
  readonly userToken: string | null
  readonly idIncome: string
  private categoryIncome: IncomeArrayType[] = []
  private categoryTest: IncomeArrayType[] = []
  readonly inputSaveEditing: HTMLInputElement | null
  public inputSaveValue: HTMLInputElement | null

  constructor() {
    super();
    this.incomeElements = document.getElementById('income-items')
    this.inputSaveEditing = document.getElementById('input-income-category') as HTMLInputElement | null
    this.incomeElement = null
    this.idIncome = 'income'
    this.inputSaveValue = null
    this.buttonDelete = null
    this.atrributId = null
    this.userToken = localStorage.getItem(Auth.accessToken)
    this.buttonSaveIncomeEditing = document.getElementById('save-income-button')
    this.buttonCancelIncomeEditing = document.getElementById('cancel-income-button')
    this.incomeCreatingInput = document.getElementById('input-create-income') as HTMLInputElement
    this.buttonCreateIncomeCreating = document.getElementById('create-income-button')
    this.buttonCancelIncomeCreating = document.getElementById('cancel-income-button')

    this.initIncome()


    this.buttonSaveIncomeEditing?.addEventListener('click', this.initIncomeEdit.bind(this));
    this.buttonCancelIncomeEditing?.addEventListener('click', () => {
      window.location.href = '/#/income-category';
    })
    this.buttonCreateIncomeCreating?.addEventListener('click', this.initIncomeCreating.bind(this));
    this.buttonCancelIncomeCreating?.addEventListener('click', () => {
      window.location.href = '/#/income-category';
    })

  }

  private async initIncome(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) {
      location.href = '#/login'
      return
    }
    if (this.userToken && userInfo) {
      try {
        const result: IncomeArrayType[] | DefaultResponseType = await CustomHttp.request(config.host + "/categories/income")
        if (result) {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message)
          }

          this.categoryIncome = result as IncomeArrayType[]
          this.processIncomeCategory()
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }

  private async initIncomeCreating(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) {
      location.href = '#/login'
      return
    }
    if (this.userToken && userInfo) {
      const result: DefaultResponseType = await CustomHttp.request(config.host + "/categories/income/", "POST", {
        title: this.incomeCreatingInput?.value
      });

      if (result) {
        if ((result as DefaultResponseType).error !== undefined) {
          throw new Error((result as DefaultResponseType).message)
        }
        window.location.href = '/#/income-category';
      }
    }
  }


  private processIncomeCategory(): void {
    if (this.categoryIncome && this.categoryIncome.length) {
      this.categoryIncome.forEach((item: IncomeArrayType): void => {
        this.incomeElement = document.createElement('div')
        this.incomeElement.className = 'income-item'
        this.incomeElement.setAttribute("data-id", item.id.toString())

        const incomeElementTextElement: HTMLDivElement = document.createElement("div")
        incomeElementTextElement.className = "income-item-title"
        incomeElementTextElement.setAttribute('id', 'income-item-title');
        incomeElementTextElement.innerText = item.title

        const buttonEdit: HTMLButtonElement = document.createElement('button');
        buttonEdit.setAttribute('id', 'button-edit');
        buttonEdit.classList.add('button', 'edit-category');
        buttonEdit.innerText = 'Edit';

        this.buttonDelete = document.createElement('button')
        this.buttonDelete.setAttribute('type', 'button');
        this.buttonDelete.classList.add('button', 'delete');
        this.buttonDelete.innerText = 'Delete'

        this.incomeElements?.appendChild(this.incomeElement)
        this.incomeElement.appendChild(incomeElementTextElement)
        this.incomeElement.appendChild(buttonEdit)
        this.incomeElement.appendChild(this.buttonDelete)
      })

      this.deleteCategory()
      this.editingIncomeCategory();

    }

    const createElement: HTMLAnchorElement = document.createElement('a');
    createElement.setAttribute('href', '/#/income-create');
    const buttonCreateElement: HTMLButtonElement = document.createElement('button');
    buttonCreateElement.setAttribute('type', 'button');
    buttonCreateElement.classList.add('create');
    buttonCreateElement.innerText = '+';
    createElement.appendChild(buttonCreateElement);
    this.incomeElements?.appendChild(createElement)
  }

  private deleteCategory(): void {
    const deleteCategory: NodeListOf<Element> = document.querySelectorAll('.button.delete')
    deleteCategory.forEach((item: Element): void => {
      item.addEventListener('click', (e: Event): void => {
        let incomeItem: Element | null = (e.target as HTMLElement).closest('.income-item');
        if (incomeItem) {
          this.atrributId = incomeItem.getAttribute('data-id');
          if (this.atrributId) {
            this.popupElement?.classList.remove('hide')
            if (this.popupContent && this.popupTextElement) {
              this.popupContent.style.cssText = `
                        height: 16rem;
                        width: 46rem;
                    `;
              this.popupTextElement.textContent = 'Do you really want to delete the category?'
              this.popupTextElement.style.color = '#290661'
            }
            const buttonDelete: HTMLButtonElement = document.createElement('button');
            buttonDelete.setAttribute('type', 'button');
            buttonDelete.classList.add('button');
            buttonDelete.textContent = 'Yes, delete it.'
            buttonDelete.style.cssText = `
      
                        width: 11.1rem;
                        font-size: 14px;
                        background: #198754;
                        font-family: "Roboto-Regular", sans-serif;
                        margin-top: 2rem;
                    `;

            const buttonCancel: HTMLButtonElement = document.createElement('button');
            buttonCancel.setAttribute('type', 'button');
            buttonCancel.classList.add('button');
            buttonCancel.textContent = 'Don\'t delete'
            buttonCancel.style.cssText = `
                        width: 11.1rem;
                        font-size: 14px;
                        margin-left: 1.2rem;
                        background: #dc3545;
                        font-family: "Roboto-Regular", sans-serif;
                        margin-top: 2rem;
                    `;

            this.popupTextElement?.append(buttonDelete)
            this.popupTextElement?.append(buttonCancel)

            buttonDelete.addEventListener('click', async (): Promise<void> => {
              try {
                const result: DefaultResponseType = await CustomHttp.request(config.host + "/categories/income/" + this.atrributId, "DELETE")
                if (result) {
                  if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message)
                  }

                  this.reset()
                  this.hide()
                  window.location.reload()
                }
              } catch (e) {
                throw new Error((e as DefaultResponseType).message)
              }
            })

            buttonCancel.addEventListener('click', (): void => {
              this.reset()
              this.hide()
            })
          }
        }
      })
    })
  }

  private editingIncomeCategory(): void {
    const valueCategory: NodeListOf<Element> = document.querySelectorAll('.button.edit-category')
    valueCategory.forEach((item: Element): void => {
      item.addEventListener('click', (e: Event): void => {
        let incomeItem: Element | null = (e.target as HTMLElement).closest('.income-item');
        if (incomeItem) {
          this.atrributId = incomeItem.getAttribute('data-id');
          if (this.atrributId) localStorage.setItem(this.idIncome, this.atrributId)
          window.location.href = '/#/income-edit'

          setTimeout(async (): Promise<void> => {
            await this.initEditIncomeInput();
          }, 50);
        }
      })
    })
  }

  private async initEditIncomeInput(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) {
      location.href = '#/login'
      return
    }
    if (this.userToken && userInfo) {
      try {
        const result: IncomeArrayType[] | DefaultResponseType = await CustomHttp.request(config.host + "/categories/income")
        if (result) {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message)
          }
          this.categoryTest = result as IncomeArrayType[]
          this.inputSaveValue = document.getElementById('input-income-category') as HTMLInputElement | null
          if (this.categoryTest) this.categoryTest.forEach((item: IncomeArrayType): void => {
            if (item.id === Number(this.atrributId)) {
              if (this.inputSaveValue) {
                this.inputSaveValue.value = item.title;
              }
            }
          })
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }

  private async initIncomeEdit(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) {
      location.href = '#/login'
      return
    }
    if (this.userToken && userInfo) {
      try {
        const getLocalId: string | null = localStorage.getItem(this.idIncome)
        if (getLocalId) {
          const result: DefaultResponseType | IncomeArrayType[] = await CustomHttp.request(config.host + "/categories/income/" + getLocalId, "PUT", {
            title: this.inputSaveEditing?.value
          });

          if (result) {
            if ((result as DefaultResponseType).error) {
              throw new Error((result as DefaultResponseType).message)
            }
            localStorage.removeItem(this.idIncome)
            window.location.href = '/#/income-category';
          }
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }
}