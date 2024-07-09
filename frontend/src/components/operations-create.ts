import {Operations} from "./operations";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {GetOperationsFilter} from "../utils/getOperationsFilter";
import {OperationsCategoryType} from "../types/operations-category.type";
import {UserInfoType} from "../types/user-info.type";
import {Auth} from "../services/auth";
import {DefaultResponseType} from "../types/default-response.type";

export class OperationsCreate extends Operations {
  readonly selectType: HTMLSelectElement | null
  readonly inputAmount: HTMLElement | null
  readonly inputDate: HTMLElement | null
  readonly inputComment: HTMLInputElement | null
  readonly selectCategory: HTMLElement | null
  readonly buttonCreateOf: HTMLElement | null
  readonly buttonCancelOf: HTMLElement | null
  private arraySelectIncome: OperationsCategoryType[] = []
  private arraySelectExpense: OperationsCategoryType[] = []

  constructor() {
    super(false);
    this.selectType = document.getElementById('operations-create-type') as HTMLSelectElement
    this.inputAmount = document.getElementById('operations-create-amount')
    this.inputDate = document.getElementById('operations-create-date')
    this.inputComment = document.getElementById('operations-create-comments') as HTMLInputElement
    this.selectCategory = document.getElementById('operations-create-category')
    this.buttonCreateOf = document.getElementById('operations-create-create')
    this.buttonCancelOf = document.getElementById('operations-create-cancel')

    this.inputTypeDate?.forEach((item: Element): void => {
      item.addEventListener("focusin", function (): void {
        (item as HTMLInputElement).type = 'date';
      })
    });

    this.inputTypeDate?.forEach((item: Element): void => {
      item.addEventListener("focusout", function (): void {
        (item as HTMLInputElement).type = 'text';
      })
    });

    this.buttonCreateOf?.addEventListener('click', this.initCreating.bind(this));
    this.buttonCancelOf?.addEventListener('click', (): void => {
      window.location.href = '/#/income-expenses';
    })

    this.initIncomeCategory()
    this.initExpenseCategory()
  }

  private async initIncomeCategory(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) location.href = '#/login'
    if (this.userToken && userInfo) {
      try {
        const result: OperationsCategoryType[] | DefaultResponseType = await CustomHttp.request(config.host + "/categories/income")
        if (result) {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message)
          }

          this.arraySelectIncome = result as OperationsCategoryType[]
          this.createChangeSelectType()
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }

  private async initExpenseCategory(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) location.href = '#/login'
    if (this.userToken && userInfo) {
      try {
        const result: OperationsCategoryType[] | DefaultResponseType = await CustomHttp.request(config.host + "/categories/expense")
        if (result) {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message)
          }

          this.arraySelectExpense = result as OperationsCategoryType[]
          this.createChangeSelectType()
          this.createDateToSelectCategory()
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }

  async initCreating(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) location.href = '#/login'
    if (this.userToken && userInfo) {
      try {
        const result: DefaultResponseType = await CustomHttp.request(config.host + "/operations", "POST", {
          type: this.selectType?.value,
          amount: +(this.inputAmount as HTMLInputElement).value,
          date: GetOperationsFilter.chengeToData((this.inputDate as HTMLInputElement).value),
          comment: this.inputComment?.value,
          category_id: +(this.selectCategory as HTMLInputElement).value
        });

        if (result) {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message)
          }

          window.location.href = '/#/income-expenses';
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }

  private createChangeSelectType(): void {
    this.selectType?.addEventListener('change', (): void => {
      if (this.selectCategory) this.selectCategory.innerHTML = "";
      this.createDateToSelectCategory()
    })
  }

  private createDateToSelectCategory(): void {
    this.selectTypeElement = this.selectType?.options[this.selectType.selectedIndex];
    this.selectTypeValue = this.selectTypeElement?.value;

    if (this.selectTypeValue === 'income') {
      this.arraySelectIncome.forEach((item: OperationsCategoryType): void => {
        const options: HTMLOptionElement = document.createElement("option");
        options.value = item.id.toString();
        options.text = item.title;
        if (this.selectCategory) {
          this.selectCategory.appendChild(options);
        }
      });

    } else if (this.selectTypeValue === 'expense') {
      this.arraySelectExpense.forEach((item: OperationsCategoryType): void => {
        const options: HTMLOptionElement = document.createElement("option");
        options.value = item.id.toString();
        options.text = item.title;
        this.selectCategory?.appendChild(options);
      });
    }
  }
}