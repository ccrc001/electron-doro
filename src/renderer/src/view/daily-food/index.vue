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

// 美食数据库
const foodDatabase = {
  breakfast: [
    {
      name: '豆浆油条',
      emoji: '🥛',
      description: '经典中式早餐组合',
      tags: ['传统', '香脆', '国民早餐']
    },
    {
      name: '小笼包',
      emoji: '🥟',
      description: '上海特色汤包',
      tags: ['江南', '鲜嫩', '汤汁饱满']
    },
    {
      name: '煎饼果子',
      emoji: '🌯',
      description: '天津特色薄脆煎饼',
      tags: ['北方', '街头', '香脆']
    },
    {
      name: '肠粉',
      emoji: '🍜',
      description: '广式米浆蒸制点心',
      tags: ['广东', '滑嫩', '早茶']
    },
    {
      name: '热干面',
      emoji: '🍝',
      description: '武汉特色芝麻酱拌面',
      tags: ['湖北', '香浓', '碱水面']
    },
    {
      name: '粢饭团',
      emoji: '🍙',
      description: '糯米包油条和肉松',
      tags: ['上海', '便携', '饱腹']
    },
    {
      name: '皮蛋瘦肉粥',
      emoji: '🥣',
      description: '广式经典粥品',
      tags: ['广东', '绵密', '暖胃']
    },
    {
      name: '葱油拌面',
      emoji: '🍜',
      description: '上海特色葱油面',
      tags: ['江南', '简单', '葱香']
    },
    {
      name: '豆腐脑',
      emoji: '🥣',
      description: '南北咸甜风味',
      tags: ['传统', '嫩滑', '争议']
    },
    {
      name: '烧卖',
      emoji: '🥟',
      description: '广式茶点',
      tags: ['广东', '糯米', '早茶']
    },
    {
      name: '鸡蛋灌饼',
      emoji: '🥚',
      description: '北方街头早餐',
      tags: ['河南', '香脆', '蛋香']
    },
    {
      name: '糯米鸡',
      emoji: '🍗',
      description: '荷叶包裹糯米鸡肉',
      tags: ['广东', '清香', '饱腹']
    },
    {
      name: '咸豆浆',
      emoji: '🥛',
      description: '江浙特色咸味豆浆',
      tags: ['江南', '咸香', '特色']
    },
    {
      name: '韭菜盒子',
      emoji: '🥟',
      description: '北方煎制面食',
      tags: ['北方', '韭菜', '香脆']
    },
    {
      name: '麻团',
      emoji: '🍡',
      description: '油炸糯米芝麻球',
      tags: ['传统', '甜味', '酥脆']
    },
    {
      name: '生煎包',
      emoji: '🥟',
      description: '上海特色煎包',
      tags: ['上海', '底部酥脆', '汤汁']
    },
    {
      name: '八宝粥',
      emoji: '🥣',
      description: '多种谷物熬制甜粥',
      tags: ['传统', '养生', '甜味']
    },
    {
      name: '肉夹馍',
      emoji: '🥙',
      description: '陕西特色面食',
      tags: ['陕西', '腊汁肉', '馍香']
    },
    {
      name: '炒肝',
      emoji: '🥣',
      description: '北京特色早点',
      tags: ['北京', '浓稠', '内脏']
    },
    {
      name: '锅边糊',
      emoji: '🥣',
      description: '福建特色米糊',
      tags: ['福建', '米香', '海鲜']
    },
    {
      name: '油茶',
      emoji: '🥣',
      description: '川渝特色面茶',
      tags: ['四川', '咸香', '麻辣']
    },
    {
      name: '萝卜糕',
      emoji: '🍰',
      description: '广式茶点',
      tags: ['广东', '萝卜', '煎制']
    },
    {
      name: '糍粑',
      emoji: '🍡',
      description: '糯米捣制点心',
      tags: ['传统', '软糯', '甜味']
    },
    {
      name: '阳春面',
      emoji: '🍜',
      description: '江南清汤面',
      tags: ['江苏', '简单', '鲜美']
    },
    {
      name: '豆汁儿',
      emoji: '🥛',
      description: '北京特色发酵饮品',
      tags: ['北京', '特殊', '酸味']
    },
    {
      name: '葱油饼',
      emoji: '🫓',
      description: '香葱油煎面饼',
      tags: ['上海', '层次', '香脆']
    },
    {
      name: '米线',
      emoji: '🍜',
      description: '云南特色早餐',
      tags: ['云南', '细滑', '高汤']
    },
    {
      name: '咸鸭蛋',
      emoji: '🥚',
      description: '腌制咸蛋配粥',
      tags: ['传统', '流油', '下饭']
    },
    {
      name: '粽子',
      emoji: '🎋',
      description: '端午特色糯米食品',
      tags: ['传统', '咸甜', '粽叶香']
    },
    {
      name: '菜肉大馄饨',
      emoji: '🥟',
      description: '江南特色面食',
      tags: ['上海', '个大', '鲜美']
    }
  ],
  lunch: [
    {
      name: '宫保鸡丁',
      emoji: '🍗',
      description: '川菜经典',
      tags: ['四川', '麻辣', '花生']
    },
    {
      name: '鱼香肉丝',
      emoji: '🥩',
      description: '川味下饭菜',
      tags: ['四川', '酸甜', '木耳']
    },
    {
      name: '红烧肉',
      emoji: '🥩',
      description: '江浙经典',
      tags: ['江南', '甜咸', '肥而不腻']
    },
    {
      name: '麻婆豆腐',
      emoji: '🧈',
      description: '川菜代表',
      tags: ['四川', '麻辣', '下饭']
    },
    {
      name: '北京烤鸭',
      emoji: '🦆',
      description: '京菜代表',
      tags: ['北京', '酥脆', '卷饼']
    },
    {
      name: '剁椒鱼头',
      emoji: '🐟',
      description: '湘菜代表',
      tags: ['湖南', '鲜辣', '泡椒']
    },
    {
      name: '糖醋排骨',
      emoji: '🍖',
      description: '江浙经典',
      tags: ['江南', '酸甜', '骨香']
    },
    {
      name: '水煮鱼',
      emoji: '🐟',
      description: '川菜代表',
      tags: ['四川', '麻辣', '嫩滑']
    },
    {
      name: '回锅肉',
      emoji: '🥩',
      description: '川菜经典',
      tags: ['四川', '豆瓣酱', '蒜苗']
    },
    {
      name: '东坡肉',
      emoji: '🥩',
      description: '杭州名菜',
      tags: ['浙江', '酒香', '酥烂']
    },
    {
      name: '白切鸡',
      emoji: '🍗',
      description: '粤菜经典',
      tags: ['广东', '鲜嫩', '姜葱']
    },
    {
      name: '酸菜鱼',
      emoji: '🐟',
      description: '重庆特色',
      tags: ['重庆', '酸辣', '泡菜']
    },
    {
      name: '梅菜扣肉',
      emoji: '🥩',
      description: '客家名菜',
      tags: ['广东', '咸香', '梅菜']
    },
    {
      name: '毛血旺',
      emoji: '🥘',
      description: '重庆麻辣火锅',
      tags: ['重庆', '麻辣', '血豆腐']
    },
    {
      name: '狮子头',
      emoji: '🍖',
      description: '淮扬名菜',
      tags: ['江苏', '大肉丸', '清炖']
    },
    {
      name: '佛跳墙',
      emoji: '🍲',
      description: '闽菜代表',
      tags: ['福建', '海鲜', '名贵']
    },
    {
      name: '大盘鸡',
      emoji: '🍗',
      description: '新疆特色',
      tags: ['新疆', '土豆', '皮带面']
    },
    {
      name: '腊味合蒸',
      emoji: '🥩',
      description: '湘菜代表',
      tags: ['湖南', '腊肉', '咸香']
    },
    {
      name: '松鼠桂鱼',
      emoji: '🐟',
      description: '苏帮菜',
      tags: ['江苏', '造型', '酸甜']
    },
    {
      name: '葱烧海参',
      emoji: '🦪',
      description: '鲁菜代表',
      tags: ['山东', '名贵', '葱香']
    },
    {
      name: '蚂蚁上树',
      emoji: '🍝',
      description: '川味粉丝',
      tags: ['四川', '粉丝', '肉末']
    },
    {
      name: '夫妻肺片',
      emoji: '🥩',
      description: '川菜凉菜',
      tags: ['四川', '麻辣', '牛杂']
    },
    {
      name: '锅包肉',
      emoji: '🥩',
      description: '东北名菜',
      tags: ['东北', '酸甜', '酥脆']
    },
    {
      name: '三杯鸡',
      emoji: '🍗',
      description: '江西名菜',
      tags: ['江西', '九层塔', '米酒']
    },
    {
      name: '辣子鸡',
      emoji: '🍗',
      description: '川味炸鸡',
      tags: ['四川', '干辣椒', '酥香']
    },
    {
      name: '盐水鸭',
      emoji: '🦆',
      description: '南京特产',
      tags: ['南京', '咸鲜', '嫩滑']
    },
    {
      name: '粉蒸肉',
      emoji: '🥩',
      description: '湖北特色',
      tags: ['湖北', '米粉', '软糯']
    },
    {
      name: '手抓羊肉',
      emoji: '🍖',
      description: '西北美食',
      tags: ['西北', '原味', '豪放']
    },
    {
      name: '过桥米线',
      emoji: '🍜',
      description: '云南特色',
      tags: ['云南', '高汤', '自烫']
    },
    {
      name: '文昌鸡',
      emoji: '🍗',
      description: '海南四大名菜',
      tags: ['海南', '白切', '鲜嫩']
    }
  ],
  dinner: [
    {
      name: '清蒸鲈鱼',
      emoji: '🐟',
      description: '粤式经典',
      tags: ['广东', '清淡', '鲜美']
    },
    {
      name: '上汤娃娃菜',
      emoji: '🥬',
      description: '经典粤菜',
      tags: ['广东', '高汤', '清甜']
    },
    {
      name: '蒜蓉粉丝蒸扇贝',
      emoji: '🦪',
      description: '海鲜经典',
      tags: ['粤式', '鲜美', '蒜香']
    },
    {
      name: '蚝油生菜',
      emoji: '🥬',
      description: '广式素菜',
      tags: ['广东', '简单', '脆嫩']
    },
    {
      name: '番茄炒蛋',
      emoji: '🍅',
      description: '国民家常菜',
      tags: ['家常', '酸甜', '下饭']
    },
    {
      name: '干煸四季豆',
      emoji: '🥬',
      description: '川味素菜',
      tags: ['四川', '干香', '微辣']
    },
    {
      name: '凉拌黄瓜',
      emoji: '🥒',
      description: '经典凉菜',
      tags: ['家常', '清爽', '开胃']
    },
    {
      name: '皮蛋豆腐',
      emoji: '🧈',
      description: '经典凉菜',
      tags: ['家常', '嫩滑', '咸鲜']
    },
    {
      name: '清炒时蔬',
      emoji: '🥬',
      description: '应季蔬菜',
      tags: ['家常', '健康', '清淡']
    },
    {
      name: '蒸水蛋',
      emoji: '🥚',
      description: '家常蒸蛋',
      tags: ['家常', '嫩滑', '简单']
    },
    {
      name: '红烧茄子',
      emoji: '🍆',
      description: '家常下饭菜',
      tags: ['家常', '软糯', '酱香']
    },
    {
      name: '白灼虾',
      emoji: '🦐',
      description: '粤式海鲜',
      tags: ['广东', '原味', '鲜美']
    },
    {
      name: '炒青菜',
      emoji: '🥬',
      description: '家常素菜',
      tags: ['家常', '简单', '健康']
    },
    {
      name: '糖醋里脊',
      emoji: '🥩',
      description: '经典酸甜口',
      tags: ['家常', '酥脆', '开胃']
    },
    {
      name: '鱼头豆腐汤',
      emoji: '🍲',
      description: '营养汤品',
      tags: ['家常', '鲜美', '补钙']
    },
    {
      name: '蒜蓉空心菜',
      emoji: '🥬',
      description: '经典炒菜',
      tags: ['家常', '蒜香', '清脆']
    },
    {
      name: '酱爆鸡丁',
      emoji: '🍗',
      description: '京味家常',
      tags: ['北京', '酱香', '下饭']
    },
    {
      name: '清炒虾仁',
      emoji: '🦐',
      description: '江南风味',
      tags: ['江苏', '清淡', '鲜嫩']
    },
    {
      name: '地三鲜',
      emoji: '🥔',
      description: '东北家常',
      tags: ['东北', '土豆', '茄子']
    },
    {
      name: '苦瓜炒蛋',
      emoji: '🥒',
      description: '清热家常',
      tags: ['家常', '苦味', '降火']
    },
    {
      name: '蚂蚁上树',
      emoji: '🍝',
      description: '粉丝炒肉末',
      tags: ['川味', '粉丝', '微辣']
    },
    {
      name: '干锅花菜',
      emoji: '🥦',
      description: '湘味干锅',
      tags: ['湖南', '干香', '微辣']
    },
    {
      name: '京酱肉丝',
      emoji: '🥩',
      description: '北京风味',
      tags: ['北京', '甜面酱', '卷饼']
    },
    {
      name: '椒盐排骨',
      emoji: '🍖',
      description: '香酥排骨',
      tags: ['家常', '酥脆', '椒香']
    },
    {
      name: '西芹炒百合',
      emoji: '🥬',
      description: '养生小炒',
      tags: ['家常', '清爽', '养生']
    },
    {
      name: '红烧狮子头',
      emoji: '🍖',
      description: '淮扬名菜',
      tags: ['江苏', '大肉丸', '酱香']
    },
    {
      name: '清蒸大闸蟹',
      emoji: '🦀',
      description: '秋季时令',
      tags: ['江南', '时令', '鲜美']
    },
    {
      name: '蒜泥白肉',
      emoji: '🥩',
      description: '川味凉菜',
      tags: ['四川', '蒜香', '薄片']
    },
    {
      name: '炒肝尖',
      emoji: '🥩',
      description: '鲁味小炒',
      tags: ['山东', '嫩滑', '酱香']
    },
    {
      name: '干煸肥肠',
      emoji: '🥓',
      description: '川味经典',
      tags: ['四川', '酥脆', '麻辣']
    }
  ],
  drink: [
    {
      name: '珍珠奶茶',
      emoji: '🧋',
      description: '台湾特色饮品',
      tags: ['台湾', 'Q弹', '甜蜜']
    },
    {
      name: '酸梅汤',
      emoji: '🍹',
      description: '传统消暑饮品',
      tags: ['传统', '酸甜', '解腻']
    },
    {
      name: '豆浆',
      emoji: '🥛',
      description: '传统早餐饮品',
      tags: ['传统', '健康', '植物蛋白']
    },
    {
      name: '王老吉',
      emoji: '🍵',
      description: '广东凉茶',
      tags: ['广东', '降火', '草药']
    },
    {
      name: '椰树椰汁',
      emoji: '🥥',
      description: '海南特色饮品',
      tags: ['海南', '椰香', '经典']
    },
    {
      name: '冰峰',
      emoji: '🥤',
      description: '西安特色汽水',
      tags: ['陕西', '橙味', '怀旧']
    },
    {
      name: '大麦茶',
      emoji: '🍵',
      description: '日韩式茶饮',
      tags: ['日韩', '麦香', '解腻']
    },
    {
      name: '蜂蜜柚子茶',
      emoji: '🍯',
      description: '养生茶饮',
      tags: ['养生', '甜味', '润燥']
    },
    {
      name: '乌龙茶',
      emoji: '🍵',
      description: '半发酵茶',
      tags: ['福建', '清香', '解腻']
    },
    {
      name: '茉莉花茶',
      emoji: '🌸',
      description: '花香茶饮',
      tags: ['福建', '花香', '清新']
    },
    {
      name: '红枣枸杞茶',
      emoji: '🍵',
      description: '养生茶饮',
      tags: ['养生', '补血', '甜味']
    },
    {
      name: '绿豆汤',
      emoji: '🥣',
      description: '夏季消暑饮品',
      tags: ['传统', '清凉', '解暑']
    },
    {
      name: '杏仁露',
      emoji: '🥛',
      description: '北方特色饮品',
      tags: ['北方', '杏仁', '甜味']
    },
    {
      name: '梨汤',
      emoji: '🍐',
      description: '润肺止咳饮品',
      tags: ['传统', '润肺', '秋冬']
    },
    {
      name: '冬瓜茶',
      emoji: '🍈',
      description: '台湾特色饮品',
      tags: ['台湾', '清凉', '降火']
    },
    {
      name: '马蹄爽',
      emoji: '🍶',
      description: '广东特色饮品',
      tags: ['广东', '清甜', '马蹄']
    },
    {
      name: '凉虾',
      emoji: '🍧',
      description: '湖北特色冰品',
      tags: ['湖北', '红糖', '消暑']
    },
    {
      name: '双皮奶',
      emoji: '🍮',
      description: '广式甜品',
      tags: ['广东', '奶香', '顺滑']
    },
    {
      name: '姜撞奶',
      emoji: '🥛',
      description: '广式暖胃甜品',
      tags: ['广东', '姜味', '暖身']
    },
    {
      name: '杨枝甘露',
      emoji: '🍹',
      description: '港式甜品',
      tags: ['香港', '芒果', '西米']
    },
    {
      name: '烧仙草',
      emoji: '🍮',
      description: '台湾甜品',
      tags: ['台湾', '仙草', 'Q弹']
    },
    {
      name: '龟苓膏',
      emoji: '🍮',
      description: '广式药膳甜品',
      tags: ['广东', '草药', '降火']
    },
    {
      name: '银耳羹',
      emoji: '🥣',
      description: '传统滋补甜品',
      tags: ['传统', '胶质', '养颜']
    },
    {
      name: '酒酿圆子',
      emoji: '🍶',
      description: '江南甜品',
      tags: ['江南', '酒香', '糯米']
    },
    {
      name: '红豆汤',
      emoji: '🥣',
      description: '传统甜汤',
      tags: ['传统', '补血', '甜味']
    },
    {
      name: '花生汤',
      emoji: '🥣',
      description: '福建特色甜汤',
      tags: ['福建', '花生', '绵密']
    },
    {
      name: '冰粉',
      emoji: '🍧',
      description: '川渝夏日冰品',
      tags: ['四川', '红糖', '清凉']
    },
    {
      name: '茅根竹蔗水',
      emoji: '🍵',
      description: '广东凉茶',
      tags: ['广东', '清甜', '降火']
    },
    {
      name: '柠檬红茶',
      emoji: '🍋',
      description: '港式茶餐厅饮品',
      tags: ['香港', '酸甜', '解腻']
    },
    {
      name: '咸柠七',
      emoji: '🍋',
      description: '港式特色饮品',
      tags: ['香港', '咸甜', '气泡']
    }
  ],
  snack: [
    {
      name: '瓜子',
      emoji: '🌻',
      description: '国民零食',
      tags: ['传统', '香脆', '唠嗑']
    },
    {
      name: '辣条',
      emoji: '🌶',
      description: '国民零食',
      tags: ['湖南', '麻辣', '怀旧']
    },
    {
      name: '山楂片',
      emoji: '🍎',
      description: '传统开胃零食',
      tags: ['传统', '酸甜', '助消化']
    },
    {
      name: '麻花',
      emoji: '🥨',
      description: '传统油炸面食',
      tags: ['传统', '酥脆', '甜咸']
    },
    {
      name: '绿豆糕',
      emoji: '🍰',
      description: '传统糕点',
      tags: ['传统', '清甜', '细腻']
    },
    {
      name: '凤梨酥',
      emoji: '🍍',
      description: '台湾特色点心',
      tags: ['台湾', '酥皮', '果香']
    },
    {
      name: '老婆饼',
      emoji: '🥮',
      description: '广式传统点心',
      tags: ['广东', '酥皮', '甜味']
    },
    {
      name: '蛋黄酥',
      emoji: '🥮',
      description: '网红点心',
      tags: ['现代', '咸甜', '层次']
    },
    {
      name: '沙琪玛',
      emoji: '🍯',
      description: '传统甜点',
      tags: ['满族', '甜腻', '松软']
    },
    {
      name: '龙须糖',
      emoji: '🍬',
      description: '传统手工艺糖',
      tags: ['传统', '细丝', '甜味']
    },
    {
      name: '芝麻糖',
      emoji: '🍬',
      description: '传统糖果',
      tags: ['传统', '芝麻', '香脆']
    },
    {
      name: '花生糖',
      emoji: '🥜',
      description: '传统糖果',
      tags: ['传统', '花生', '香脆']
    },
    {
      name: '糖葫芦',
      emoji: '🍡',
      description: '北方冬季零食',
      tags: ['北方', '酸甜', '冰糖']
    },
    {
      name: '驴打滚',
      emoji: '🫔',
      description: '北京传统小吃',
      tags: ['北京', '糯米', '豆面']
    },
    {
      name: '茯苓饼',
      emoji: '🥞',
      description: '北京特产',
      tags: ['北京', '薄脆', '夹心']
    },
    {
      name: '云片糕',
      emoji: '🍰',
      description: '江南传统糕点',
      tags: ['江南', '片状', '甜味']
    },
    {
      name: '桃酥',
      emoji: '🍪',
      description: '传统酥饼',
      tags: ['传统', '酥脆', '核桃']
    },
    {
      name: '蛋卷',
      emoji: '🍥',
      description: '香脆蛋香零食',
      tags: ['现代', '酥脆', '蛋香']
    },
    {
      name: '米花糖',
      emoji: '🍘',
      description: '传统膨化零食',
      tags: ['传统', '米香', '甜味']
    },
    {
      name: '锅巴',
      emoji: '🍘',
      description: '香脆米制品',
      tags: ['传统', '咸香', '酥脆']
    },
    {
      name: '薯片',
      emoji: '🥔',
      description: '现代膨化食品',
      tags: ['现代', '酥脆', '多种口味']
    },
    {
      name: '牛肉干',
      emoji: '🥩',
      description: '肉类零食',
      tags: ['内蒙古', '耐嚼', '咸香']
    },
    {
      name: '猪肉脯',
      emoji: '🥓',
      description: '肉类零食',
      tags: ['江苏', '薄片', '甜咸']
    },
    {
      name: '鱿鱼丝',
      emoji: '🦑',
      description: '海鲜零食',
      tags: ['沿海', '咸鲜', '耐嚼']
    },
    {
      name: '蚕豆',
      emoji: '🫘',
      description: '传统零食',
      tags: ['传统', '香脆', '多种口味']
    },
    {
      name: '开心果',
      emoji: '🌰',
      description: '进口坚果',
      tags: ['现代', '香脆', '营养']
    },
    {
      name: '夏威夷果',
      emoji: '🌰',
      description: '进口坚果',
      tags: ['现代', '奶油', '香脆']
    },
    {
      name: '碧根果',
      emoji: '🌰',
      description: '进口坚果',
      tags: ['现代', '甜味', '香脆']
    },
    {
      name: '巴旦木',
      emoji: '🌰',
      description: '新疆特产坚果',
      tags: ['新疆', '营养', '香脆']
    },
    {
      name: '松子',
      emoji: '🌰',
      description: '东北特产坚果',
      tags: ['东北', '油香', '名贵']
    }
  ]
}
// 随机获取食物函数
const getRandomFoodDations = (category: any): any => {
  const items = foodDatabase[category]
  const randomIndex = Math.floor(Math.random() * items.length)
  return items[randomIndex]
}
// 当前推荐
const currentRecommendations = reactive({
  breakfast: '燕麦粥 + 水煮蛋 + 牛奶',
  lunch: '宫保鸡丁 + 米饭 + 紫菜蛋花汤',
  dinner: '清蒸鲈鱼 + 蒜蓉西兰花 + 小米粥',
  drink: getRandomFoodDations('drink').name
})

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
      foods = foodDatabase.lunch || []
      break
    case 'dinner':
      foods = foodDatabase.dinner || []
      break
    case 'drink':
      foods = foodDatabase.drink || []
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
