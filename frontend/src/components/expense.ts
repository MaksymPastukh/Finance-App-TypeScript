import {Popup} from "./popup";
import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {ExpenseArrayType} from "../types/expense-array.type";
import {UserInfoType} from "../types/user-info.type";
import {DefaultResponseType} from "../types/default-response.type";

export class Expense extends Popup {
  readonly expenseCreatingInput: HTMLInputElement | null
  readonly buttonCreateCreating: HTMLElement | null
  readonly buttonCancelCreating: HTMLElement | null
  readonly buttonSaveEditing: HTMLElement | null
  readonly buttonCancelEditing: HTMLElement | null
  readonly expenseElements: HTMLElement | null
  private expenseElement: HTMLElement | null
  private buttonExpenseDelete: HTMLElement | null
  private inputSaveExpenseEditing: HTMLInputElement | null
  private atrributId: string | null
  readonly idExpense: string
  private categoryExpense: ExpenseArrayType[] = []
  readonly userToken: string | null
  public inputSaveValue: HTMLInputElement | null


  constructor() {
    super();
    this.expenseCreatingInput = document.getElementById('input-create-expense') as HTMLInputElement
    this.buttonCreateCreating = document.getElementById('create-expense-button')
    this.buttonCancelCreating = document.getElementById('cancel-expense-button')
    this.buttonSaveEditing = document.getElementById('save-expense-button')
    this.buttonCancelEditing = document.getElementById('cancel-expense-button')
    this.expenseElements = document.getElementById('expense-items')
    this.idExpense = 'expense'
    this.expenseElement = null
    this.inputSaveValue = null
    this.buttonExpenseDelete = null
    this.inputSaveExpenseEditing = document.getElementById('input-editing-expense') as HTMLInputElement
    this.atrributId = null
    this.userToken = localStorage.getItem(Auth.accessToken)

    this.initExpenseCategory()

    this.buttonCreateCreating?.addEventListener('click', this.initExpenseCreating.bind(this));
    this.buttonCancelCreating?.addEventListener('click', () => {
      window.location.href = '/#/expense-category';
    })

    this.buttonSaveEditing?.addEventListener('click', this.initExpenseEdit.bind(this));
    this.buttonCancelEditing?.addEventListener('click', () => {
      window.location.href = '/#/expense-category';
    })
  }


  private async initEditExpenseInput(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) {
      location.href = '#/login'
      return
    }
    if (this.userToken && userInfo) {

      try {
        const result: ExpenseArrayType[] | DefaultResponseType = await CustomHttp.request(config.host + "/categories/expense")
        if (result) {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message)
          }
          this.categoryExpense = result as ExpenseArrayType[]

          if (this.categoryExpense) this.categoryExpense.forEach((item: ExpenseArrayType): void => {
            if (item.id === Number(this.atrributId)) {
              this.inputSaveValue = document.getElementById('input-editing-expense') as HTMLInputElement | null
              if (this.inputSaveValue) {
                this.inputSaveValue.value = item.title
              }
            }
          })
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }

