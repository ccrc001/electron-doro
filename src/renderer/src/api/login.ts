// @ts-ignore: 使用了外部引入的store模块，可能存在类型定义问题
import request from '@utils/request'
import type { AxiosResponse } from 'axios'
import type { LoginParams, UserInfo, UserList } from '@api/model/baseModel'

// mock
// 登录
export function getUserLogin(data): Promise<AxiosResponse> {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo(): Promise<AxiosResponse> {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

//获取用户菜单
export function getMenu(rolePerm): Promise<AxiosResponse> {
  return request({
    url: '/menu/list',
    method: 'get',
    params: { rolePerm }
  })
}

export function getUserList(): Promise<AxiosResponse> {
  return request({
    url: '/user/userlist',
    method: 'get'
  })
}

export function getPosts(): Promise<AxiosResponse> {
  return request({
    url: '/posts',
    method: 'get'
  })
}

// mock

// 图形验证码
// export function captchaImage(params: string): Promise<AxiosResponse<ArrayBuffer>> {
//   return request({
//     url: '/captcha/image',
//     responseType: 'arraybuffer',
//     params
//   })
// }

// // 登陆动态验证码
// export function loginCaptcha(params): Promise<AxiosResponse> {
//   return request({
//     url: '/captcha/sendRegisterOrLoginCaptcha',
//     method: 'get',
//     params
//   })
// }

// // 手机验证码登陆
// export function loginByMobile(data): Promise<AxiosResponse> {
//   return request({
//     url: '/u/loginByMobile',
//     method: 'post',
//     data
//   })
// }
// // 获取用户信息
// export function getInfo(): Promise<AxiosResponse> {
//   return request({
//     url: '/personal/getInfo',
//     method: 'get'
//   })
// }

// // 获取路由
// export function getMenu(rolePerm): Promise<AxiosResponse> {
//   return request({
//     url: '/menu/list',
//     method: 'get',
//     params: { rolePerm }
//   })
// }
