<template>
  <div class="daily-food-container">
    <div class="daily-header">
      <h1 class="daily-title">
        <el-icon class="title-icon"><i-ep-food /></el-icon>
        今日美食推荐
      </h1>
      <p class="daily-subtitle">让 Doro 为你推荐今天吃什么喝什么</p>
    </div>

    <div class="daily-content">
      <!-- 今日推荐 -->
      <div class="demo-section">
        <div class="section-header">
          <div class="header-left">
            <el-icon><i-ep-star-filled /></el-icon>
            <h3>今日特别推荐</h3>
          </div>
          <el-button
            type="success"
            size="small"
            :icon="Refresh"
            circle
            title="刷新推荐"
            @click="refreshRecommendations"
          />
        </div>
        <div class="recommendation-cards">
          <div
            class="food-card"
            :class="{ selected: selectedMeal === 'breakfast' }"
            @click="selectMeal('breakfast')"
          >
            <div class="card-icon">🌅</div>
            <h4>早餐</h4>
            <p>{{ currentRecommendations.breakfast }}</p>
            <div class="card-time">07:00 - 09:00</div>
          </div>
          <div
            class="food-card"
            :class="{ selected: selectedMeal === 'lunch' }"
            @click="selectMeal('lunch')"
          >
            <div class="card-icon">☀️</div>
            <h4>午餐</h4>
            <p>{{ currentRecommendations.lunch }}</p>
            <div class="card-time">11:30 - 13:30</div>
          </div>
          <div
            class="food-card"
            :class="{ selected: selectedMeal === 'dinner' }"
            @click="selectMeal('dinner')"
          >
            <div class="card-icon">🌙</div>
            <h4>晚餐</h4>
            <p>{{ currentRecommendations.dinner }}</p>
            <div class="card-time">17:30 - 19:30</div>
          </div>
          <div
            class="food-card"
            :class="{ selected: selectedMeal === 'drink' }"
            @click="selectMeal('drink')"
          >
            <div class="card-icon">🥤</div>
            <h4>饮品</h4>
            <p>{{ currentRecommendations.drink }}</p>
            <div class="card-time">全天</div>
          </div>
        </div>
      </div>

      <!-- 随机推荐器 -->
      <div class="demo-section">
        <div class="section-header">
          <el-icon><i-ep-refresh /></el-icon>
          <h3>随机推荐器</h3>
        </div>
        <div class="random-generator">
          <div class="generator-controls">
            <el-select v-model="selectedCategory" placeholder="选择分类" style="width: 150px">
              <el-option label="全部" value="all" />
              <el-option label="早餐" value="breakfast" />
              <el-option label="午餐" value="lunch" />
              <el-option label="晚餐" value="dinner" />
              <el-option label="饮品" value="drink" />
              <el-option label="零食" value="snack" />
            </el-select>
            <el-button type="primary" size="large" :loading="isGenerating" @click="generateRandom">
              <el-icon><i-ep-magic-stick /></el-icon>
              {{ isGenerating ? '生成中...' : '随机推荐' }}
            </el-button>
          </div>
          <div class="random-result">
            <div v-if="isGenerating" class="loading-placeholder">
              <div class="loading-content">
                <div class="loading-spinner">🎲</div>
                <h3>正在为您推荐...</h3>
                <p>请稍候，美味即将呈现</p>
              </div>
            </div>
            <div v-else-if="randomResult" class="result-card fade-in">
              <div class="result-emoji">{{ randomResult.emoji }}</div>
              <h3>{{ randomResult.name }}</h3>
              <p>{{ randomResult.description }}</p>
              <div class="result-tags">
                <el-tag v-for="tag in randomResult.tags" :key="tag" :type="getTagType(tag)">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div v-else class="result-placeholder">
              <div class="placeholder-content">
                <div class="placeholder-emoji">🎲</div>
                <h3>点击按钮开始随机推荐</h3>
                <p>让我们为你推荐美味的食物</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 美食日历 -->
      <div class="demo-section">
        <div class="section-header">
          <div class="header-left">
            <el-icon><i-ep-calendar /></el-icon>
            <h3>本周美食计划</h3>
          </div>
          <el-button
            type="primary"
            size="small"
            :icon="Refresh"
            circle
            title="刷新本周计划"
            @click="refreshWeekPlan"
          />
        </div>
        <div class="food-calendar">
          <div
            v-for="(day, index) in weekPlan"
            :key="index"
            class="calendar-day"
            :class="{ today: day.isToday }"
          >
            <div class="day-header">
              <span class="day-name">{{ day.name }}</span>
              <span class="day-date">{{ day.date }}</span>
            </div>
            <div class="day-meals">
              <div class="meal-item">
                <span class="meal-icon">🌅</span>
                <span class="meal-text">{{ day.breakfast }}</span>
              </div>
              <div class="meal-item">
                <span class="meal-icon">☀️</span>
                <span class="meal-text">{{ day.lunch }}</span>
              </div>
              <div class="meal-item">
                <span class="meal-icon">🌙</span>
                <span class="meal-text">{{ day.dinner }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 健康建议 -->
      <div class="demo-section">
        <div class="section-header">
          <el-icon><i-ep-first-aid-kit /></el-icon>
          <h3>健康饮食建议</h3>
        </div>
        <div class="health-tips">
          <div v-for="tip in healthTips" :key="tip.id" class="tip-card">
            <div class="tip-icon">{{ tip.icon }}</div>
            <div class="tip-content">
              <h4>{{ tip.title }}</h4>
              <p>{{ tip.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="demo-section">
        <div class="section-header">
          <el-icon><i-ep-setting /></el-icon>
          <h3>个性化设置</h3>
        </div>
        <div class="action-buttons">
          <el-button type="warning" size="large" @click="saveToFavorites">
            <el-icon><i-ep-star /></el-icon>
            保存收藏
          </el-button>
          <el-button type="info" size="large" @click="exportPlan">
            <el-icon><i-ep-download /></el-icon>
            导出计划
          </el-button>
          <el-button type="primary" size="large" @click="openSettings">
            <el-icon><i-ep-setting /></el-icon>
            偏好设置
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

// 定义组件名称
defineOptions({
  name: 'DailyFood'
})

// 响应式数据
const selectedMeal = ref('')
const selectedCategory = ref('all')
const isGenerating = ref(false)
const randomResult = ref(null)

// 当前推荐
const currentRecommendations = reactive({
  breakfast: '燕麦粥 + 水煮蛋 + 牛奶',
  lunch: '宫保鸡丁 + 米饭 + 紫菜蛋花汤',
  dinner: '清蒸鲈鱼 + 蒜蓉西兰花 + 小米粥',
  drink: '柠檬蜂蜜茶'
})

// 美食数据库
const foodDatabase = {
  breakfast: [
    {
      name: '燕麦粥套餐',
      emoji: '🥣',
      description: '营养丰富的燕麦粥配水煮蛋和牛奶',
      tags: ['健康', '营养', '简单']
    },
    {
      name: '全麦吐司',
      emoji: '🍞',
      description: '全麦面包配牛油果和煎蛋',
      tags: ['西式', '营养', '美味']
    },
    {
      name: '小笼包',
      emoji: '🥟',
      description: '热腾腾的小笼包配豆浆',
      tags: ['中式', '传统', '热乎']
    }
  ],
  lunch: [
    {
      name: '宫保鸡丁',
      emoji: '🍗',
      description: '经典川菜配米饭和汤',
      tags: ['川菜', '下饭', '经典']
    },
    {
      name: '意大利面',
      emoji: '🍝',
      description: '番茄肉酱意大利面',
      tags: ['西式', '美味', '饱腹']
    },
    {
      name: '日式拉面',
      emoji: '🍜',
      description: '浓郁汤头的日式拉面',
      tags: ['日式', '暖胃', '丰富']
    }
  ],
  dinner: [
    {
      name: '清蒸鲈鱼',
      emoji: '🐟',
      description: '清淡营养的蒸鱼配蔬菜',
      tags: ['清淡', '营养', '健康']
    },
    {
      name: '红烧肉',
      emoji: '🥩',
      description: '软糯香甜的红烧肉',
      tags: ['经典', '下饭', '香甜']
    },
    {
      name: '蔬菜沙拉',
      emoji: '🥗',
      description: '新鲜蔬菜沙拉配鸡胸肉',
      tags: ['健康', '减脂', '清爽']
    }
  ],
  drink: [
    {
      name: '柠檬蜂蜜茶',
      emoji: '🍋',
      description: '清香的柠檬茶配蜂蜜',
      tags: ['清香', '维C', '润燥']
    },
    { name: '奶茶', emoji: '🧋', description: '香甜的珍珠奶茶', tags: ['甜品', '治愈', '香甜'] },
    { name: '咖啡', emoji: '☕', description: '醇香的现磨咖啡', tags: ['提神', '醇香', '经典'] }
  ],
  snack: [
    { name: '坚果', emoji: '🥜', description: '混合坚果健康零食', tags: ['健康', '营养', '便携'] },
    { name: '水果', emoji: '🍎', description: '新鲜时令水果', tags: ['新鲜', '维生素', '天然'] },
    { name: '酸奶', emoji: '🥛', description: '益生菌酸奶', tags: ['健康', '益生菌', '美味'] }
  ]
}

// 生成本周计划的函数
const generateWeekPlan = () => {
  const today = new Date()
  const currentDay = today.getDay() // 0是周日，1是周一...
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  // 获取本周一的日期
  const monday = new Date(today)
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1))

  const plan = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)

    const dayName = weekDays[(i + 1) % 7] // 从周一开始
    const isToday = date.toDateString() === today.toDateString()

    // 随机选择早中晚餐
    const breakfast = getRandomFood('breakfast')
    const lunch = getRandomFood('lunch')
    const dinner = getRandomFood('dinner')

    plan.push({
      name: dayName,
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      isToday,
      breakfast: breakfast.name,
      lunch: lunch.name,
      dinner: dinner.name
    })
  }

  return plan
}

