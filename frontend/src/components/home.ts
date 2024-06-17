import {Popup} from "./popup.ts";
import {Chart} from "chart.js/auto";
import {Auth} from "../services/auth.ts";
import {CustomHttp} from "../services/custom-http.ts";
import {GetOperationsFilter} from "../utils/getOperationsFilter.ts";

export class Home extends Popup {
  constructor() {
    super();
    this.headerTabHome = document.querySelector('.tabs-header')
    this.tabHome = document.querySelectorAll('.tabs-header-item')
    this.inputDataFromHome = document.getElementById('dataFromHome')
    this.inputDataToHome = document.getElementById('dataToHome')
    this.pieCanvasIncome = document.getElementById("pieChartIncome");
    this.pieCanvasExpense = document.getElementById("pieChartExpense");
    this.inputDateType = document.querySelectorAll(".input-interval");

    this.token = localStorage.getItem(Auth.accessToken)
    this.userInfo = Auth.getUserInfo()
    this.array = []
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


    this.inputDateType.forEach(e => {
      e.addEventListener("focusin", function (ev) {
        e.type = 'date';
      })
    });
    this.inputDateType.forEach(e => {
      e.addEventListener("focusout", function (ev) {
        e.type = 'text';
      })
    });


    this.initTabHome()
    this.initDate()
  }

  initTabHome() {
    this.headerTabHome.addEventListener('click', (e) => {
      const target = e.target.closest('.tabs-header-item');
      if (!target) return;

      const index = Array.from(this.tabHome).indexOf(target);
      if (index === -1) return;

      this.tabHome.forEach((item, idx) => {
        item.classList.remove('active');

        if (idx === index) {
          item.classList.add('active');
          this.initDate()
        }
      });
    });
  }

  getValueTabHome() {
    let valueTab = null
    this.tabHome.forEach(item => {
      if (item.classList.contains('active')) valueTab = item.innerText
    })

    return valueTab
  }

  async initDate() {
    if (this.token && this.userInfo) {
      if (!this.token && this.userInfo) location.href = '#/login'
      try {
        setTimeout(async () => {
          const result = await CustomHttp.request(GetOperationsFilter.urlOperationsFilter(this.getValueTabHome(), this.inputDataFromHome.value, this.inputDataToHome.value))
          if (result) {
            if (!result) throw new Error('Error')

            this.array = result

            this.chartJs()
          }

        }, 100);
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  chartJs() {
    let incomeArr = this.array.filter(item => item.type === 'income')
    let expenseArr = this.array.filter(item => item.type === 'expense')

    this.oilDataIncome.labels = [];
    this.oilDataIncome.datasets[0].data = [];
    this.oilDataExpense.labels = [];
    this.oilDataExpense.datasets[0].data = [];

    incomeArr.forEach(item => {
      this.oilDataIncome.labels.push(item.category)
      this.oilDataIncome.datasets[0].data.push(item.amount)
    })


    expenseArr.forEach(item => {
      this.oilDataExpense.labels.push(item.category)
      this.oilDataExpense.datasets[0].data.push(item.amount)
    })

    if (this.pieCanvasIncome.chart) {
      this.pieCanvasIncome.chart.destroy();
    }

    this.pieCanvasIncome.chart = new Chart(this.pieCanvasIncome, {
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


    if (this.pieCanvasExpense.chart) {
      this.pieCanvasExpense.chart.destroy();
    }

    this.pieCanvasExpense.chart = new Chart(this.pieCanvasExpense, {
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