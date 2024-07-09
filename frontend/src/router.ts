import {SignupLogin} from "./components/signup-login";
import {Home} from "./components/home";
import {SideBar} from "./components/side-bar";
import {Income} from "./components/income";
import {Expense} from "./components/expense";
import {Operations} from "./components/operations";
import {OperationsCreate} from "./components/operations-create";
import {OperationsEditing} from "./components/operations-editing";
import {Logout} from "./components/logout";
import {RouterType} from "./types/router.type";

export class Router {
  readonly contentElement: HTMLElement | null
  readonly contentTitle: HTMLElement | null
  readonly styles: string
  private routes: RouterType[]

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
      load: (): void => {
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
      load: (): void => {
        new SignupLogin('login')
      }
    }, {
      route: '#/signup',
      title: 'Signup',
      template: 'templates/signup.html',
      styles: this.styles,
      layout: false,
      load: (): void => {
        new SignupLogin('signup')
      }
    }, {
      route: '#/income-expenses',
      title: 'Income-Expenses',
      template: 'templates/operations.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: (): void => {
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
      load: (): void => {
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
      load: (): void => {
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
      load: (): void => {
        new SideBar()
        new Expense()
      }
    }, {
      route: '#/expense-create',
      title: 'Expense create',
      template: 'templates/expense-create-category.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: (): void => {
        new SideBar()
        new Logout()
        new Expense()
      }
    }, {
      route: '#/expense-edit',
      title: 'Expense edit',
      template: 'templates/expense-editing-category.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: (): void => {
        new SideBar()
        new Logout()
        new Expense()
      }
    }, {
      route: '#/income-category',
      title: 'Income category',
      template: 'templates/income-category.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: (): void => {
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
      load: (): void => {
        new SideBar()
        new Logout()
        new Income()
      }
    }, {
      route: '#/income-edit',
      title: 'Income edit',
      template: 'templates/income-editing-category.html',
      layout: 'templates/layout.html',
      styles: this.styles,
      load: (): void => {
        new SideBar()
        new Logout()
        new Income()
      }
    },
    ]
  }

  public async startRouter(): Promise<void> {
    const urlRoute: string = window.location.hash.split("?")[0]
    const newRoute: RouterType | undefined =
      this.routes.find((item: RouterType): boolean => item.route === urlRoute)

    if (!newRoute) {
      window.location.href = "#/"
      return
    }

    if (!this.contentTitle || !this.contentElement) {
      if (urlRoute === '#/') {
        return
      } else {
        window.location.href = "#/"
        return
      }
    }

    if (newRoute) {
      this.contentTitle.innerText = newRoute.title

      if (newRoute.template) {
        let contentBlock: HTMLElement | null = this.contentElement
        if (newRoute.layout) {
          this.contentElement.innerHTML = await fetch(newRoute.layout)
            .then((response: Response) => response.text())
          contentBlock = document.getElementById('content-layout')
        }
        if (contentBlock)
          contentBlock.innerHTML = await fetch(newRoute.template).then((response: Response) => response.text())
      }

      if (newRoute.load && typeof newRoute.load === 'function') {
        newRoute.load()
      }
    }
  }
}
