<template>
  <view class="container">
    <!-- 计时器部分 (上30%) -->
    <view class="timer-section">
      <view class="timer-container">
        <!-- 圆形进度条 -->
        <view class="circular-progress">
<!--          <canvas
            canvas-id="progressCanvas"
            class="progress-canvas"
            :style="{ width: canvasSize + 'px', height: canvasSize + 'px' }"
          ></canvas> -->
          <view class="timer-display">
            <text class="time-text">{{ formattedTime }}</text>
            <text class="timer-status">{{ timerStatus }}</text>
          </view>
        </view>
        
        <!-- 计时器控制按钮 -->
        <view class="timer-controls">
          <button 
            class="control-btn start-btn" 
            :class="{ active: isRunning }"
            @tap="toggleTimer"
          >
            {{ isRunning ? '暂停' : '开始' }}
          </button>
          <button 
            class="control-btn reset-btn" 
            @tap="resetTimer"
            :disabled="isRunning"
          >
            重置
          </button>
        </view>
        
        <!-- 时间选择 -->
        <view class="time-presets">
          <text 
            class="time-option" 
            :class="{ active: selectedDuration === 25 }"
            @tap="setDuration(25)"
          >25分钟</text>
          <text 
            class="time-option" 
            :class="{ active: selectedDuration === 40 }"
            @tap="setDuration(40)"
          >40分钟</text>
          <text 
            class="time-option" 
            :class="{ active: selectedDuration === 60 }"
            @tap="setDuration(60)"
          >60分钟</text>
          <text 
            class="time-option" 
            :class="{ active: selectedDuration === 90 }"
            @tap="setDuration(90)"
          >90分钟</text>
        </view>
      </view>
    </view>
    
    <!-- 待办事项部分 (下70%) -->
    <view class="todo-section">
      <view class="section-header">
        <text class="section-title">今日待办</text>
        <text class="current-date">{{ currentDate }}</text>
      </view>
	  
	  <view v-if="ScheduleOneDay.length==0" class="tip">
	    当日暂无清单-快去创建吧
	  </view>
      
      <!-- 待办事项列表 -->
      <scroll-view class="todo-list" scroll-y>
        <!-- 时间轴 -->
<!--        <view class="timeline">
          <view 
            class="timeline-hour" 
            v-for="hour in timelineHours" 
            :key="hour"
          >
            <text class="hour-label">{{ hour }}:00</text>
          </view>
        </view> -->
        
        <!-- 待办事项卡片 -->
        <view class="todo-item">
         <view class="todo-item-content"
		  v-for="(Schedule,index) in ScheduleOneDay"
		  :key="Schedule.id"
		  @longpress="todoOperating(Schedule.id)"
		  @tap="todoClick(Schedule.startTime, Schedule.endTime)"
		  >
<!-- 		  <view class="todo-item-content"
		  v-for="item in todoItems"
		  :key="item.id"
		  :style="{
		    // backgroundColor: item.color
		  }"
		  > -->
			
            <view class="todo-time">
			  <text class="todo-index">{{index+1}}</text>
              <text class="todo-start">{{ formatScheduleTimeSimple(Schedule.startTime) }}</text>
			  <text class="todo-duration">{{ formatScheduleTimeSimple(Schedule.endTime) }}</text>
              <!-- <text class="todo-duration">{{ item.duration }}分钟</text> -->
            </view>
            <view class="todo-info">
