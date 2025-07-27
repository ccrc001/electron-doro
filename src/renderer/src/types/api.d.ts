declare module '@api/login' {
  declare module '@api/model/baseModel' {
    interface LoginParams {
      username: string
      password: string
    }
    interface UserInfo {
      username: string
      password: string
    }
    interface UserList {
      id: string
      age: number
      isActive: boolean
      lastLogin: string
      email: string
      region: string
    }
  }
  interface LoginParams {
    username: string
    password: string
  }
  interface UserInfo {
    username: string
    password: string
  }
  export function getUserInfo(): Promise<AxiosResponse<UserInfo>>
  export function getMenu(rolePerm: string): Promise<AxiosResponse>
  export function getInfo(): Promise<AxiosResponse>
  export function loginByJson(data: LoginParams): Promise<AxiosResponse<UserInfo>>
  export function captchaImage(params: string): Promise<AxiosResponse<ArrayBuffer>>
  export function loginCaptcha(params): Promise<AxiosResponse>
  export function loginByMobile(data): Promise<AxiosResponse>
  export function getUserList(): Promise<AxiosResponse>
  export function getUserLogin(data): Promise<AxiosResponse>
  export function getPosts(): Promise<AxiosResponse>
}
