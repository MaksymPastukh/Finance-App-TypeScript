import {Operations} from "./operations";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {GetOperationsFilter} from "../utils/getOperationsFilter";
import {OperationsCategoryType} from "../types/operations-category.type";
import {OperationsArrayType} from "../types/operations-array.type";
import {UserInfoType} from "../types/user-info.type";
import {Auth} from "../services/auth";
import {DefaultResponseType} from "../types/default-response.type";

export class OperationsEditing extends Operations {
  readonly selectType: HTMLSelectElement | null
  readonly inputAmount: HTMLInputElement | null
  readonly inputDate: HTMLInputElement | null
  readonly inputComment: HTMLInputElement | null
  readonly selectCategory: HTMLElement | null
  readonly buttonSaveEditing: HTMLElement | null
  readonly buttonCancelEditing: HTMLElement | null
  private arrayEditOptions: OperationsArrayType[] = []
  private arraySelectIncome: OperationsCategoryType[] = []
  private arraySelectExpense: OperationsCategoryType[] = []
  readonly idCategoryOperations: string | null

  constructor() {
    super(false);
    this.selectType = document.getElementById('operations-edit-type') as HTMLSelectElement
    this.inputAmount = document.getElementById('operations-edit-amount') as HTMLInputElement
    this.inputDate = document.getElementById('operations-edit-date') as HTMLInputElement
    this.inputComment = document.getElementById('operations-edit-comments') as HTMLInputElement
    this.selectCategory = document.getElementById('operations-edit-category')
    this.buttonSaveEditing = document.getElementById('save-operations-button')
    this.buttonCancelEditing = document.getElementById('cancel-operations-button')
    this.idCategoryOperations = localStorage.getItem(this.idLocalStorage)

    this.buttonSaveEditing?.addEventListener('click', this.initOperationsEdit.bind(this));
    this.buttonCancelEditing?.addEventListener('click', (): void => {
      window.location.href = '/#/income-expenses';
    })

    this.initEditOptions()
    this.initIncomeCategory()
    this.initExpenseCategory()
  }

  private async initEditOptions(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) {
      location.href = '#/login'
      return
    }
    if (this.userToken && userInfo) {
      try {
        const result: OperationsArrayType[] | DefaultResponseType = await CustomHttp.request(config.host + "/operations?period=all")
        if (result) {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message)
          }

          this.arrayEditOptions = result as OperationsArrayType[]
          this.arrayEditOptions.forEach((item: OperationsArrayType): void => {
            if (item.id === Number(this.idCategoryOperations)) {
              if (this.selectType) {
                this.selectType.value = item.type
              }
              const optionsEdit: HTMLOptionElement = document.createElement("option");
              optionsEdit.value = item.id.toString();
              optionsEdit.text = item.category;
              this.selectCategory?.appendChild(optionsEdit);
              if (this.inputAmount) this.inputAmount.value = item.amount.toString()
              if (this.inputDate) this.inputDate.value = item.date
              if (this.inputComment) this.inputComment.value = item.comment
            }
          })
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }

  private async initIncomeCategory(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) {
      location.href = '#/login'
      return
    }
    if (this.userToken && userInfo) {
      try {
        const result: OperationsCategoryType[] | DefaultResponseType = await CustomHttp.request(config.host + "/categories/income")
        if (result) {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message)
          }

          this.arraySelectIncome = result as OperationsCategoryType[]

          this.editingChangeSelectType()
        }
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }

  private async initExpenseCategory(): Promise<void> {
    try {
      const result: OperationsCategoryType[] | DefaultResponseType = await CustomHttp.request(config.host + "/categories/expense")
      if (result) {
        if ((result as DefaultResponseType).error !== undefined) {
          throw new Error((result as DefaultResponseType).message)
        }

        this.arraySelectExpense = result as OperationsCategoryType[]

        this.editingChangeSelectType()

      }
    } catch (e) {
      throw new Error((e as DefaultResponseType).message);
    }
  }

  async initOperationsEdit(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) location.href = '#/login'
    if (this.userToken && userInfo) {
      if (this.idCategoryOperations) {
        try {
          const result: DefaultResponseType = await CustomHttp.request(config.host + "/operations/" + this.idCategoryOperations, "PUT", {
            type: this.selectType?.value,
            amount: +(this.inputAmount as HTMLInputElement).value,
            date: GetOperationsFilter.chengeToData((this.inputDate as HTMLInputElement).value),
            comment: this.inputComment?.value,
            category_id: +(this.selectCategory as HTMLSelectElement).value
          });

          if (result) {
            if ((result as DefaultResponseType).error !== undefined) {
              throw new Error((result as DefaultResponseType).message)
            }

            localStorage.removeItem(this.idLocalStorage);

            window.location.href = '/#/income-expenses';
          }
        } catch (e) {
          throw new Error((e as DefaultResponseType).message);
        }
      }
    }
  }

  private editingChangeSelectType(): void {
    this.selectType?.addEventListener('change', (): void => {
      if (this.selectCategory) {
        this.selectCategory.innerHTML = "";
      }
      this.editingDateToSelectCategory()
    })
  }

  private editingDateToSelectCategory(): void {
    this.selectTypeElement = this.selectType?.options[this.selectType.selectedIndex];
    this.selectTypeValue = this.selectTypeElement?.value;

    if (this.selectTypeValue === 'income') {
      this.arraySelectIncome.forEach((item: OperationsCategoryType): void => {
        const options: HTMLOptionElement = document.createElement("option");
        options.value = item.id.toString();
        options.text = item.title;
        this.selectCategory?.appendChild(options);
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