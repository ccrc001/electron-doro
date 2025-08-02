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
export default [
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
