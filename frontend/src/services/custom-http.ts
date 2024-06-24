import { Auth } from "./auth"

export class CustomHttp {
  static async request(url: string, method: string = "GET", body: any = null): Promise<any> {
    const params : any = {
      method: method,
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
      }
    }

    let token: string | null = localStorage.getItem(Auth.accessToken)

    if (token) {
      params.headers["x-auth-token"] = token
    }

    if (body) {
      params.body = JSON.stringify(body)
    }

    const response: Response = await fetch(url, params)

    if (response.status < 200 || response.status >= 300) {
      if (response.status === 401) {
        let result: boolean = await Auth.unauthorizedProcessResponse()

        if (result) {
          return await this.request(url, method, body)
        } else {
          return await response.json()
        }
      }
      throw new Error(response.statusText)
    }

    return await response.json()
  }
}