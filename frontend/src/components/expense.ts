import {Popup} from "./popup.ts";
import {Auth} from "../services/auth.ts";
import {CustomHttp} from "../services/custom-http.ts";
import config from "../config/config.ts";

export class Expense extends Popup {
  constructor(initExtends = true) {
    super();

    this.expenseElements = document.getElementById('expense-items')
    this.expenseElement = null
    this.buttonExpenseDelete = null
    this.inputSaveExpenseEditing = document.getElementById('input-editing-expense')
    this.atrributId = null
    this.idCategoryExpense = 'idCategory'
    this.categoryExpense = []
    this.token = localStorage.getItem(Auth.accessToken)

    if(initExtends) this.initExpenseCategory()
  }

  async initExpenseCategory() {
    if (this.token) {
      if (!this.token) location.href = '#/login'
      try {
        const resultExpense = await CustomHttp.request(config.host + "/categories/expense")
        if (resultExpense) {
          if (!resultExpense) throw new Error('Error')

          this.categoryExpense = resultExpense
          this.processExpenseCategory()
        }
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  processExpenseCategory() {
    if (this.categoryExpense && this.categoryExpense.length) {
      this.categoryExpense.forEach(item => {
        this.expenseElement = document.createElement('div')
        this.expenseElement.className = 'expense-item'
        this.expenseElement.setAttribute('data-id', item.id)

        const expenseElementTextElement = document.createElement('div')
        expenseElementTextElement.className = 'expense-item-title'
        expenseElementTextElement.innerText = item.title

        this.buttonEditExpense = document.createElement('button');
        this.buttonEditExpense.setAttribute('id', 'button-edit')
        this.buttonEditExpense.classList.add('button', 'edit-category')
        this.buttonEditExpense.innerText = 'Edit'

        this.buttonExpenseDelete = document.createElement('button')
        this.buttonExpenseDelete.setAttribute('type', 'button');
        this.buttonExpenseDelete.classList.add('button', 'delete');
        this.buttonExpenseDelete.innerText = 'Delete'

        this.expenseElements.appendChild(this.expenseElement)
        this.expenseElement.appendChild(expenseElementTextElement)
        this.expenseElement.appendChild(this.buttonEditExpense)
        this.expenseElement.appendChild(this.buttonExpenseDelete)
      })

      this.deleteExpenseCategory()
      this.editingExpenseCategory = this.editingExpenseCategory.bind(this);
      this.editingExpenseCategory()
    }

    const createCategoryElement = document.createElement('a');
    createCategoryElement.setAttribute('href', '/#/expense-create');
    const buttonCreateElement = document.createElement('button');
    buttonCreateElement.setAttribute('type', 'button');
    buttonCreateElement.classList.add('create');
    buttonCreateElement.innerText = '+';
    createCategoryElement.appendChild(buttonCreateElement);
    this.expenseElements.appendChild(createCategoryElement)
  }


  deleteExpenseCategory() {
    const deleteExpenseCategory = document.querySelectorAll('.button.delete')
    deleteExpenseCategory.forEach(itemExpense => {
      itemExpense.addEventListener('click', async (e) => {
        let expenseItem = e.target.closest('.expense-item');

        if (expenseItem) {
          this.atrributId = expenseItem.getAttribute('data-id');

          if(this.atrributId) {
            this.popupElement.classList.remove('hide')
            this.popupContent.style.cssText = `
                        height: 15rem;
                        width: 46rem;
                    `;
            this.popupTextElement.textContent = 'Do you really want to delete the category?'
            this.popupTextElement.style.color = '#290661'
            const buttonDelete = document.createElement('button');
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

            const buttonCancel = document.createElement('button');
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

            this.popupTextElement.append(buttonDelete)
            this.popupTextElement.append(buttonCancel)

            buttonDelete.addEventListener('click', async () => {
              try {
                const result = await CustomHttp.request(config.host + "/categories/expense/" + this.atrributId, "DELETE")
                if (result) {
                  if (!result) throw new Error('Error')
                  this.reset()
                  this.hide()
                  window.location.reload()
                }
              } catch (e) {
                return e
              }
            })

            buttonCancel.addEventListener('click', () => {
              this.reset()
              this.hide()
            })
          }
        }
      })
    })
  }

  editingExpenseCategory() {
    const valueExpenseCategory = document.querySelectorAll('.button.edit-category')
    valueExpenseCategory.forEach(itemExpense => {
      itemExpense.addEventListener('click', (e) => {

        let expenseItem = e.target.closest('.expense-item');

        if (expenseItem) {
          this.atrributId = expenseItem.getAttribute('data-id');
          localStorage.setItem(this.idCategoryExpense, this.atrributId);
          window.location.href = '/#/expense-edit'
        }
      })
    })
  }
}