// 根据餐次随机选择食物
const getRandomFood = (mealType: string) => {
  let foods: any[] = []

  switch (mealType) {
    case 'breakfast':
      foods = foodDatabase.breakfast || []
      break
    case 'lunch':
      foods = [...(foodDatabase.lunch || []), ...(foodDatabase.dinner || [])]
      break
    case 'dinner':
      foods = [...(foodDatabase.dinner || []), ...(foodDatabase.lunch || [])]
      break
    default:
      foods = Object.values(foodDatabase).flat()
  }

  if (foods.length === 0) return { name: '暂无推荐' }

  const randomIndex = Math.floor(Math.random() * foods.length)
  return foods[randomIndex]
}

// 本周计划
const weekPlan = ref(generateWeekPlan())

// 健康建议
const healthTips = ref([
  { id: 1, icon: '💧', title: '多喝水', content: '每天至少8杯水，保持身体水分充足' },
  { id: 2, icon: '🥬', title: '多吃蔬菜', content: '每餐至少一种蔬菜，补充维生素和纤维' },
  { id: 3, icon: '⏰', title: '规律饮食', content: '三餐定时定量，避免暴饮暴食' },
  { id: 4, icon: '🚫', title: '少油少盐', content: '控制油盐摄入，保护心血管健康' }
])

