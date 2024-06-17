import { Auth } from "./auth.ts"

export class CustomHttp {
  static async request(url, method = "GET", body = null) {
    const params = {
      method: method,
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
      }
    }

    let token = localStorage.getItem(Auth.accessToken)

    if (token) {
      params.headers["x-auth-token"] = token
    }

    if (body) {
      params.body = JSON.stringify(body)
    }

    const response = await fetch(url, params)

    if (response.status < 200 || response.status >= 300) {
      if (response.status === 401) {
        let result = await Auth.unauthorizedProcessResponse()

        if (result) {
          return await this.request(url, method, body)
        } else {
          return await response.json()
        }
      }
    }

    return await response.json()
  }
}