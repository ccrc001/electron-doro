<script setup lang="ts">
import { getUserList } from '@renderer/api/login'
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElInputNumber } from 'element-plus'
import { useRouter } from 'vue-router'
// 定义组件名称，用于keep-alive缓存
defineOptions({
  name: 'User'
})

const router = useRouter()

// 模拟的用户数据
interface User {
  id: number
  name: string
  age: number
  active: boolean
}

// 用户列表数据
const userList = ref<User[]>([])
const loading = ref(false)

// 搜索关键词
const searchKey = ref(null)
// 计算筛选后的用户列表（按 age 匹配）
const filteredUsers = computed(() => {
  if (!searchKey.value) {
    return userList.value // 如果没输入搜索值，返回全部用户
  }
  return userList.value.filter((user) => user.name == searchKey.value)
})

// 编辑状态
const editingUser = ref<User | null>(null)

// 开始编辑用户
const startEdit = (user: User) => {
  editingUser.value = { ...user }
}

// 保存编辑
const saveEdit = () => {
  if (editingUser.value) {
    const index = userList.value.findIndex((u) => u.id === editingUser.value!.id)
    if (index !== -1) {
      userList.value[index] = { ...editingUser.value }
    }
    editingUser.value = null
  }
}

// 取消编辑
const cancelEdit = () => {
  editingUser.value = null
}

// 切换用户状态
const toggleUserStatus = (user: User) => {
  user.active = !user.active
}

// 获取用户列表数据
const fetchUserList = async () => {
  loading.value = true
  try {
    console.log('🔄 开始获取用户列表...')
    const response = await getUserList()
    console.log('✅ 获取用户列表成功:', response)

    // 检查响应数据结构
    if (response && response.data) {
      // 处理两种可能的数据结构
      let userData = []
      if (Array.isArray(response.data.data)) {
        userData = response.data.data
      } else if (Array.isArray(response.data)) {
        userData = response.data
      }

      userList.value = userData.map((item: any) => ({
        id: item.id,
        name: item.name || `用户${item.id}`,
        age: item.age,
        active: item.isActive !== undefined ? item.isActive : true
      }))
      console.log('📋 处理后的用户列表:', userList.value)
      ElMessage.success(`用户列表加载成功，共 ${userList.value.length} 条数据`)
    } else {
      console.warn('⚠️ 响应数据格式异常:', response)
      ElMessage.warning('用户列表数据格式异常')
    }
  } catch (error) {
    console.error('❌ 获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时的操作
onMounted(() => {
  console.log('用户列表组件已加载')
  fetchUserList()
})

// 返回
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="user-list-container">
    <!-- 返回 -->
    <el-button @click="goBack">返回</el-button>

    <!-- 搜索框 -->
    <div class="search-box">
      <el-input v-model="searchKey" placeholder="搜索编号和年龄" clearable prefix-icon="Search" />
    </div>

    <!-- 用户列表 -->
    <div v-loading="loading" element-loading-text="正在加载用户列表..." class="user-list">
      <div v-if="!loading && userList.length === 0" class="empty-state">
        <el-empty description="暂无用户数据" />
      </div>
      <el-card v-for="user in filteredUsers" :key="user.id" class="user-card">
        <!-- 非编辑状态 -->
        <template v-if="!editingUser || editingUser.id !== user.id">
          <div class="user-info">
            <h3>{{ user.name }}</h3>
            <p>年龄: {{ user.age }}</p>
            <el-tag :type="user.active ? 'success' : 'info'">
              {{ user.active ? '活跃' : '非活跃' }}
            </el-tag>
          </div>
          <div class="user-actions">
            <el-button type="primary" size="small" @click="startEdit(user)"> 编辑 </el-button>
            <el-button
              :type="user.active ? 'warning' : 'success'"
              size="small"
              @click="toggleUserStatus(user)"
            >
              {{ user.active ? '设为非活跃' : '设为活跃' }}
            </el-button>
          </div>
        </template>

        <!-- 编辑状态 -->
        <template v-else>
          <div class="user-edit">
            <el-input v-model="editingUser.name" placeholder="用户名" />
            <el-input-number v-model="editingUser.age" :min="1" :max="120" />
            <div class="edit-actions">
              <el-button type="primary" size="small" @click="saveEdit"> 保存 </el-button>
              <el-button size="small" @click="cancelEdit"> 取消 </el-button>
            </div>
          </div>
        </template>
      </el-card>
      <div style="height: 80px; width: 100%"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-list-container {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.user-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.user-card {
  transition: all 0.3s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-info {
  margin-bottom: 15px;
}

.user-info h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.user-info p {
  margin: 5px 0;
  color: #666;
}

.user-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.user-edit {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.edit-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>
