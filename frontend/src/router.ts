import {SignupLogin} from "./components/signup-login";
import {Home} from "./components/home";
import {SideBar} from "./components/side-bar";
import {Income} from "./components/income";
import {IncomeEditing} from "./components/income-editing";
import {IncomeCreating} from "./components/income-creating";
import {Expense} from "./components/expense";
import {ExpenseEditing} from "./components/expense-editing";
import {ExpenseCreating} from "./components/expense-creating";
import {Operations} from "./components/operations";
import {OperationsCreate} from "./components/operations-create";
import {OperationsEditing} from "./components/operations-editing";
import {Logout} from "./components/logout";

export class Router {
  constructor() {
    this.contentElement = document.getElementById("content")
    this.contentTitle = document.getElementById('title')
    this.styles = 'styles/output.scss';

    this.routes = [{
      route: '#/',
      title: 'Home',
      template: 'templates/main.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: () => {
        new SideBar()
        new Home()
        new Logout()
      }
    }, {
      route: '#/login',
      title: 'Log in',
      template: 'templates/login.html',
      styles: this.styles,
      layout: false,
      load: () => {
        new SignupLogin('login')
      }
    }, {
      route: '#/signup',
      title: 'Signup',
      template: 'templates/signup.html',
      styles: this.styles,
      layout: false,
      load: () => {
        new SignupLogin('signup')
      }
    }, {
      route: '#/income-expenses',
      title: 'Income-Expenses',
      template: 'templates/operations.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: () => {
        new SideBar()
        new Logout()
        new Operations()

      }
    }, {
      route: '#/income-expenses-create',
      title: 'Income-Expenses-Create',
      template: 'templates/operations-create.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: () => {
        new SideBar()
        new Logout()
        new OperationsCreate()
      }
    }, {
      route: '#/income-expenses-edit',
      title: 'Income-Expenses-Edit',
      template: 'templates/operations-editing.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: () => {
        new SideBar()
        new Logout()
        new OperationsEditing()
      }
    }, {
      route: '#/expense-category',
      title: 'Expense category',
      template: 'templates/expense-category.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: () => {
        new SideBar()
        new Expense()
      }
    }, {
      route: '#/expense-create',
      title: 'Expense create',
      template: 'templates/expense-create-category.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: () => {
        new SideBar()
        new Logout()
        new ExpenseCreating()
      }
    }, {
      route: '#/expense-edit',
      title: 'Expense edit',
      template: 'templates/expense-editing-category.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: () => {
        new SideBar()
        new Logout()
        new ExpenseEditing()
      }
    }, {
      route: '#/income-category',
      title: 'Income category',
      template: 'templates/income-category.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: () => {
        new SideBar()
        new Logout()
        new Income()

      }
    }, {
      route: '#/income-create',
      title: 'Income create',
      template: 'templates/income-create-category.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: () => {
        new SideBar()
        new Logout()
        new IncomeCreating()
      }
    }, {
      route: '#/income-edit',
      title: 'Income edit',
      template: 'templates/income-editing-category.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: () => {
        new SideBar()
        new Logout()
        new IncomeEditing()
      }
    },
    ]
  }

  async startRouter() {
    const urlRoute = window.location.hash.split("?")[0]

    const newRoute =
      this.routes.find(item => item.route === urlRoute)

    if (!newRoute) {
      window.location.href = "#/"
      return
    }

    if (newRoute) {
      this.contentTitle.innerText = newRoute.title

      if (newRoute.template) {
        let contentBlock = this.contentElement
        if (newRoute.layout) {
          this.contentElement.innerHTML = await fetch(newRoute.layout)
            .then(response => response.text())
          contentBlock = document.getElementById('content-layout')
        }

        contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text())
      }

      if (newRoute.load && typeof newRoute.load === 'function') {
        newRoute.load()
      }
    }
  }
}
