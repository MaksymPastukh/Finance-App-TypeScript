import {CustomHttp} from "../services/custom-http.ts";
import config from "../config/config.ts";
import {Expense} from "./expense";
export class ExpenseEditing extends Expense {
  constructor() {
    super(false);
    this.buttonSaveEditing = document.getElementById('save-expense-button')
    this.buttonCancelEditing = document.getElementById('cancel-expense-button')
    this.idCategory = localStorage.getItem(this.idCategoryExpense)
    this.categoryExpense = []

    this.buttonSaveEditing.addEventListener('click', this.initExpenseEdit.bind(this));
    this.buttonCancelEditing.addEventListener('click', () => {
      window.location.href = '/#/expense-category';
    })

    this.initEditExpenseInput()
  }

  async initEditExpenseInput() {
    if (this.token) {
      if (!this.token) location.href = "#/login"
      try {
        const result = await CustomHttp.request(config.host + "/categories/expense")
        if (result) {
          if (!result) throw new Error('Error')

          this.categoryExpense = result
          this.categoryExpense.forEach(item => {
            if(item.id === Number(this.idCategory)) {
              this.inputSaveExpenseEditing.value = item.title
            }
          })
        }
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  async initExpenseEdit() {
    if (this.token && this.idCategory) {
      if (!this.token) location.href = "#/login";

      if (this.idCategory) {
        try {
          const result = await CustomHttp.request(config.host + "/categories/expense/" + this.idCategory, "PUT", {
            title: this.inputSaveExpenseEditing.value
          });

          if (result) {
            if (!result) throw new Error('Error');

            localStorage.removeItem(this.idCategory);
            window.location.href = '/#/expense-category';
          }
        } catch (e) {
         throw new Error(e);
        }
      }
    }
  }
}