import {CustomHttp} from "../services/custom-http.ts";
import config from "../config/config.ts";
import {Operations} from "./operations";
import {GetOperationsFilter} from "../utils/getOperationsFilter.ts";

export class OperationsEditing extends Operations {
  constructor() {
    super(false);
    this.selectType = document.getElementById('operations-edit-type')
    this.inputAmount = document.getElementById('operations-edit-amount')
    this.inputDate = document.getElementById('operations-edit-date')
    this.inputComment = document.getElementById('operations-edit-comments')
    this.selectCategory = document.getElementById('operations-edit-category')
    this.buttonSaveEditing = document.getElementById('save-operations-button')
    this.buttonCancelEditing = document.getElementById('cancel-operations-button')
    this.idCategoryOperations = localStorage.getItem(this.idLocalStorage)

    this.arraySelectIncome = []
    this.arraySelectExpense = []
    this.arrayEditOptions = []

    this.buttonSaveEditing.addEventListener('click', this.initOperationsEdit.bind(this));
    this.buttonCancelEditing.addEventListener('click', () => {
      window.location.href = '/#/income-expenses';
    })


    this.initEditOptions()
    this.initIncomeCategory()
    this.initExpenseCategory()
  }

  async initEditOptions() {
    if (this.token) {
      if (!this.token) location.href = '#/login'
      try {
        const result = await CustomHttp.request(config.host + "/operations?period=all")

        if (result) {
          if (!result) throw new Error('Error')
          this.arrayEditOptions = result
          this.arrayEditOptions.forEach(item => {
            if(item.id === Number(this.idCategoryOperations)) {
              this.selectType.value = item.type
              this.optionsEdit = document.createElement("option");
              this.optionsEdit.value = item.id;
              this.optionsEdit.text = item.category;
              this.selectCategory.appendChild(this.optionsEdit);
              this.inputAmount.value = item.amount
              this.inputDate.value = item.date
              this.inputComment.value = item.comment
            }
          })
        }
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  async initIncomeCategory() {
    try {
      const result = await CustomHttp.request(config.host + "/categories/income")
      if (result) {
        if (!result) throw new Error('Error')

        this.arraySelectIncome = result
        this.editingChangeSelectType()
        this.editingDateToSelectCategory()
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

        this.editingChangeSelectType()
        this.editingDateToSelectCategory()
      }
    } catch (e) {
      throw new Error(e)
    }

  }


  async initOperationsEdit() {

    if (this.token && this.idCategoryOperations) {
      if (!this.token) location.href = "#/login";

      if (this.idCategoryOperations) {
        try {
          const result = await CustomHttp.request(config.host + "/operations/" + this.idCategoryOperations, "PUT", {
            type: this.selectType.value,
            amount: +this.inputAmount.value,
            date: GetOperationsFilter.chengeToData(this.inputDate.value),
            comment: this.inputComment.value,
            category_id: +this.selectCategory.value
          });

          if (result) {
            if (!result) throw new Error('Error');

            localStorage.removeItem(this.idLocalStorage);

            window.location.href = '/#/income-expenses';
          }
        } catch (e) {
          throw new Error(e);
        }
      }
    }
  }

  editingChangeSelectType() {
    this.selectType.addEventListener('change', () => {
      this.selectCategory.innerHTML = "";
      this.editingDateToSelectCategory()
    })
  }

  editingDateToSelectCategory() {
    this.selectTypeElement = this.selectType.options[this.selectType.selectedIndex];
    this.selectTypeValue = this.selectTypeElement.value;

    if (this.selectTypeValue === 'income') {
      if (this.arraySelectIncome !== null)
        this.arraySelectIncome.forEach(item => {
          this.options = document.createElement("option");
          this.options.value = item.id;
          this.options.text = item.title;
          this.selectCategory.appendChild(this.options);
        });
    } else {
      if (this.arraySelectIncome !== null)
        this.arraySelectExpense.forEach(item => {
          this.options = document.createElement("option");
          this.options.value = item.id;
          this.options.text = item.title;
          this.selectCategory.appendChild(this.options);
        });
    }
  }
}