  private async initExpenseEdit(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) {
      location.href = '#/login'
      return
    }
    if (this.userToken && userInfo) {
      const getLocalId: string | null = localStorage.getItem(this.idExpense)
      if (getLocalId) {
        try {
          const result = await CustomHttp.request(config.host + "/categories/expense/" + getLocalId, "PUT", {
            title: this.inputSaveExpenseEditing?.value
          });

          if (result) {
            if ((result as DefaultResponseType).error !== undefined) {
              throw new Error((result as DefaultResponseType).message)
            }

            localStorage.removeItem(this.idExpense)
            window.location.href = '/#/expense-category';
          }
        } catch (e) {
          throw new Error((e as DefaultResponseType).message);
        }
      }
    }
  }

  private async initExpenseCategory(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) {
      location.href = '#/login'
      return
    }
    if (this.userToken && userInfo) {
      try {
        const resultExpense: ExpenseArrayType[] | DefaultResponseType = await CustomHttp.request(config.host + "/categories/expense")
        if (resultExpense) {
          if ((resultExpense as DefaultResponseType).error !== undefined) {
            throw new Error((resultExpense as DefaultResponseType).message)
          }

          this.categoryExpense = resultExpense as ExpenseArrayType[]
          this.processExpenseCategory()
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }

  private async initExpenseCreating(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) {
      location.href = '#/login'
      return
    }
    if (this.userToken && userInfo) {
      try {
        const result: DefaultResponseType = await CustomHttp.request(config.host + "/categories/expense/", "POST", {
          title: this.expenseCreatingInput?.value
        });

        if (result) {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message)
          }
          window.location.href = '/#/expense-category';
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }

  private processExpenseCategory(): void {
    if (this.categoryExpense && this.categoryExpense.length) {
      this.categoryExpense.forEach((item: ExpenseArrayType): void => {
        this.expenseElement = document.createElement('div')
        this.expenseElement.className = 'expense-item'
        this.expenseElement.setAttribute('data-id', item.id.toString())

        const expenseElementTextElement: HTMLDivElement = document.createElement('div')
        expenseElementTextElement.className = 'expense-item-title'
        expenseElementTextElement.innerText = item.title

        const buttonEditExpense: HTMLButtonElement = document.createElement('button');
        buttonEditExpense.setAttribute('id', 'button-edit')
        buttonEditExpense.classList.add('button', 'edit-category')
        buttonEditExpense.innerText = 'Edit'

        this.buttonExpenseDelete = document.createElement('button')
        this.buttonExpenseDelete.setAttribute('type', 'button');
        this.buttonExpenseDelete.classList.add('button', 'delete');
        this.buttonExpenseDelete.innerText = 'Delete'

        this.expenseElements?.appendChild(this.expenseElement)
        this.expenseElement.appendChild(expenseElementTextElement)
        this.expenseElement.appendChild(buttonEditExpense)
        this.expenseElement.appendChild(this.buttonExpenseDelete)
      })

      this.deleteExpenseCategory()
      this.editingExpenseCategory = this.editingExpenseCategory.bind(this);
      this.editingExpenseCategory()
    }

    const createCategoryElement: HTMLAnchorElement = document.createElement('a');
    createCategoryElement.setAttribute('href', '/#/expense-create');
    const buttonCreateElement: HTMLButtonElement = document.createElement('button');
    buttonCreateElement.setAttribute('type', 'button');
    buttonCreateElement.classList.add('create');
    buttonCreateElement.innerText = '+';
    createCategoryElement.appendChild(buttonCreateElement);
    this.expenseElements?.appendChild(createCategoryElement)
  }


  private deleteExpenseCategory(): void {
    const deleteExpenseCategory: NodeListOf<Element> = document.querySelectorAll('.button.delete')
    deleteExpenseCategory.forEach((itemExpense: Element): void => {
      itemExpense.addEventListener('click', async (e: Event): Promise<void> => {
        let expenseItem: Element | null = (e.target as HTMLElement).closest('.expense-item');

        if (expenseItem) {
          this.atrributId = expenseItem.getAttribute('data-id');
          if (this.atrributId) {
            this.popupElement?.classList.remove('hide')
            if (this.popupContent && this.popupTextElement) {
              this.popupContent.style.cssText = `
                        height: 15rem;
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
                const result: DefaultResponseType = await CustomHttp.request(config.host + "/categories/expense/" + this.atrributId, "DELETE")
                if (result) {
                  if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message)
                  }
                  this.reset()
                  this.hide()
                  window.location.reload()
                }
              } catch (e) {
                throw new Error((e as DefaultResponseType).message);
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

  private editingExpenseCategory(): void {
    const valueExpenseCategory: NodeListOf<Element> = document.querySelectorAll('.button.edit-category')
    valueExpenseCategory.forEach((itemExpense: Element): void => {
      itemExpense.addEventListener('click', (e: Event): void => {

        let expenseItem: Element | null = (e.target as HTMLElement).closest('.expense-item');
        if (expenseItem) {
          this.atrributId = expenseItem.getAttribute('data-id');
          if (this.atrributId) localStorage.setItem(this.idExpense, this.atrributId);
          window.location.href = '/#/expense-edit'

          setTimeout(async (): Promise<void> => {
            await this.initEditExpenseInput()
          }, 50);
        }
      })
    })
  }
}