// 方法
const selectMeal = (meal: string): void => {
  selectedMeal.value = selectedMeal.value === meal ? '' : meal
}

const generateRandom = async (): Promise<void> => {
  isGenerating.value = true

  // 先清空结果，避免闪烁
  randomResult.value = null

  // 模拟生成延迟
  await new Promise((resolve) => setTimeout(resolve, 800))

  let foods: any[] = []
  if (selectedCategory.value === 'all') {
    foods = Object.values(foodDatabase).flat()
  } else {
    foods = foodDatabase[selectedCategory.value] || []
  }

  if (foods.length > 0) {
    const randomIndex = Math.floor(Math.random() * foods.length)
    randomResult.value = foods[randomIndex]
  }

  isGenerating.value = false
}

const getTagType = (tag: string) => {
  const tagTypes: Record<string, 'success' | 'warning' | 'primary' | 'info' | 'danger'> = {
    健康: 'success',
    营养: 'success',
    清淡: 'success',
    美味: 'warning',
    香甜: 'warning',
    经典: 'primary',
    传统: 'primary',
    西式: 'info',
    中式: 'info',
    日式: 'info'
  }
  return tagTypes[tag] || undefined
}

const refreshRecommendations = (): void => {
  // 使用食物数据库中的数据来生成更丰富的推荐
  const breakfastFood = getRandomFood('breakfast')
  const lunchFood = getRandomFood('lunch')
  const dinnerFood = getRandomFood('dinner')
  const drinkFood = getRandomFood('drink')

  currentRecommendations.breakfast = breakfastFood.name || '燕麦粥套餐'
  currentRecommendations.lunch = lunchFood.name || '宫保鸡丁套餐'
  currentRecommendations.dinner = dinnerFood.name || '清蒸鲈鱼套餐'
  currentRecommendations.drink = drinkFood.name || '柠檬蜂蜜茶'

  ElMessage.success('🎉 推荐已刷新！为您推荐了新的美食组合')
}

