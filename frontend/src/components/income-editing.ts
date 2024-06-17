import {Income} from "./income";
import {CustomHttp} from "../services/custom-http.ts";
import config from "../config/config.ts";

export class IncomeEditing extends Income {
  constructor() {
    super(false);
    this.buttonSaveEditing = document.getElementById('save-income-button')
    this.buttonCancelEditing = document.getElementById('cancel-income-button')
    this.idCategory = localStorage.getItem(this.idCategoryIncome)
    this.categoryTest = []

    this.buttonSaveEditing.addEventListener('click', this.initIncomeEdit.bind(this));
    this.buttonCancelEditing.addEventListener('click', () => {
      window.location.href = '/#/income-category';
    })

    this.initEditIncomeInput()
  }

  async initEditIncomeInput() {
    if (this.token && this.idCategory) {
      if (!this.token) location.href = "#/login"
      try {
        const result = await CustomHttp.request(config.host + "/categories/income")
        if (result) {
          if (!result) throw new Error('Error')

          this.categoryTest = result
          this.categoryTest.forEach(item => {
            if(item.id === Number(this.idCategory)) {
              this.inputSaveEditing.value = item.title
            }
          })
        }
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  async initIncomeEdit() {
    if (this.token && this.idCategory) {
      if (!this.token) location.href = "#/login";
      if (this.idCategory) {
        try {
          const result = await CustomHttp.request(config.host + "/categories/income/" + this.idCategory, "PUT", {
            title: this.inputSaveEditing.value
          });

          if (result) {
            if (!result) throw new Error('Error');

            localStorage.removeItem(this.idCategoryIncome);
            window.location.href = '/#/income-category';
          }
        } catch (e) {
          throw new Error(e);
        }
      }
    }
  }
}