<!--              <text class="todo-title">{{ item.title }}</text> -->
              <text class="todo-desc">{{ Schedule.content }}</text>
            </view>
            <view class="todo-status" @tap="selectTodo(Schedule)">
              <text 
                class="status-icon"
                :class="{ completed: Schedule.status }"
              >{{ Schedule.status ? '✓' : '○' }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
      
      <!-- 新增待办按钮 -->
<!--      <view class="add-todo-btn" @tap="addNewTodo">
        <text class="add-icon">+</text>
        <text>添加待办</text>
      </view> -->
    </view>
	<alterForm
	:showForm="showForm" 
	:updateData="updateData"
	@update:showForm="showForm = $event"
	@getSchedule="getSchedule"></alterForm>
	
	<listForm @getSchedule="getSchedule" :selectLocalDate="selectLocalDate" >
		
	</listForm>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { apiGetScheduleByuserId, apiStatusSchedule, apiDelSchedule, apiGetScheduleById } from '../../api/apis'
import { apiAddFocusRecord } from '../../api/clock.js'

const ScheduleOneDay = ref([]);
const getSchedule = async()=>{
	await new Promise(resolve => setTimeout(resolve, 100));
	let res = await apiGetScheduleByuserId({userId:1,begin:selectLocalDate.value,end:selectLocalDate.value});
	// let res = await apiGetScheduleByuserId({userId:1,begin:'2025-11-01',end:'2025-12-30'});
	ScheduleOneDay.value = res.data;
	console.log(res.data);
}
getSchedule();

const todoClick = (startTime, endTime) =>{
	const res = calculateMinutesConsumed(startTime, endTime)
	setDuration(res);
}

const todoOperating = (userId) => {
	console.log(userId)
	// this.currentItem = item
	// this.currentIndex = index
	
	uni.showActionSheet({
	  itemList: ['修改', '删除'],
	  success: (res) => {
		const index = res.tapIndex
		if (index === 0) {
		  console.log("修改")
		  UpdateSchedule(userId)
		} else if (index === 1) {
		  uni.showModal({
		    title: '提示',
		    content: '确定删除吗？',
		    success: (res) => {
		        if (res.confirm) {
		  		apiDelSchedule(userId);
				getSchedule();
		        }
		    }
		  });
		}
	  },
	  fail: (res) => {
	    console.log('取消操作')
	  }
	})
}

//修改日程相关
const showForm = ref(false)
const updateData = ref(false)
const UpdateSchedule = async(id)=>{
	showForm.value = true
	let res = await apiGetScheduleById(id) 
	
	res.data.createTime = formatDateTimeArray(res.data.createTime).substring(0,10)
	res.data.startTime = formatDateTimeArray(res.data.startTime).substring(11)
	res.data.endTime =  formatDateTimeArray(res.data.endTime).substring(11)
	updateData.value = res.data
	console.log(updateData.value)
}


// 计时器相关
const isRunning = ref(false)
const remainingSeconds = ref(1 * 60) // 默认25分钟
const selectedDuration = ref(1) // 分钟
const timerInterval = ref(null)
const canvasSize = ref(300)

// 当前日期
const currentDate = ref('')
const selectLocalDate = ref('')

// 待办事项数据
const todoItems = ref([
  {
    id: 1,
    title: '晨间阅读',
    description: '阅读专业书籍30页',
    startTime: '08:00',
    duration: 60,
    color: '#FFEED6',
    completed: true
  },
  {
    id: 2,
    title: '项目开发',
    description: '完成用户模块功能',
    startTime: '09:30',
    duration: 120,
    color: '#D6E4FF',
    completed: false
  },
  {
    id: 3,
    title: '团队会议',
    description: '周进度汇报',
    startTime: '14:00',
    duration: 45,
    color: '#E0F7FA',
    completed: false
  },
  {
    id: 4,
    title: '学习新框架',
    description: 'Vue3高级特性',
    startTime: '15:30',
    duration: 90,
    color: '#F1D6FF',
    completed: false
  },
  {
    id: 5,
    title: '健身锻炼',
    description: '健身房有氧运动',
    startTime: '18:00',
    duration: 60,
    color: '#D6FFE2',
    completed: false
  },
  {
    id: 6,
    title: '晚间学习',
    description: '算法题练习',
    startTime: '20:00',
    duration: 90,
    color: '#FFF0D6',
    completed: false
  }
])

// 时间轴
const timelineHours = ref([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21])

// 计算属性
// 格式化显示的时间
const formatScheduleTimeSimple = (timeArray) => {
	if (!timeArray || timeArray.length !== 5) {
		return '时间错误'
	}
	  
	  const [year, month, day, hour, minute] = timeArray
	  const formattedHour = String(hour).padStart(2, '0')
	  const formattedMinute = String(minute).padStart(2, '0')
	  
	  return `${formattedHour}:${formattedMinute}`
}

const formattedTime = computed(() => {
      const minutes = Math.floor(remainingSeconds.value / 60)
      const seconds = remainingSeconds.value % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`    
})

// 计时器状态文本
const timerStatus = computed(() => {
  if (!isRunning.value && remainingSeconds.value === selectedDuration.value * 60) {
    return '准备开始'
  } else if (isRunning.value) {
    return '专注中...'
  } else {
    return '已暂停'
  }
})

// 生命周期
onMounted(() => {
  setCurrentDate()
  initCanvas()
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

// 方法
// 设置当前日期
const setCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  let month = now.getMonth() + 1
  let day = now.getDate()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[now.getDay()]
  currentDate.value = `${year}年${month}月${day}日 星期${weekday}`
  month = month.toString().padStart(2, '0')
  day = day.toString().padStart(2, '0')
  selectLocalDate.value = `${year}-${month}-${day}`
  // console.log(selectLocalDate.value)
}

// 初始化画布
const initCanvas = () => {
  const ctx = uni.createCanvasContext('progressCanvas')
  drawProgress(ctx, 0)
}

// 绘制进度条
const drawProgress = (ctx, progress) => {
  const center = canvasSize.value / 2
  const radius = canvasSize.value / 2 - 10
  const startAngle = -Math.PI / 2
  const endAngle = startAngle + 2 * Math.PI * progress
  
  // 清除画布
  ctx.clearRect(0, 0, canvasSize.value, canvasSize.value)
  
  // 绘制背景圆环
  ctx.beginPath()
  ctx.arc(center, center, radius, 0, 2 * Math.PI)
  ctx.setStrokeStyle('#EEEEEE')
  ctx.setLineWidth(12)
  ctx.stroke()
  
  // 绘制进度圆环
  ctx.beginPath()
  ctx.arc(center, center, radius, startAngle, endAngle)
  ctx.setStrokeStyle('#4CAF50')
  ctx.setLineWidth(12)
  ctx.setLineCap('round')
  ctx.stroke()
  
  ctx.draw()
}

// 切换计时器状态
const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

// 开始计时
const startTimer = () => {
  if (remainingSeconds.value <= 0) return
  
  isRunning.value = true
  
  timerInterval.value = setInterval(() => {
    remainingSeconds.value--
    
    // 更新进度条
    const progress = 1 - (remainingSeconds.value / (selectedDuration.value * 60))
    const ctx = uni.createCanvasContext('progressCanvas')
    drawProgress(ctx, progress)
    
    // 计时结束
    if (remainingSeconds.value <= 0) {
      timerComplete()
    }
  }, 1000)
}

// 暂停计时
const pauseTimer = () => {
  isRunning.value = false
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

// 重置计时器
const resetTimer = () => {
  pauseTimer()
  remainingSeconds.value = selectedDuration.value * 60
  const ctx = uni.createCanvasContext('progressCanvas')
  drawProgress(ctx, 0)
}

// 计时完成
const timerComplete = () => {
  const userId = 1
  const duration = selectedDuration.value
  apiAddFocusRecord({userId,duration})
  console.log(userId, duration)
  pauseTimer()
  uni.showModal({
    title: '专注完成',
    content: '恭喜您完成了一次专注！用时'+duration+'分钟',
    showCancel: false,
    success: () => {
      resetTimer()
    }
  })
}

// 设置专注时长
const setDuration = (minutes) => {
  selectedDuration.value = minutes
  resetTimer()
}

// 计算待办事项在列表中的位置
const calculatePosition = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  // 从8:00开始，每个小时60px高度
  const hourOffset = (hours - 8) * 60
  const minuteOffset = (minutes / 60) * 60
  return hourOffset + minuteOffset
}

// 计算待办事项的高度
const calculateHeight = (duration) => {
  // 每分钟1px高度
  return duration
}

// 格式化时间显示
const formatTime = (timeString) => {
  return timeString
}

// 改变待办
const selectTodo = (Schedule) => {
  uni.showModal({
    content: `${Schedule.content}\n时长: ${calculateTimeConsumed(Schedule.startTime, Schedule.endTime)}\n`,
    confirmText: Schedule.status ? '标记未完成' : '标记完成',
    cancelText: '关闭',
    success: (res) => {
      if (res.confirm) {
		  apiStatusSchedule({id:Schedule.id,status:Schedule.status ? 0:1})
		  .then(response =>{
		  	if(response.code == 1){
		  		Schedule.status = Schedule.status ? 0:1
				getSchedule()
		  	}else{
		  		uni.showToast({
		  		  title: '修改失败',
		  		  icon: 'none'
		  		})
		  	}
		  })
      }
    }
  })
}

const calculateTimeConsumed = (startTime, endTime) => {
  // 参数验证
  if (!Array.isArray(startTime) || !Array.isArray(endTime) || 
      startTime.length < 5 || endTime.length < 5) {
    return '0分钟';
  }
  
  try {
    // 创建Date对象（月份需要减1）
    const start = new Date(
      startTime[0], 
      startTime[1] - 1, 
      startTime[2], 
      startTime[3], 
      startTime[4]
    );
    
    const end = new Date(
      endTime[0], 
      endTime[1] - 1, 
      endTime[2], 
      endTime[3], 
      endTime[4]
    );
    
    // 计算时间差（毫秒）
    const diffMs = end - start;
    
    // 检查时间差是否有效
    if (diffMs < 0) {
      return '时间异常';
    }
    
    // 计算总分钟数
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    
    // 计算小时和分钟（因为是一天内数据，不需要计算天）
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    // 格式化输出 - 优化版：小时或分钟为0则不显示
    if (hours > 0 && minutes > 0) {
	  // console.log(hours, minutes)
      return `${hours}小时${minutes}分钟`;
    } else if (hours > 0) {
      return `${hours}小时`;
    } else if (minutes > 0) {
      return `${minutes}分钟`;
    } else {
      return '0分钟';
    }
  } catch (error) {
    console.error('计算时间消耗时出错:', error);
    return '计算错误';
  }
}

const calculateMinutesConsumed = (startTime, endTime) => {
  // 参数验证
  if (!Array.isArray(startTime) || !Array.isArray(endTime)) {
    console.warn('参数不是数组');
    return 0;
  }
  
  if (startTime.length < 5 || endTime.length < 5) {
    console.warn('时间数组长度不足');
    return 0;
  }
  
  try {
    // 创建Date对象（月份需要减1）
    const start = new Date(
      startTime[0], 
      startTime[1] - 1, 
      startTime[2], 
      startTime[3], 
      startTime[4]
    );
    
    const end = new Date(
      endTime[0], 
      endTime[1] - 1, 
      endTime[2], 
      endTime[3], 
      endTime[4]
    );
    
    // 验证日期是否有效
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.warn('无效的日期时间');
      return 0;
    }
    
    // 计算时间差（毫秒）
    const diffMs = end - start;
    
    // 检查时间差是否有效
    if (diffMs < 0) {
      console.warn('结束时间早于开始时间');
      return 0;
    }
    
    // 计算总分钟数并返回
    return Math.floor(diffMs / (1000 * 60));
  } catch (error) {
    console.error('计算分钟数时出错:', error);
    return 0;
  }
}

// 添加新待办
const addNewTodo = () => {
  uni.showToast({
    title: '添加功能待实现',
    icon: 'none'
  })
}

function formatDateTimeArray(timeArray) {
  // 解构赋值
  const [year, month, day, hour, minute] = timeArray;
  
  // 补零函数
  const pad = (num) => num.toString().padStart(2, '0');
  
  // 格式化各个部分（月份需要+1，因为数组中的月份从0开始）
  const formattedYear = year.toString();
  const formattedMonth = pad(month); // 如果是0-11的月份，需要+1：pad(month + 1)
  const formattedDay = pad(day);
  const formattedHour = pad(hour);
  const formattedMinute = pad(minute);
  
  return `${formattedYear}-${formattedMonth}-${formattedDay}-${formattedHour}:${formattedMinute}`;
}
</script>

<style scoped>
.tip{
	color: gray;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	border-radius: 20rpx;
	top: 20rpx;
	gap: 10rpx;
}
	
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 计时器部分 */
.timer-section {
  height: 30vh;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
}

.timer-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding-top: 100rpx; */
  padding-bottom: 100rpx;
}

.circular-progress {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  margin-top: 100rpx;
}

.progress-canvas {
  width: 300rpx;
  height: 300rpx;
}

.timer-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-text {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.timer-status {
  font-size: 24rpx;
  color: #666;
}

.timer-controls {
  display: flex;
  gap: 30rpx;
  margin-bottom: 40rpx;
}

.control-btn {
  width: 200rpx;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  transition: all 0.3s;
}

.start-btn {
  background-color: #4CAF50;
  color: white;
}

.start-btn.active {
  background-color: #FF9800;
}

.reset-btn {
  background-color: #E0E0E0;
  color: #666;
}

.reset-btn:disabled {
  opacity: 0.5;
}

.time-presets {
  display: flex;
  gap: 30rpx;
}

.time-option {
  padding: 15rpx 30rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 30rpx;
  color: white;
  font-size: 26rpx;
  transition: all 0.3s;
}

.time-option.active {
  background-color: rgba(255, 255, 255, 0.4);
  font-weight: bold;
}

/* 待办事项部分 */
.todo-section {
  flex: 1;
  background-color: white;
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.section-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.current-date {
  font-size: 28rpx;
  color: #666;
}

.todo-list {
  flex: 1;
  position: relative;
}

.timeline {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
}

.timeline-hour {
  height: 60px;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
}

.hour-label {
  position: absolute;
  left: 0;
  top: -15rpx;
  font-size: 24rpx;
  color: #999;
  background-color: white;
  padding-right: 10rpx;
}

.todo-item {
  position: absolute;
  left: 20rpx;
  right: 20rpx;
  padding: 20rpx;
  z-index: 2;
  /* border-left: 8rpx solid; */
}

.todo-item-content {
  display: flex;
  padding-top: 20rpx;
  padding-bottom: 20rpx;
  border-radius: 15rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  margin-top: 20rpx;
  height: 100%;
}

.todo-time {
  width: 120rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.todo-index{
	font-size: 28rpx;
	font-weight: bold;
	justify-content: center;
	color: #333;
}

.todo-start {
  font-size: 22rpx;
  color: #666;
}

.todo-duration {
  font-size: 22rpx;
  color: #666;
  margin-top: 10rpx;
  margin-bottom: 10rpx;
}

.todo-info {
  flex: 1;
  padding-left: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.todo-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.todo-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

.todo-status {
  width: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  border: 2rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #ddd;
}

.status-icon.completed {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.add-todo-btn {
  margin-top: 30rpx;
  height: 100rpx;
  border: 2rpx dashed #ddd;
  border-radius: 15rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 28rpx;
}

.add-icon {
  font-size: 40rpx;
  margin-right: 15rpx;
}
</style>