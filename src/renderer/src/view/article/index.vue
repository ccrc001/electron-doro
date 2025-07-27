<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getPosts } from '@api/login'
import { Search, Edit, View, User, ArrowLeft, RefreshRight } from '@element-plus/icons-vue'

// 定义组件名称，用于keep-alive缓存
defineOptions({
  name: 'ArticleList'
})

const router = useRouter()

// 文章数据接口
interface Post {
  userId: number
  id: number
  title: string
  body: string
}

// 文章列表数据
const postList = ref<Post[]>([])
const loading = ref(false)

// 搜索关键词
const searchKey = ref('')
const selectedUserId = ref<number | null>(null)

// 计算筛选后的文章列表
const filteredPosts = computed(() => {
  let filtered = postList.value

  // 按标题搜索
  if (searchKey.value) {
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(searchKey.value.toLowerCase()) ||
        post.body.toLowerCase().includes(searchKey.value.toLowerCase())
    )
  }

  // 按用户ID筛选
  if (selectedUserId.value) {
    filtered = filtered.filter((post) => post.userId === selectedUserId.value)
  }

  return filtered
})

// 获取所有用户ID列表（用于筛选）
const userIds = computed(() => {
  const ids = [...new Set(postList.value.map((post) => post.userId))]
  return ids.sort((a, b) => a - b)
})

// 查看文章详情
const viewPost = (post: Post) => {
  ElMessage.info(`查看文章: ${post.title}`)
}

// 编辑文章
const editPost = (post: Post) => {
  ElMessage.info(`编辑文章: ${post.title}`)
}

// 清空筛选
const clearFilters = () => {
  searchKey.value = ''
  selectedUserId.value = null
}

// 获取文章列表数据
const fetchPostList = async () => {
  loading.value = true
  try {
    console.log('🔄 开始获取文章列表...')
    const response = await getPosts()
    console.log('✅ 获取文章列表成功:', response)

    // 检查响应数据结构
    if (response) {
      postList.value = response
      ElMessage.success(`文章列表加载成功，共 ${postList.value.length} 篇文章`)
    } else {
      console.warn('⚠️ 响应数据格式异常:', response)
      ElMessage.warning('文章列表数据格式异常')
    }
  } catch (error) {
    console.error('❌ 获取文章列表失败:', error)
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时的操作
onMounted(async () => {
  console.log('文章列表组件已加载')
  fetchPostList()
})

// 返回
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="post-list-container">
    <!-- 头部操作区 -->
    <div class="header-section">
      <div class="header-left">
        <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
        <h2 class="page-title">文章列表</h2>
      </div>
      <div class="header-right">
        <el-tag type="info">共 {{ postList.length }} 篇文章</el-tag>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <el-input
          v-model="searchKey"
          placeholder="搜索文章标题或内容..."
          clearable
          :prefix-icon="Search"
          class="search-input"
        />
        <el-select v-model="selectedUserId" placeholder="选择用户" clearable class="user-select">
          <el-option
            v-for="userId in userIds"
            :key="userId"
            :label="`用户 ${userId}`"
            :value="userId"
          />
        </el-select>
        <el-button @click="clearFilters" :icon="RefreshRight">清空筛选</el-button>
      </div>
    </div>

    <!-- 文章列表 -->
    <div v-loading="loading" element-loading-text="正在加载文章列表..." class="post-list">
      <div v-if="!loading && postList.length === 0" class="empty-state">
        <el-empty description="暂无文章数据" />
      </div>
      <el-card v-for="post in filteredPosts" :key="post.id" class="post-card" shadow="hover">
        <div class="post-header">
          <div class="post-meta">
            <el-tag type="primary" size="small">ID: {{ post.id }}</el-tag>
            <el-tag type="success" size="small" :icon="User">用户 {{ post.userId }}</el-tag>
          </div>
          <div class="post-actions">
            <el-button type="primary" size="small" :icon="View" @click="viewPost(post)">
              查看
            </el-button>
            <el-button type="warning" size="small" :icon="Edit" @click="editPost(post)">
              编辑
            </el-button>
          </div>
        </div>

        <div class="post-content">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-body">{{ post.body }}</p>
        </div>
      </el-card>

      <!-- 底部间距 -->
      <div class="bottom-spacer"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.post-list-container {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

// 头部区域
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .page-title {
      margin: 0;
      color: #303133;
      font-size: 24px;
      font-weight: 600;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

// 筛选区域
.filter-section {
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .filter-row {
    display: flex;
    gap: 16px;
    align-items: center;

    .search-input {
      flex: 1;
      max-width: 400px;
    }

    .user-select {
      width: 150px;
    }
  }
}

// 文章列表
.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.post-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

// 文章头部
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;

  .post-meta {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .post-actions {
    display: flex;
    gap: 8px;
  }
}

// 文章内容
.post-content {
  .post-title {
    margin: 0 0 12px 0;
    color: #303133;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .post-body {
    margin: 0;
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// 空状态
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

// 底部间距
.bottom-spacer {
  height: 80px;
  width: 100%;
}

// 响应式设计
@media (max-width: 768px) {
  .post-list-container {
    padding: 16px;
  }

  .header-section {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .filter-section .filter-row {
    flex-direction: column;
    align-items: stretch;

    .search-input {
      max-width: none;
    }
  }

  .post-list {
    grid-template-columns: 1fr;
  }

  .post-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
