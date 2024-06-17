import {Operations} from "./operations";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {GetOperationsFilter} from "../utils/getOperationsFilter";

export class OperationsCreate extends Operations {
  constructor() {
    super(false);
    this.selectType = document.getElementById('operations-create-type')
    this.inputAmount = document.getElementById('operations-create-amount')
    this.inputDate = document.getElementById('operations-create-date')
    this.inputComment = document.getElementById('operations-create-comments')
    this.selectCategory = document.getElementById('operations-create-category')
    this.buttonCreateOf = document.getElementById('operations-create-create')
    this.buttonCancelOf = document.getElementById('operations-create-cancel')
    this.arraySelectIncome = []
    this.arraySelectExpense = []

    this.inputTypeDate.forEach(e => {
      e.addEventListener("focusin", function (ev) {
        e.type = 'date';
      })
    });

    this.inputTypeDate.forEach(e => {
      e.addEventListener("focusout", function (ev) {
        e.type = 'text';
      })
    });

    this.buttonCreateOf.addEventListener('click', this.initCreating.bind(this));
    this.buttonCancelOf.addEventListener('click', () => {
      window.location.href = '/#/income-expenses';
    })

    this.initIncomeCategory()
    this.initExpenseCategory()
  }

  async initIncomeCategory() {
      try {
        const result = await CustomHttp.request(config.host + "/categories/income")
        if (result) {
          if (!result) throw new Error('Error')

          this.arraySelectIncome = result
          this.createChangeSelectType()
          this.createDateToSelectCategory()
        }
      } catch (e) {
        throw new Error(e)
      }

  }

  async initExpenseCategory() {
      try {
        const result = await CustomHttp.request(config.host + "/categories/expense")
        if (result) {
          if (!result) throw new Error('Error')

          this.arraySelectExpense = result

          this.createChangeSelectType()
          this.createDateToSelectCategory()
        }
      } catch (e) {
        throw new Error(e)
      }

  }

  async initCreating() {
    if (this.token) {
      if (!this.token) location.href = "#/login";
      try {
        const result = await CustomHttp.request(config.host + "/operations", "POST", {
          type:  this.selectType.value,
          amount: +this.inputAmount.value,
          date: GetOperationsFilter.chengeToData(this.inputDate.value),
          comment: this.inputComment.value,
          category_id: +this.selectCategory.value
        });

        if (result) {
          if (!result) throw new Error('Error');
          window.location.href = '/#/income-expenses';
        }
      } catch (e) {
        return e;
      }
    }
  }



  createChangeSelectType() {
    this.selectType.addEventListener('change', () => {
      this.selectCategory.innerHTML = "";
      this.createDateToSelectCategory()
    })
  }

  createDateToSelectCategory() {
    this.selectTypeElement = this.selectType.options[this.selectType.selectedIndex];
    this.selectTypeValue = this.selectTypeElement.value;

    if (this.selectTypeValue === 'income') {
        this.arraySelectIncome.forEach(item => {
        this.options = document.createElement("option");
        this.options.value = item.id;
        this.options.text = item.title;
        this.selectCategory.appendChild(this.options);
      });

    } else {
      this.arraySelectExpense.forEach(item => {
        this.options = document.createElement("option");
        this.options.value = item.id;
        this.options.text = item.title;
        this.selectCategory.appendChild(this.options);
      });
    }
  }
}