const saveToFavorites = (): void => {
  const favorites = {
    breakfast: currentRecommendations.breakfast,
    lunch: currentRecommendations.lunch,
    dinner: currentRecommendations.dinner,
    drink: currentRecommendations.drink,
    date: new Date().toLocaleDateString()
  }

  // 保存到本地存储
  const existingFavorites = JSON.parse(localStorage.getItem('foodFavorites') || '[]')
  existingFavorites.push(favorites)
  localStorage.setItem('foodFavorites', JSON.stringify(existingFavorites))

  ElMessage.success('已保存到收藏！')
}

const exportPlan = (): void => {
  const planText = weekPlan.value
    .map(
      (day) =>
        `${day.name} (${day.date}):\n早餐: ${day.breakfast}\n午餐: ${day.lunch}\n晚餐: ${day.dinner}\n`
    )
    .join('\n')

  // 创建下载链接
  const blob = new Blob([planText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '本周美食计划.txt'
  a.click()
  URL.revokeObjectURL(url)

  ElMessage.success('计划已导出！')
}

const openSettings = (): void => {
  ElMessage.info('偏好设置功能开发中...')
}

// 刷新本周计划
const refreshWeekPlan = (): void => {
  weekPlan.value = generateWeekPlan()
  ElMessage.success('本周计划已刷新！')
}

// 生命周期
onMounted(() => {
  // 初始化随机推荐
  generateRandom()
})
</script>

<style scoped lang="scss">
// 变量定义
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
$info-color: #909399;
$bg-color: #f5f7fa;
$border-color: #dcdfe6;
$text-color: #303133;
$text-color-secondary: #606266;

.daily-food-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  overflow-y: auto;
}

.daily-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  .daily-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: $text-color;
    margin: 0 0 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;

    .title-icon {
      font-size: 2.5rem;
      color: #ff6b6b;
    }
  }

  .daily-subtitle {
    font-size: 1.2rem;
    color: $text-color-secondary;
    margin: 0;
    font-weight: 300;
  }
}

.daily-content {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .el-icon {
    font-size: 1.5rem;
    color: $primary-color;
  }

  h3 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 600;
    color: $text-color;
  }
}

