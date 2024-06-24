import {Popup} from "./popup";
import {Chart} from "chart.js/auto";
import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {GetOperationsFilter} from "../utils/getOperationsFilter";
import {HomeChart} from "../types/home-chart.type";
import {DefaultResponseType} from "../types/default-response.type";
import {FilterOperationType} from "../types/home-filter-operation.type";
import {UserInfoType} from "../types/user-info.type";

export class Home extends Popup {
  readonly headerTabHome: Element | null
  readonly tabHome: NodeListOf<Element> | null
  private inputDataFromHome: HTMLInputElement | null
  private inputDataToHome: HTMLInputElement | null
  public pieCanvasIncome: HTMLElement | null
  public pieCanvasExpense: HTMLElement | null
  public inputDateType: NodeListOf<Element>
  readonly token: string | null
  readonly userInfo: UserInfoType | null = Auth.getUserInfo()
  private arrayFilter: FilterOperationType[] = []
  readonly oilDataIncome: HomeChart
  readonly oilDataExpense: HomeChart


  constructor() {
    super();
    this.headerTabHome = document.querySelector('.tabs-header')
    this.tabHome = document.querySelectorAll('.tabs-header-item')
    this.inputDataFromHome = document.getElementById('dataFromHome') as HTMLInputElement
    this.inputDataToHome = document.getElementById('dataToHome') as HTMLInputElement
    this.pieCanvasIncome = document.getElementById("pieChartIncome")
    this.pieCanvasExpense = document.getElementById("pieChartExpense")
    this.inputDateType = document.querySelectorAll(".input-interval")

    this.token = localStorage.getItem(Auth.accessToken)
    this.userInfo = Auth.getUserInfo()
    this.oilDataIncome = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            "#dc3545",
            "#20c997",
            "#0d6efd",
            "#ffc107",
            "#fd7e14",
          ]
        }]
    }

    this.oilDataExpense = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            "#dc3545",
            "#20c997",
            "#0d6efd",
            "#ffc107",
            "#fd7e14",
          ]
        }]
    }

    if (this.inputDateType) {
      this.inputDateType.forEach((item: Element): void => {
        item.addEventListener("focusin", function (): void {
          const inputItem: HTMLInputElement = item as HTMLInputElement
          inputItem.type = 'date';
        })
      });

      this.inputDateType.forEach((item: Element): void => {
        item.addEventListener("focusout", function (): void {
          const inputItem: HTMLInputElement = item as HTMLInputElement
          inputItem.type = 'date';
        })
      });
    }


    this.initTabHome()
    this.initDate()
  }

  private initTabHome(): void {
    if (this.headerTabHome) {

      this.headerTabHome.addEventListener('click', (e: Event): void => {
        const target: HTMLElement = (e.target as HTMLElement).closest('.tabs-header-item') as HTMLElement;
        if (!target) return;

        if (this.tabHome) {
          const indexTabButton: number = Array.from(this.tabHome).indexOf(target);
          if (indexTabButton === -1) return;

          this.tabHome.forEach((item: Element, index: number): void => {
            item.classList.remove('active');

            if (index === indexTabButton) {
              item.classList.add('active');
              this.initDate()
            }
          });
        }
      });
    }
  }

  private getValueTabHome(): string | undefined{
    if (this.tabHome) {
      let valueTab
      this.tabHome.forEach((item: Element): void => {
        if (item.classList.contains('active')) valueTab = (item as HTMLElement).innerText
      })

      return valueTab
    }
  }

  private async initDate(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.token && !userInfo) location.href = '#/login'
    if (this.token && userInfo) {
      try {
        setTimeout(async (): Promise<void> => {
          const result: FilterOperationType[] | DefaultResponseType = await CustomHttp.request(GetOperationsFilter.urlOperationsFilter(this.getValueTabHome(), this.inputDataFromHome?.value, this.inputDataToHome?.value))
          if (result) {
            if ((result as DefaultResponseType).error !== undefined)
              throw new Error((result as DefaultResponseType).message)

            this.arrayFilter = result as FilterOperationType[]

            this.chartJs()
          }


        }, 100);
      } catch (error) {
        return
      }
    }
  }

  private chartJs(): void {
    if (!this.arrayFilter) return

    let incomeArr: FilterOperationType[] = this.arrayFilter.filter((item: FilterOperationType): boolean => item.type === 'income');
    let expenseArr: FilterOperationType[] = this.arrayFilter.filter((item: FilterOperationType): boolean => item.type === 'expense')

    this.oilDataIncome.labels = [];
    this.oilDataIncome.datasets[0].data = [];
    this.oilDataExpense.labels = [];
    this.oilDataExpense.datasets[0].data = [];

    incomeArr.forEach((item: FilterOperationType): void => {
      this.oilDataIncome.labels.push(item.category)
      this.oilDataIncome.datasets[0].data.push(item.amount)
    })

    expenseArr.forEach((item: FilterOperationType): void => {
      this.oilDataExpense.labels.push(item.category)
      this.oilDataExpense.datasets[0].data.push(item.amount)
    })

    if ((this.pieCanvasIncome as any).chart) {
      (this.pieCanvasIncome as any).chart.destroy();
    }

    (this.pieCanvasIncome as any).chart = new Chart((this.pieCanvasIncome as any), {
      type: 'pie',
      data: this.oilDataIncome,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      },
    });

    if ((this.pieCanvasExpense as any).chart) {
      (this.pieCanvasExpense as any).chart.destroy();
    }

    (this.pieCanvasExpense as any).chart = new Chart((this.pieCanvasExpense as any), {
      type: 'pie',
      data: this.oilDataExpense,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      },
    });
  }
}