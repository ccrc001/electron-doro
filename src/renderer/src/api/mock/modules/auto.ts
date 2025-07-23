// import Mock from 'mockjs'
import { initializeMock } from '../mockUtils'

// 初始化 Mock.js
initializeMock()
// const dataList = Mock.mock({
//   code: 200,
//   msg: '成功',
//   'data|10-20': [
//     {
//       'id|+1': 1,
//       name: '@cname', // 随机中文姓名
//       'age|18-60': 1, // 18-60岁的随机年龄
//       'isActive|1': true, // 随机布尔值，50%概率为true
//       lastLogin: '@datetime', // 随机日期时间
//       email: '@email', // 随机邮箱
//       region: '@region' // 随机地区
//     }
//   ]
// })
const createUserList = () => {
  return [
    {
      userId: 1,
      avatar: 'https://pic1.zhimg.com/80/v2-083faf550543c1e9f134b56b3322ee3c_720w.webp',
      username: 'admin',
      password: '123456',
      desc: '下船不谈船里事',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token'
    },
    {
      userId: 2,
      avatar: 'https://pic1.zhimg.com/80/v2-e1427f6a21122ac163ff98d24f55d372_720w.webp',
      username: 'user',
      password: '123456',
      desc: '旧人不谈近况，新人不讲过往',
      roles: ['系统管理员'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'Admin Token'
    }
  ]
}

export default [
  // 用户登录接口
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }: any) => {
      // 获取请求体携带过来的用户名与密码
      const { username, password } = body
      // 调用获取用户信息函数，用于判断是否有此用户
      const checkUser = createUserList().find(
        (item) => item.username === username && item.password === password
      )
      // 没有用户则返回失败信息
      if (!checkUser) {
        return {
          code: 201,
          data: {
            message: '账号或者密码不正确'
          }
        }
      }
      // 如果有返回成功信息
      const { token } = checkUser
      return {
        code: 200,
        data: {
          token,
          msg: '用户登录成功'
        }
      }
    }
  },
  // 获取用户信息接口
  {
    url: '/api/user/info',
    method: 'get',
    response: (request: any) => {
      // 获取请求头携带的 token
      // const token = request.headers.token
      // // 查看用户信息数据中是否包含有此 token 的用户
      // const checkUser = createUserList().find((item) => item.token === token)
      // // 没有就返回失败信息
      // if (!checkUser) {
      //   return {
      //     code: 201,
      //     data: {
      //       message: '获取用户信息失败'
      //     }
      //   }
      // }
      // 有就返回成功信息
      return {
        code: 200,
        data: {
          msg: '成功'
        }
      }
    }
  },
  // 获取用户信息接口 - 对应 getUserInfo
  {
    url: '/api/user/userinfo',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取用户信息成功',
        data: {
          token: 'mock-token-123456',
          userInfo: {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            avatar: 'https://pic1.zhimg.com/80/v2-083faf550543c1e9f134b56b3322ee3c_720w.webp',
            email: 'admin@example.com',
            roles: ['admin']
          }
        }
      }
    }
  },
  // 获取用户列表接口 - 对应 getUserList
  {
    url: '/api/user/userlist',
    method: 'get',
    response: () => {
      // return dataList
      return {
        code: 200,
        msg: '成功',

        // 'data|10-20': [
        //   {
        //     'id|+1': 1,
        //     name: '@cname', // 随机中文姓名
        //     'age|18-60': 1, // 18-60岁的随机年龄
        //     'isActive|1': true, // 随机布尔值，50%概率为true
        //     lastLogin: '@datetime', // 随机日期时间
        //     email: '@email', // 随机邮箱
        //     region: '@region' // 随机地区
        //   }
        // ]

        'data|12': [
          {
            'id|+1': 1,
            'age|18-26': 0,
            'isActive|1': true,
            'name|0-100': 0
          }
        ]
      }
    }
  }
]
