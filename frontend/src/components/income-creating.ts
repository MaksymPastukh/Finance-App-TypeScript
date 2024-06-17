import {Income} from "./income";
import {CustomHttp} from "../services/custom-http.ts";
import config from "../config/config.ts";

export class IncomeCreating extends Income {
  constructor() {
    super(false);
    this.incomeCreatingInput = document.getElementById('input-create-income')
    this.buttonCreateCreating = document.getElementById('create-income-button')
    this.buttonCancelCreating = document.getElementById('cancel-income-button')

    this.buttonCreateCreating.addEventListener('click', this.initIncomeCreating.bind(this));
    this.buttonCancelCreating.addEventListener('click', () => {
      window.location.href = '/#/income-category';
    })
  }


  async initIncomeCreating() {
    if (this.token) {
      if (!this.token) location.href = "#/login";
      try {
        const result = await CustomHttp.request(config.host + "/categories/income/", "POST", {
          title: this.incomeCreatingInput.value
        });

        if (result) {
          if (!result) throw new Error('Error');
          window.location.href = '/#/income-category';
        }
      } catch (e) {
        return e;
      }
    }
  }
}