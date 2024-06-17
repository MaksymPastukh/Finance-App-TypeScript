import config from "../config/config";

export class Auth {
  static accessToken = 'accessTokenKey'
  static refreshToken = 'refreshTokenKey'
  static userInfo = 'userInfoKey'

  static async unauthorizedProcessResponse() {
    const refreshToken = localStorage.getItem(this.refreshToken)

    if(refreshToken) {
      const response = await fetch(config.host + '/refresh', {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({refreshToken: refreshToken})
      })
      if(response && response.status === 200) {
        const result = await response.json()

        if(result && !result.error) {
          this.setTokens(result.tokens.accessToken, result.tokens.refreshToken)
          return true
        }
      }
    }

    this.removeTokens()
    location.href = '#/login'
    return false
  }

  static async logout () {
    const refreshToken = localStorage.getItem(this.refreshToken)
    if (refreshToken) {
      const response = await fetch(config.host + "/logout", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ refreshToken: refreshToken })
      })

      if (response && response.status === 200) {
        const result = await response.json()
        if (result && !result.error) {
          Auth.removeTokens()
          return true
        }
      }
    }
  }

  // Метод записи токенов
  static setTokens(access, refresh) {
    localStorage.setItem(this.accessToken, access)
    localStorage.setItem(this.refreshToken, refresh)
  }

  // Метод удаления токенов
  static removeTokens () {
    localStorage.removeItem(this.accessToken)
    localStorage.removeItem(this.refreshToken)
    localStorage.removeItem(this.userInfo)
    localStorage.removeItem('idIncomeAndExpense');

  }

  // Метод записи информации о пользователе
  static setUserInfo(userInfo) {
    localStorage.setItem(this.userInfo, JSON.stringify(userInfo))
  }

  // Метод получения информации о пользователе
  static getUserInfo()  {
    let userInfo = localStorage.getItem(this.userInfo)

    if(userInfo) {
      return JSON.parse(userInfo)
    }
    return  null
  }
}