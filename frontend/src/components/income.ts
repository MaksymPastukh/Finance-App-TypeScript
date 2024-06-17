import {Popup} from "./popup.ts";
import {Auth} from "../services/auth.ts";
import {CustomHttp} from "../services/custom-http.ts";
import config from "../config/config.ts";

export class Income extends Popup {
  constructor(initIncome = true) {
    super();
    this.incomeElements = document.getElementById('income-items')
    this.incomeElement = null
    this.buttonDelete = null
    this.atrributId = null
    this.idCategoryIncome = 'idCategory'
    this.token = localStorage.getItem(Auth.accessToken)
    this.categoryIncome = []
    this.inputSaveEditing = document.getElementById('input-income-category')

    if(initIncome) this.initIncome()
  }

  async initIncome() {
    if (this.token) {
      if (!this.token) location.href = "#/login"
      try {
        const result = await CustomHttp.request(config.host + "/categories/income")
        if (result) {
          if (!result) throw new Error('Error')

          this.categoryIncome = result

          this.processIncomeCategory()
        }
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  processIncomeCategory() {
    if (this.categoryIncome && this.categoryIncome.length) {
      this.categoryIncome.forEach(item => {
        this.incomeElement = document.createElement('div')
        this.incomeElement.className = 'income-item'
        this.incomeElement.setAttribute("data-id", item.id)


        const incomeElementTextElement = document.createElement("div")
        incomeElementTextElement.className = "income-item-title"
        incomeElementTextElement.setAttribute('id', 'income-item-title');

        incomeElementTextElement.innerText = item.title

        this.buttonEdit = document.createElement('button');
        this.buttonEdit.setAttribute('id', 'button-edit');
        this.buttonEdit.classList.add('button', 'edit-category');
        this.buttonEdit.innerText = 'Edit';

        this.buttonDelete = document.createElement('button')
        this.buttonDelete.setAttribute('type', 'button');
        this.buttonDelete.classList.add('button', 'delete');
        this.buttonDelete.innerText = 'Delete'

        this.incomeElements.appendChild(this.incomeElement)
        this.incomeElement.appendChild(incomeElementTextElement)
        this.incomeElement.appendChild(this.buttonEdit)
        this.incomeElement.appendChild(this.buttonDelete)
      })

      this.deleteCategory()
      this.editingIncomeCategory();
    }

    const createElement = document.createElement('a');
    createElement.setAttribute('href', '/#/income-create');
    const buttonCreateElement = document.createElement('button');
    buttonCreateElement.setAttribute('type', 'button');
    buttonCreateElement.classList.add('create');
    buttonCreateElement.innerText = '+';
    createElement.appendChild(buttonCreateElement);
    this.incomeElements.appendChild(createElement)
  }

  deleteCategory() {
    const deleteCategory = document.querySelectorAll('.button.delete')
    deleteCategory.forEach(item => {
      item.addEventListener('click', (e) => {
        let incomeItem = e.target.closest('.income-item');

        if (incomeItem) {
          this.atrributId = incomeItem.getAttribute('data-id');

          if(this.atrributId) {
            this.popupElement.classList.remove('hide')
            this.popupContent.style.cssText = `
                        height: 16rem;
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
                const result = await CustomHttp.request(config.host + "/categories/income/" + this.atrributId, "DELETE")
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

  editingIncomeCategory() {
    const valueCategory = document.querySelectorAll('.button.edit-category')

    valueCategory.forEach(item => {
      item.addEventListener('click', (e) => {
        let incomeItem = e.target.closest('.income-item');

        if (incomeItem) {
          this.atrributId = incomeItem.getAttribute('data-id');
          localStorage.setItem(this.idCategoryIncome, this.atrributId);
          window.location.href = '/#/income-edit'
        }
      })
    })
  }

}