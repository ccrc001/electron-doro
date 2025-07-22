// export interface BasicPageParams {
//   page: number;
//   pageSize: number;
// }

// export interface BasicFetchResult<T> {
//   items: T[];
//   total: number;
// }

export interface LoginParams {
  username: string
  password: string
}
export interface UserInfo {
  username: string
  password: string
  token: string
}

export interface UserList {
  id: string
  age: number
  isActive: boolean
  lastLogin: string
  email: string
  region: string
}
