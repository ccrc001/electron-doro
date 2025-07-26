<template>
  <div class="desktop-container" @contextmenu="handleContextMenu" @click="handleDesktopClick">
    <!-- 桌面背景 -->
    <div class="desktop-background"></div>

    <!-- 桌面图标 -->
    <div
      v-for="item in desktopItems"
      :key="item.id"
      class="desktop-item"
      :class="{
        selected: selectedItems.includes(item.id),
        dragging: draggingItem === item.id
      }"
      :style="{
        left: item.x + 'px',
        top: item.y + 'px',
        zIndex: draggingItem === item.id ? 1000 : 1
      }"
      @mousedown="handleMouseDown($event, item)"
      @click="handleItemClick(item, $event)"
      @dblclick="handleItemDoubleClick(item)"
    >
      <!-- 图标 -->
      <div class="item-icon">
        <el-icon :size="32">
          <component :is="item.icon" />
        </el-icon>
      </div>

      <!-- 标签 -->
      <div class="item-label">
        <span>{{ item.name }}</span>
      </div>
    </div>

    <!-- 选择框 -->
    <div
      v-if="isSelecting"
      class="selection-box"
      :style="{
        left: Math.min(selectionStart.x, selectionEnd.x) + 'px',
        top: Math.min(selectionStart.y, selectionEnd.y) + 'px',
        width: Math.abs(selectionEnd.x - selectionStart.x) + 'px',
        height: Math.abs(selectionEnd.y - selectionStart.y) + 'px'
      }"
    ></div>

    <!-- 右键菜单 -->
    <div
      v-if="showContextMenu"
      class="context-menu"
      :style="{
        left: contextMenuPosition.x + 'px',
        top: contextMenuPosition.y + 'px'
      }"
    >
      <div class="menu-item" @click="createNewFolder">
        <el-icon><i-ep-folder-add /></el-icon>
        <span>新建文件夹</span>
      </div>
      <div class="menu-item" @click="createNewFile">
        <el-icon><i-ep-document-add /></el-icon>
        <span>新建文件</span>
      </div>
      <div class="menu-divider"></div>
      <div class="menu-item" @click="refreshDesktop">
        <el-icon><i-ep-refresh /></el-icon>
        <span>刷新</span>
      </div>
      <div class="menu-item" @click="sortItems">
        <el-icon><i-ep-sort /></el-icon>
        <span>排列图标</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
// 定义组件名称，用于keep-alive缓存
defineOptions({
  name: 'Home'
})

// 桌面项目接口
interface DesktopItem {
  id: string
  name: string
  icon: string
  type: 'folder' | 'file' | 'app'
  x: number
  y: number
  width?: number
  height?: number
}

// 响应式数据
const desktopItems = ref<DesktopItem[]>([])
const selectedItems = ref<string[]>([])
const draggingItem = ref<string | null>(null)
const dragOffset = reactive({ x: 0, y: 0 })
const isDragging = ref(false)
const dragThreshold = 5 // 拖拽阈值，避免误触

// 选择框相关
const isSelecting = ref(false)
const selectionStart = reactive({ x: 0, y: 0 })
const selectionEnd = reactive({ x: 0, y: 0 })

// 右键菜单
const showContextMenu = ref(false)
const contextMenuPosition = reactive({ x: 0, y: 0 })

// 性能优化 - 防抖函数
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 缓存容器尺寸，避免重复查询DOM
let containerBounds = { width: 0, height: 0 }
const updateContainerBounds = () => {
  const container = document.querySelector('.desktop-container') as HTMLElement
  if (container) {
    containerBounds.width = container.clientWidth
    containerBounds.height = container.clientHeight
  }
}

// 初始化桌面项目
const initDesktopItems = () => {
  desktopItems.value = [
    {
      id: '1',
      name: '我的文档',
      icon: 'Folder',
      type: 'folder',
      x: 50,
      y: 50
    },
    {
      id: '2',
      name: '图片',
      icon: 'Picture',
      type: 'folder',
      x: 50,
      y: 140
    },
    {
      id: '3',
      name: '音乐',
      icon: 'Headset',
      type: 'folder',
      x: 50,
      y: 230
    },
    {
      id: '4',
      name: '视频',
      icon: 'VideoCamera',
      type: 'folder',
      x: 50,
      y: 330
    },
    {
      id: '5',
      name: '记事本',
      icon: 'Document',
      type: 'app',
      x: 140,
      y: 50
    },
    {
      id: '6',
      name: '浏览器',
      icon: 'Compass',
      type: 'app',
      x: 140,
      y: 140
    },
    {
      id: '7',
      name: '设置',
      icon: 'Setting',
      type: 'app',
      x: 140,
      y: 230
    },
    {
      id: '8',
      name: '回收站',
      icon: 'Delete',
      type: 'folder',
      x: 140,
      y: 330
    }
  ]
}

