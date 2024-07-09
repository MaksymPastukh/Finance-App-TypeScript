import {Popup} from "./popup";
import {Chart} from "chart.js/auto";
import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {GetOperationsFilter} from "../utils/getOperationsFilter";
import {HomeChart} from "../types/home-chart.type";
import {DefaultResponseType} from "../types/default-response.type";
import {UserInfoType} from "../types/user-info.type";
import {OperationsArrayType} from "../types/operations-array.type";

export class Home extends Popup {
  readonly headerTabHome: Element | null
  readonly tabHome: NodeListOf<Element> | null
  private inputDataFromHome: HTMLInputElement | null
  private inputDataToHome: HTMLInputElement | null
  public pieCanvasIncome: HTMLElement | null
  public pieCanvasExpense: HTMLElement | null
  public inputDateType: NodeListOf<Element>
  readonly userToken: string | null
  private arrayFilter: OperationsArrayType[] = []
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

    this.userToken = localStorage.getItem(Auth.accessToken)
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
          (item as HTMLInputElement).type = 'date';
        })
      });

      this.inputDateType.forEach((item: Element): void => {
        item.addEventListener("focusout", function (): void {
          (item as HTMLInputElement).type = 'date';
        })
      });
    }


    this.initTabHome()
    this.initDate()
  }

  private initTabHome(): void {
      this.headerTabHome?.addEventListener('click', (e: Event): void => {
        const target: Element | null = (e.target as HTMLElement).closest('.tabs-header-item');
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

  private getValueTabHome(): string | undefined {
    let valueTab
    this.tabHome?.forEach((item: Element): void => {
      if (item.classList.contains('active')) valueTab = (item as HTMLElement).innerText
    })

    return valueTab
  }

  private async initDate(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) {
      location.href = '#/login'
      return
    }
    if (this.userToken && userInfo) {
      try {
        setTimeout(async (): Promise<void> => {
          const result: OperationsArrayType[] | DefaultResponseType = await CustomHttp.request(GetOperationsFilter.urlOperationsFilter(this.getValueTabHome(), this.inputDataFromHome?.value, this.inputDataToHome?.value))
          if (result) {
            if ((result as DefaultResponseType).error !== undefined)
              throw new Error((result as DefaultResponseType).message)

            this.arrayFilter = result as OperationsArrayType[]
            this.chartJs()
          }
        }, 100);
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }

  private chartJs(): void {
    if (!this.arrayFilter) return

    let incomeArr: OperationsArrayType[] | null = this.arrayFilter.filter((item: OperationsArrayType): boolean => item.type === 'income');
    let expenseArr: OperationsArrayType[]  | null = this.arrayFilter.filter((item: OperationsArrayType): boolean => item.type === 'expense')

    this.oilDataIncome.labels = [];
    this.oilDataIncome.datasets[0].data = [];
    this.oilDataExpense.labels = [];
    this.oilDataExpense.datasets[0].data = [];

    incomeArr.forEach((item: OperationsArrayType): void => {
      this.oilDataIncome.labels.push(item.category)
      this.oilDataIncome.datasets[0].data.push(item.amount)
    })

    expenseArr.forEach((item: OperationsArrayType): void => {
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