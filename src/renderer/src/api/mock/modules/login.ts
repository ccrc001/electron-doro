// 用户登录账号
const createUserList = () => {
  return [
    {
      username: 'admin',
      password: '123456',
      token: 'AdminToken',
      info: {
        userId: 1,
        avatar: 'https://pic1.zhimg.com/80/v2-083faf550543c1e9f134b56b3322ee3c_720w.webp',
        desc: '下船不谈船里事',
        roles: ['*:*:*'],
        buttons: ['cuser.detail']
      },
      routes: [
        {
          path: '/douyin',
          name: 'Douyin',
          component: 'douyin',
          meta: {
            title: 'douyin',
            icon: 'VideoPlay',
            label: 'router.douyin'
          }
        }
      ]
    },
    {
      username: 'user',
      password: '123456',
      token: 'UserToken',
      info: {
        userId: 2,
        avatar: 'https://pic1.zhimg.com/80/v2-e1427f6a21122ac163ff98d24f55d372_720w.webp',
        desc: '旧人不谈近况，新人不讲过往',
        roles: ['*user:*:*'],
        buttons: ['cuser.detail', 'cuser.user']
      },
      routes: []
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
            msg: '账号或者密码不正确'
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
      const token = request.headers.authorization
      // 查看用户信息数据中是否包含有此 token 的用户
      const checkUser = createUserList().find((item) => item.token === token)
      // 没有就返回失败信息
      if (!checkUser) {
        return {
          code: 201,
          data: {
            msg: '获取用户信息失败'
          }
        }
      }
      // 有就返回成功信息
      return {
        code: 200,
        data: {
          msg: '成功',
          data: checkUser.info
        }
      }
    }
  },
  // 获取用户菜单接口
  {
    url: '/api/menu/list',
    method: 'get',
    response: (req: any) => {
      const { rolePerm } = req.query // 从 query 中获取 GET 参数
      // 查看用户信息数据中是否包含有此 token 的用户
      const checkUser = createUserList().find((item) => item.info.roles[0] === rolePerm)
      // 没有就返回失败信息
      if (!checkUser) {
        return {
          code: 201,
          data: {
            msg: '获取用户信息失败'
          }
        }
      }
      // 有就返回成功信息
      return {
        code: 200,
        data: {
          msg: '成功',
          data: checkUser.routes
        }
      }
    }
  }
]