// 鼠标按下事件 - 开始拖拽
const handleMouseDown = (event: MouseEvent, item: DesktopItem) => {
  event.preventDefault()
  event.stopPropagation() // 阻止事件冒泡

  // 如果按住Ctrl键，则多选
  if (event.ctrlKey) {
    if (selectedItems.value.includes(item.id)) {
      selectedItems.value = selectedItems.value.filter((id) => id !== item.id)
    } else {
      selectedItems.value.push(item.id)
    }
    return
  }

  // 单选
  selectedItems.value = [item.id]

  // 记录初始位置，用于判断是否真正开始拖拽
  const startX = event.clientX
  const startY = event.clientY

  // 延迟开始拖拽，避免误触
  const startDrag = (moveEvent: MouseEvent) => {
    const deltaX = Math.abs(moveEvent.clientX - startX)
    const deltaY = Math.abs(moveEvent.clientY - startY)

    if (deltaX > dragThreshold || deltaY > dragThreshold) {
      // 开始拖拽
      isDragging.value = true
      draggingItem.value = item.id
      dragOffset.x = startX - item.x
      dragOffset.y = startY - item.y

      // 移除临时事件监听
      document.removeEventListener('mousemove', startDrag)
      document.removeEventListener('mouseup', cancelDrag)

      // 添加拖拽事件监听
      document.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  const cancelDrag = () => {
    document.removeEventListener('mousemove', startDrag)
    document.removeEventListener('mouseup', cancelDrag)
  }

  // 添加临时事件监听
  document.addEventListener('mousemove', startDrag)
  document.addEventListener('mouseup', cancelDrag)
}

// 鼠标移动事件 - 拖拽中
let animationFrameId: number | null = null

const handleMouseMove = (event: MouseEvent) => {
  if (!draggingItem.value || !isDragging.value) return

  // 取消之前的动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  // 使用requestAnimationFrame优化性能
  animationFrameId = requestAnimationFrame(() => {
    const item = desktopItems.value.find((item) => item.id === draggingItem.value)
    if (!item) return

    // 计算新位置
    const newX = event.clientX - dragOffset.x
    const newY = event.clientY - dragOffset.y

    // 使用缓存的容器尺寸限制在容器内
    if (containerBounds.width > 0 && containerBounds.height > 0) {
      const maxX = containerBounds.width - 100
      const maxY = containerBounds.height - 100

      item.x = Math.max(0, Math.min(newX, maxX))
      item.y = Math.max(0, Math.min(newY, maxY))
    } else {
      item.x = Math.max(0, newX)
      item.y = Math.max(0, newY)
    }
  })
}

// 鼠标释放事件 - 结束拖拽
const handleMouseUp = () => {
  // 取消动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  // 重置拖拽状态
  draggingItem.value = null
  isDragging.value = false

  // 移除全局鼠标事件
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

// 桌面点击事件 - 点击空白取消选中
const handleDesktopClick = (event: MouseEvent) => {
  // 如果点击的是桌面容器本身（空白区域），则取消选中
  if (event.target === event.currentTarget) {
    selectedItems.value = []
    closeContextMenu()
  }
}

// 单击事件
const handleItemClick = (item: DesktopItem, event: MouseEvent) => {
  event.stopPropagation() // 阻止事件冒泡到桌面

  if (!selectedItems.value.includes(item.id)) {
    selectedItems.value = [item.id]
  }
}

// 双击事件
const handleItemDoubleClick = (item: DesktopItem) => {
  ElMessage.success(`打开 ${item.name}`)

  // 这里可以添加打开文件/文件夹的逻辑
  if (item.type === 'folder') {
    console.log(`打开文件夹: ${item.name}`)
  } else if (item.type === 'app') {
    console.log(`启动应用: ${item.name}`)
  }
}

// 右键菜单事件
const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault()

  contextMenuPosition.x = event.clientX
  contextMenuPosition.y = event.clientY
  showContextMenu.value = true

  // 点击其他地方关闭菜单
  setTimeout(() => {
    document.addEventListener('click', closeContextMenu)
  }, 0)
}

// 关闭右键菜单
const closeContextMenu = () => {
  showContextMenu.value = false
  document.removeEventListener('click', closeContextMenu)
}

// 创建新文件夹
const createNewFolder = () => {
  const newFolder: DesktopItem = {
    id: Date.now().toString(),
    name: '新建文件夹',
    icon: 'Folder',
    type: 'folder',
    x: contextMenuPosition.x - 50,
    y: contextMenuPosition.y - 50
  }

  desktopItems.value.push(newFolder)
  closeContextMenu()
  ElMessage.success('创建新文件夹成功')
}

// 创建新文件
const createNewFile = () => {
  const newFile: DesktopItem = {
    id: Date.now().toString(),
    name: '新建文档.txt',
    icon: 'Document',
    type: 'file',
    x: contextMenuPosition.x - 50,
    y: contextMenuPosition.y - 50
  }

  desktopItems.value.push(newFile)
  closeContextMenu()
  ElMessage.success('创建新文件成功')
}

// 刷新桌面
const refreshDesktop = () => {
  closeContextMenu()
  ElMessage.info('桌面已刷新')
}

// 排列图标
const sortItems = () => {
  let x = 50
  let y = 50
  const itemWidth = 90
  const itemHeight = 90
  const maxColumns = 8

  desktopItems.value.forEach((item, index) => {
    const col = index % maxColumns
    const row = Math.floor(index / maxColumns)

    item.x = x + col * itemWidth
    item.y = y + row * itemHeight
  })

  closeContextMenu()
  ElMessage.success('图标已重新排列')
}

// 组件挂载
onMounted(async () => {
  console.log('加载')

  initDesktopItems()

  // 初始化容器尺寸
  updateContainerBounds()

  // 监听键盘事件
  document.addEventListener('keydown', handleKeyDown)

  // 监听窗口大小变化
  window.addEventListener('resize', updateContainerBounds)
})

// 组件卸载
onUnmounted(() => {
  // 清理所有事件监听
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('click', closeContextMenu)
  window.removeEventListener('resize', updateContainerBounds)

  // 取消动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

// 键盘事件
const handleKeyDown = (event: KeyboardEvent) => {
  // Delete键删除选中项目
  if (event.key === 'Delete' && selectedItems.value.length > 0) {
    desktopItems.value = desktopItems.value.filter((item) => !selectedItems.value.includes(item.id))
    selectedItems.value = []
    ElMessage.success('已删除选中项目')
  }

  // Ctrl+A全选
  if (event.ctrlKey && event.key === 'a') {
    event.preventDefault()
    selectedItems.value = desktopItems.value.map((item) => item.id)
  }

  // Escape取消选择
  if (event.key === 'Escape') {
    selectedItems.value = []
    closeContextMenu()
  }
}
</script>

<style scoped lang="scss">
// 桌面容器
.desktop-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  user-select: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

// 桌面背景
.desktop-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

// 桌面项目
.desktop-item {
  position: absolute;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  padding: 8px;

  // 硬件加速
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;

  // 优化过渡效果
  transition:
    background-color 0.2s ease,
    border 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    transform: translateY(-2px) translateZ(0);
  }

  &.selected {
    background: rgba(64, 158, 255, 0.2);
    border: 2px solid rgba(64, 158, 255, 0.5);
    backdrop-filter: blur(10px);
  }

  &.dragging {
    transform: scale(1.05) translateZ(0);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    z-index: 1000 !important;
    transition: none; // 拖拽时禁用过渡动画
  }
}

// 图标
.item-icon {
  margin-bottom: 8px;

  .el-icon {
    color: rgba(255, 255, 255, 0.9);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: all 0.3s ease;
  }

  .desktop-item:hover & .el-icon {
    color: #fff;
    transform: scale(1.1);
  }

  .desktop-item.selected & .el-icon {
    color: #409eff;
  }
}

// 标签
.item-label {
  text-align: center;
  width: 100%;

  span {
    display: inline-block;
    color: rgba(255, 255, 255, 0.9);
    font-size: 12px;
    line-height: 1.2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    word-break: break-all;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .desktop-item:hover & span {
    color: #fff;
  }

  .desktop-item.selected & span {
    color: #409eff;
    font-weight: 500;
  }
}

// 选择框
.selection-box {
  position: absolute;
  border: 1px dashed rgba(255, 255, 255, 0.6);
  background: rgba(64, 158, 255, 0.1);
  pointer-events: none;
  z-index: 999;
}

// 右键菜单
.context-menu {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 0;
  min-width: 160px;
  z-index: 1001;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #333;

    &:hover {
      background: rgba(64, 158, 255, 0.1);
      color: #409eff;
    }

    .el-icon {
      margin-right: 8px;
      font-size: 16px;
    }

    span {
      font-size: 14px;
    }
  }

  .menu-divider {
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
    margin: 4px 0;
  }
}

// 动画效果
@keyframes itemAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.desktop-item {
  animation: itemAppear 0.3s ease forwards;
}

// 响应式设计
@media (max-width: 768px) {
  .desktop-item {
    width: 70px;
    height: 90px;
    padding: 6px;
  }

  .item-icon .el-icon {
    font-size: 40px;
  }

  .item-label span {
    font-size: 11px;
  }

  .context-menu {
    min-width: 140px;

    .menu-item {
      padding: 6px 12px;

      span {
        font-size: 13px;
      }
    }
  }
}

@media (max-width: 480px) {
  .desktop-item {
    width: 60px;
    height: 80px;
    padding: 4px;
  }

  .item-icon .el-icon {
    font-size: 36px;
  }

  .item-label span {
    font-size: 10px;
  }
}
</style>
