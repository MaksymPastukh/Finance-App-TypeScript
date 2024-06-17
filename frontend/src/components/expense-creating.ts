import {CustomHttp} from "../services/custom-http.ts";
import config from "../config/config.ts";
import {Expense} from "./expense";

export class ExpenseCreating extends Expense {
  constructor() {
    super(false);
    this.expenseCreatingInput = document.getElementById('input-create-expense')
    this.buttonCreateCreating = document.getElementById('create-expense-button')
    this.buttonCancelCreating = document.getElementById('cancel-expense-button')

    this.buttonCreateCreating.addEventListener('click', this.initExpenseCreating.bind(this));
    this.buttonCancelCreating.addEventListener('click', () => {
      window.location.href = '/#/expense-category';
    })
  }


  async initExpenseCreating() {
    if (this.token) {
      if (!this.token) location.href = "#/login";
      try {
        const result = await CustomHttp.request(config.host + "/categories/expense/", "POST", {
          title: this.expenseCreatingInput.value
        });

        if (result) {
          if (!result) throw new Error('Error');
          window.location.href = '/#/expense-category';
        }
      } catch (e) {
        return e;
      }
    }
  }
}