// 推荐卡片
.recommendation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.food-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border-color: rgba(64, 158, 255, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &.selected {
    border-color: $primary-color;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);

    &::before {
      opacity: 1;
    }
  }

  .card-icon {
    font-size: 3rem;
    margin-bottom: 15px;
    display: block;
  }

  h4 {
    margin: 0 0 10px 0;
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  p {
    margin: 0 0 15px 0;
    color: #2c2c2c;
    font-size: 0.95rem;
    line-height: 1.5;
    font-weight: 500;
  }

  .card-time {
    font-size: 0.85rem;
    color: #5a5a5a;
    background: rgba(255, 255, 255, 0.9);
    padding: 6px 14px;
    border-radius: 20px;
    display: inline-block;
    font-weight: 600;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
}

// 随机生成器
.random-generator {
  .generator-controls {
    display: flex;
    gap: 15px;
    justify-content: center;
    align-items: center;
    margin-bottom: 25px;
    flex-wrap: wrap;
  }

  .random-result {
    display: flex;
    justify-content: center;
    min-height: 280px; /* 固定最小高度防止抖动 */
    align-items: center;
  }

  .result-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 16px;
    padding: 30px;
    text-align: center;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 8px 25px rgba(64, 158, 255, 0.2);
    border: 2px solid rgba(64, 158, 255, 0.1);

    .result-emoji {
      font-size: 4rem;
      margin-bottom: 15px;
    }

    h3 {
      margin: 0 0 10px 0;
      font-size: 1.5rem;
      color: #1a1a1a;
      font-weight: 700;
    }

    p {
      margin: 0 0 20px 0;
      color: #4a4a4a;
      line-height: 1.6;
      font-weight: 500;
    }

    .result-tags {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      min-height: 32px; /* 固定标签区域高度 */
      align-items: center;
    }
  }

  // 占位符样式
  .result-placeholder {
    max-width: 400px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .placeholder-content {
      text-align: center;
      opacity: 0.6;

      .placeholder-emoji {
        font-size: 4rem;
        margin-bottom: 15px;
        opacity: 0.5;
      }

      h3 {
        margin: 0 0 10px 0;
        font-size: 1.3rem;
        color: #6c757d;
        font-weight: 600;
      }

      p {
        margin: 0;
        color: #adb5bd;
        line-height: 1.6;
        font-size: 0.95rem;
      }
    }
  }

  // 加载状态样式
  .loading-placeholder {
    max-width: 400px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .loading-content {
      text-align: center;

      .loading-spinner {
        font-size: 4rem;
        margin-bottom: 15px;
        animation: spin 1s linear infinite;
      }

      h3 {
        margin: 0 0 10px 0;
        font-size: 1.3rem;
        color: #409eff;
        font-weight: 600;
      }

      p {
        margin: 0;
        color: #6c757d;
        line-height: 1.6;
        font-size: 0.95rem;
      }
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  // 淡入动画
  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

// 美食日历
.food-calendar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.calendar-day {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: rgba(64, 158, 255, 0.3);
  }

  &.today {
    border-color: $primary-color;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    box-shadow: 0 8px 25px rgba(64, 158, 255, 0.3);
  }

  .day-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dee2e6;

    .day-name {
      font-weight: 700;
      color: #1a1a1a;
      font-size: 1.1rem;
    }

    .day-date {
      color: #4a4a4a;
      font-size: 0.9rem;
      font-weight: 600;
    }
  }

  .day-meals {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .meal-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 0;

    .meal-icon {
      font-size: 1.2rem;
    }

    .meal-text {
      font-size: 0.9rem;
      color: #2c2c2c;
      flex: 1;
      font-weight: 500;
    }
  }
}

// 健康建议
.health-tips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.tip-card {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  transition: all 0.3s ease;
  border: 1px solid rgba(64, 158, 255, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(64, 158, 255, 0.15);
    border-color: rgba(64, 158, 255, 0.3);
  }

  .tip-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .tip-content {
    flex: 1;

    h4 {
      margin: 0 0 8px 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #1a1a1a;
    }

    p {
      margin: 0;
      color: #2c2c2c;
      line-height: 1.5;
      font-size: 0.95rem;
      font-weight: 500;
    }
  }
}

// 操作按钮
.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

// 响应式设计
@media (max-width: 768px) {
  .daily-food-container {
    padding: 10px;
  }

  .daily-header {
    padding: 20px 15px;

    .daily-title {
      font-size: 2rem;
      flex-direction: column;
      gap: 10px;
    }

    .daily-subtitle {
      font-size: 1rem;
    }
  }

  .demo-section {
    padding: 20px 15px;
  }

  .recommendation-cards {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .food-calendar {
    grid-template-columns: 1fr;
  }

  .health-tips {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .generator-controls {
    flex-direction: column;
    align-items: stretch;
  }
}

// 全局按钮样式增强
:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &.el-button--large {
    padding: 12px 24px;
    font-size: 1rem;
  }
}

// 选择器样式增强
:deep(.el-select) {
  .el-input__wrapper {
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

// 标签样式增强
:deep(.el-tag) {
  border-radius: 20px;
  font-weight: 500;
  padding: 4px 12px;
}
</style>
