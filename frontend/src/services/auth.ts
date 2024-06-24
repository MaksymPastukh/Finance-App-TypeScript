import config from "../config/config";
import {RefreshResponseType} from "../types/refresh-response.type";
import {LogoutResponseType} from "../types/logout-response.type";
import {UserInfoType} from "../types/user-info.type";

export class Auth {
  public static accessToken: string = 'accessTokenKey'
  public static refreshToken: string = 'refreshTokenKey'
  private static userInfo: string = 'userInfoKey'

  static async unauthorizedProcessResponse(): Promise<boolean> {
    const refreshToken: string | null = localStorage.getItem(this.refreshToken)

    if (refreshToken) {
      const response: Response = await fetch(config.host + '/refresh', {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({refreshToken: refreshToken})
      })
      if (response && response.status === 200) {
        const result: RefreshResponseType = await response.json()

        if (result && !result.error && result.tokens.accessToken && result.tokens.refreshToken) {
          this.setTokens(result.tokens.accessToken, result.tokens.refreshToken)
          return true
        }
      }
    }

    this.removeTokens()
    location.href = '#/login'
    return false
  }

  static async logout(): Promise<boolean> {
    const refreshToken: string | null = localStorage.getItem(this.refreshToken)
    if (refreshToken) {
      const response: Response = await fetch(config.host + "/logout", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({refreshToken: refreshToken})
      })

      if (response && response.status === 200) {
        const result: LogoutResponseType = await response.json()
        if (result && !result.error) {
          Auth.removeTokens()
          return true
        }
      }
    }
    return false
  }

  // Метод записи токенов
  public static setTokens(access: string, refresh: string): void {
    localStorage.setItem(this.accessToken, access)
    localStorage.setItem(this.refreshToken, refresh)
  }

  // Метод удаления токенов
  private static removeTokens(): void {
    localStorage.removeItem(this.accessToken)
    localStorage.removeItem(this.refreshToken)
    localStorage.removeItem(this.userInfo)
    localStorage.removeItem('idIncomeAndExpense');

  }

  // Метод записи информации о пользователе
  static setUserInfo(userInfo: UserInfoType) : void {
    localStorage.setItem(this.userInfo, JSON.stringify(userInfo))
  }

  // Метод получения информации о пользователе
  static getUserInfo() : UserInfoType | null {
    let userInfo: string | null = localStorage.getItem(this.userInfo)

    if (userInfo) {
      return JSON.parse(userInfo)
    }
    return null
  }
}