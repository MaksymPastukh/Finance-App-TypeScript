import './styles/output.scss';
import {Router} from "./router";

class App {
  private router: Router
  constructor() {
    this.router = new Router()
    window.addEventListener('DOMContentLoaded', this.handelRouter.bind(this))
    window.addEventListener('popstate', this.handelRouter.bind(this))
  }

  private handelRouter(): void {
    this.router.startRouter()
  }
}

(new App())

// Vfrcbv123q1@