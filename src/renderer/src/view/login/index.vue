<script setup lang="ts">
import { ref, onMounted, defineOptions } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@stores/useUserStore'
import { getUserInfo, loginByJson, getUserLogin } from '@api/login'
import { getParamFromUrl } from '@utils/electronUtils'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
// 定义组件名称，用于keep-alive缓存
defineOptions({
  name: 'Login'
})

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 状态管理
const loading = ref(false)
const loginFormRef = ref()
const showPassword = ref(false)

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    loading.value = true

    // 模拟登录延迟
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    // const res = await loginByJson(loginForm.value)
    const res = await getUserLogin(loginForm.value)
    if (res.code === 200 && res.data) {
      // await userStore.setToken(res.data.token)
      // 获取用户信息
      // await userStore.getUserInfo()

      ElMessage.success('登录成功！')
      router.push('/')
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

// 快速登录
const quickLogin = (type: 'admin' | 'user') => {
  if (type === 'admin') {
    loginForm.value.username = 'admin'
    loginForm.value.password = '123456'
  } else {
    loginForm.value.username = 'user'
    loginForm.value.password = '123456'
  }
}

// 重置表单
const resetForm = () => {
  if (loginFormRef.value) {
    loginFormRef.value.resetFields()
  }
}

onMounted(() => {
  const paramData = getParamFromUrl()
  if (paramData) {
    ElMessage.success(paramData.message)
  }
})
</script>

<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 主要内容区域 -->
    <div class="login-content">
      <!-- 左侧信息面板 -->
      <div class="info-panel">
        <div class="logo-section">
          <div class="logo">
            <el-icon size="48" color="#409eff">
              <i-ep-user />
            </el-icon>
          </div>
          <h1 class="app-title">{{ $t('login.name') }}</h1>
          <p class="app-slogan">{{ $t('login.slogan') }}</p>
        </div>

        <div class="features">
          <div class="feature-item">
            <el-icon size="20" color="#67c23a">
              <i-ep-check />
            </el-icon>
            <span>现代化界面设计</span>
          </div>
          <div class="feature-item">
            <el-icon size="20" color="#67c23a">
              <i-ep-check />
            </el-icon>
            <span>安全可靠的认证</span>
          </div>
          <div class="feature-item">
            <el-icon size="20" color="#67c23a">
              <i-ep-check />
            </el-icon>
            <span>响应式布局设计</span>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="form-panel">
        <div class="form-container">
          <div class="form-header">
            <h2>{{ $t('login.signInTitle') }}</h2>
            <p>欢迎回来，请登录您的账户</p>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            size="large"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                :placeholder="$t('login.userPlaceholder')"
                :prefix-icon="User"
                clearable
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('login.PWPlaceholder')"
                :prefix-icon="Lock"
                clearable
              >
                <template #suffix>
                  <el-icon class="password-toggle" @click="showPassword = !showPassword">
                    <i-ep-view v-if="!showPassword" />
                    <i-ep-hide v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <div class="form-options">
                <el-checkbox v-model="loginForm.rememberMe">
                  {{ $t('login.rememberMe') }}
                </el-checkbox>
                <el-link type="primary" underline="never">
                  {{ $t('login.forgetPassword') }}
                </el-link>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                class="login-button"
                :loading="loading"
                @click="handleLogin"
              >
                {{ loading ? '登录中...' : $t('login.signIn') }}
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 快速登录 -->
          <div class="quick-login">
            <div class="divider">
              <span>快速登录</span>
            </div>
            <div class="quick-buttons">
              <el-button type="info" plain size="small" @click="quickLogin('admin')">
                管理员登录
              </el-button>
              <el-button type="success" plain size="small" @click="quickLogin('user')">
                普通用户登录
              </el-button>
            </div>
          </div>

          <!-- 其他操作 -->
          <div class="form-footer">
            <el-link type="info" underline="never" @click="resetForm"> 重置表单 </el-link>
            <span class="separator">|</span>
            <el-link type="primary" underline="never">
              {{ $t('login.createAccount') }}
            </el-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer">
      <p>{{ $t('login.bottomTitle') }}</p>
      <p class="copyright">© 2024 Powered by Electron + Vue3 + Element Plus</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

// 背景装饰
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 6s ease-in-out infinite;

    &.circle-1 {
      width: 200px;
      height: 200px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    &.circle-2 {
      width: 150px;
      height: 150px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    &.circle-3 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}

// 主要内容区域
.login-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  z-index: 2;
}

// 左侧信息面板
.info-panel {
  flex: 1;
  max-width: 500px;
  padding: 40px;
  color: white;

  .logo-section {
    text-align: center;
    margin-bottom: 60px;

    .logo {
      margin-bottom: 20px;

      .el-icon {
        background: rgba(255, 255, 255, 0.2);
        padding: 20px;
        border-radius: 50%;
        backdrop-filter: blur(10px);
      }
    }

    .app-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 20px 0 10px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .app-slogan {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }
  }

  .features {
    .feature-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      font-size: 1rem;

      .el-icon {
        margin-right: 12px;
        background: rgba(255, 255, 255, 0.2);
        padding: 8px;
        border-radius: 50%;
      }
    }
  }
}

// 右侧表单面板
.form-panel {
  flex: 1;
  max-width: 450px;
  padding: 40px;
}

.form-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-header {
  text-align: center;
  margin-bottom: 30px;

  h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 10px;
  }

  p {
    color: #718096;
    margin: 0;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 20px;

    :deep(.el-input) {
      .el-input__wrapper {
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
        transition: all 0.3s ease;

        &:hover {
          border-color: #409eff;
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
        }

        &.is-focus {
          border-color: #409eff;
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
        }
      }

      .el-input__inner {
        height: 48px;
        font-size: 14px;
      }
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.login-button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.password-toggle {
  cursor: pointer;
  color: #a0aec0;
  transition: color 0.3s ease;

  &:hover {
    color: #409eff;
  }
}

// 快速登录
.quick-login {
  margin: 30px 0;

  .divider {
    text-align: center;
    position: relative;
    margin-bottom: 20px;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e2e8f0;
    }

    span {
      background: rgba(255, 255, 255, 0.95);
      padding: 0 15px;
      color: #718096;
      font-size: 14px;
      position: relative;
      z-index: 1;
    }
  }

  .quick-buttons {
    display: flex;
    gap: 10px;

    .el-button {
      flex: 1;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
      }
    }
  }
}

// 表单底部
.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #718096;

  .separator {
    margin: 0 10px;
    color: #e2e8f0;
  }
}

// 底部信息
.footer {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 2;

  p {
    margin: 5px 0;
  }

  .copyright {
    font-size: 12px;
    opacity: 0.7;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    padding: 20px;
  }

  .info-panel {
    max-width: 100%;
    padding: 20px;
    text-align: center;

    .logo-section {
      margin-bottom: 30px;

      .app-title {
        font-size: 2rem;
      }
    }

    .features {
      display: none;
    }
  }

  .form-panel {
    max-width: 100%;
    padding: 20px;
  }

  .form-container {
    padding: 30px 20px;
  }
}

@media (max-width: 480px) {
  .background-decoration .circle {
    display: none;
  }

  .form-container {
    border-radius: 15px;
    padding: 25px 15px;
  }

  .quick-buttons {
    flex-direction: column;
  }
}
</style>
