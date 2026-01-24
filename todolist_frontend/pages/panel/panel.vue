<template>
  <view class="calendar-container">
    <!-- 年份和月份选择器 -->
    <view class="year-month-selector">
		<view class="year-selector">
		  <view class="selector-btn prev" @tap="previousYear">«</view>
		  <view class="year-display">{{ displayYear }}年</view>
		  <view class="selector-btn next" @tap="nextYear">»</view>
		</view>
      
      <view class="month-selector">
        <view class="selector-btn prev" @tap="previousMonth">‹</view>
        <view class="month-display">{{ displayMonth + 1 }}月</view>
        <view class="selector-btn next" @tap="nextMonth">›</view>
      </view>
      
      <!-- 快速跳转按钮 -->
      <view class="quick-actions">
        <view class="quick-btn" @tap="goToToday">今天</view>
        <view class="quick-btn" @tap="toggleMonthView">{{ isMonthView ? '年视图' : '月视图' }}</view>
      </view>
    </view>
    
    <!-- 月份导航（年视图显示） -->
    <view v-if="!isMonthView" class="year-view">
      <view class="year-months">
        <view 
          v-for="month in 12" 
          :key="month"
          class="month-item"
          :class="{ 'current-month': month === currentMonth + 1 }"
          @tap="switchToMonth(month - 1)"
        >
          <text class="month-name">{{ month }}月</text>
          <text class="month-days">{{ getDaysInMonth(displayYear, month - 1) }}天</text>
        </view>
      </view>
    </view>
    
    <!-- 日历主体部分 -->
    <view 
      v-if="isMonthView"
      ref="calendarRef"
      class="calendar"
      :style="calendarStyle"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- 星期标题 -->
      <view class="week-header">
        <view class="week-day" v-for="day in weekDays" :key="day">
          {{ day }}
        </view>
      </view>
      
      <!-- 日期网格 -->
      <view 
        class="date-grid"
        :style="{ 
          'grid-template-rows': `repeat(${displayWeekCount}, 1fr)`,
          'row-gap': weekGap + 'px',
          'height': gridHeight
        }"
      >
        <!-- 展开状态和下拉拉大状态显示全部日期 -->
        <template v-if="calendarState !== 1">
          <view 
            v-for="(date, index) in calendarDates"
            :key="index"
            class="date-cell"
            :class="{
              'current-month': date.month === displayMonth,
              'today': date.isToday,
              'selected': date.isSelected,
              'has-note': date.hasNote,
              'other-month': date.month !== displayMonth,
              'weekend': date.weekDay === 0 || date.weekDay === 6
            }"
            @tap="selectDate(date)"
          >
		  
			<view v-for="(d, index) in ScheduleList" :key="index">
			    <view 
			      v-if="d.createTime[0] == displayYear 
			            && d.createTime[1] == date.month+1 
			            && d.createTime[2] == date.day
			            && !showSchedule" 
			      class="schedule-dot"
			    ></view>
			  </view>

		  
            <view class="date-number">{{ date.day }}</view>
			
			<view v-if = "date.isToday"></view>
            <view v-if="date.isToday" class="today-indicator">今</view>
            <!-- 日期备注标记 -->
            <view v-if="date.hasNote" class="note-indicator"></view>
            <!-- 农历信息 -->
            <view v-if="showLunar && date.lunar" class="lunar-text">
              {{ date.lunar.isFirstDayOfMonth ? date.lunar.month + '月' : date.lunar.day }}
            </view>
            <!-- 节假日 -->
            <view v-if="date.holiday" class="holiday-text">{{ date.holiday }}</view>
			
			<view v-for="(d, index) in limitedData" :key="index">
				<view v-if="d.createTime[0] == displayYear 
				&& d.createTime[1] == date.month+1 
				&& d.createTime[2] == date.day
				&& showSchedule
				"	
				class="small-text"
				>
					{{d.content.length > 2 ? d.content.substring(0, 2) : d.content}}
				</view>
			</view>
			
			
          </view>
        </template>
        
        <!-- 收起状态只显示当前周的日期 -->
        <template v-else>
          <view 
            v-for="(date, index) in currentWeekDates"
            :key="index"
            class="date-cell"
            :class="{
              'current-month': date.month === displayMonth,
              'today': date.isToday,
              'selected': date.isSelected,
              'has-note': date.hasNote,
              'other-month': date.month !== displayMonth,
              'weekend': date.weekDay === 0 || date.weekDay === 6
            }"
            @tap="selectDate(date)"
          >
            <view class="date-number">{{ date.day }}</view>
            <view v-if="date.isToday" class="today-indicator">今</view>
            <!-- 日期备注标记 -->
            <view v-if="date.hasNote" class="note-indicator"></view>
          </view>
        </template>
      </view>
      
      <!-- 收起状态提示 -->
      <view v-if="calendarState === 1" class="collapsed-hint">
        <text class="hint-text">向下滑动展开完整日历</text>
        <view class="hint-arrow">↓</view>
      </view>
    </view>
	
	<view v-for="(d, index) in ScheduleList" :key="index">
		<view class="item-box"
			v-if="d.createTime[0] == selectYear
			&& d.createTime[1] == selectMonth
			&& d.createTime[2] == selectDay"
			:style="{ 
		      'top': showHeight,
			  'color': d.status == 1 ? 'gray' : 'black'
		    }"
		>
		<view>
			<checkbox-group @change="(e)=>handleCheckboxChange(d.id,e.detail.value.includes(d.id))">
				<label>
					<checkbox :value="d.id" 
								:checked="d.status==1?true:false "
								:color="'gray'"/>
				</label>
			</checkbox-group>
		</view>
			<view :style="{
				'text-decoration': d.status == 1 ? 'line-through' : 'none'
			}"
			@click="onUpdate(d.id)"
			>
				{{d.content}}
			</view>
		<view @click="onDelete(d.id)" 
			class="del" 
			:style="{
			  'color': d.status == 1 ? 'gray' : 'red'
			}">x</view>

		
		</view>
	</view>
	
    
    <!-- 选中的日期信息 -->
<!--    <view v-if="selectedDate" class="selected-info">
      <text class="info-title">选中日期</text>
      <text class="info-date">{{ formatSelectedDate(selectedDate) }}</text>
      <text v-if="selectedDate.lunar" class="info-lunar">
        农历 {{ selectedDate.lunar.year }}{{ selectedDate.lunar.animal }}年 
        {{ selectedDate.lunar.month }}{{ selectedDate.lunar.monthStr }} 
        {{ selectedDate.lunar.day }}{{ selectedDate.lunar.dayStr }}
      </text>
      <text v-if="selectedDate.holiday" class="info-holiday">{{ selectedDate.holiday }}</text>
      <text v-if="selectedDate.solarTerm" class="info-solarterm">{{ selectedDate.solarTerm }}</text>
    </view> -->
    
    <!-- 提示信息 -->
    <view class="hint" :class="{ 'show-hint': showHint }">
      {{ hintText }}
    </view>
    
	<listForm @getSchedule="getSchedule" :selectLocalDate="selectLocalDate" >
		
	</listForm>

	
    <!-- 操作按钮 -->
<!--    <view class="action-buttons">
      <view class="button-group">
        <button class="action-btn primary" @tap="addTestNote">添加测试备注</button>
        <button class="action-btn" @tap="resetCalendar">重置</button>
        <button class="action-btn" @tap="toggleLunar">{{ showLunar ? '隐藏农历' : '显示农历' }}</button>
      </view>
      <view class="button-group">
        <button class="action-btn" @tap="goToSpecificDate">跳转到指定日期</button>
        <button class="action-btn" @tap="showCurrentState">状态: {{ stateNames[calendarState] }}</button>
      </view>
    </view> -->
    
    <!-- 日期选择器模态框 -->
    <!-- <view v-if="showDatePicker" class="modal-overlay" @tap="closeDatePicker">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">选择日期</text>
          <view class="modal-close" @tap="closeDatePicker">×</view>
        </view>
        <view class="date-picker">
          <view class="picker-year">
            <view class="picker-btn" @tap="decrementPickerYear">‹</view>
            <text class="picker-value">{{ pickerYear }}年</text>
            <view class="picker-btn" @tap="incrementPickerYear">›</view>
          </view>
          <view class="picker-month">
            <view 
              v-for="month in 12" 
              :key="month"
              class="month-option"
              :class="{ 
                'selected': pickerYear === displayYear && month - 1 === displayMonth,
                'current': month === currentMonth + 1 && pickerYear === currentYear
              }"
              @tap="selectPickerMonth(month - 1)"
            >
              {{ month }}月
            </view>
          </view>
          <button class="confirm-btn" @tap="confirmDatePicker">确定</button>
        </view>
      </view>
    </view> -->
	
	<alterForm 
	:showForm="showForm" 
	:updateData="updateData"
	@update:showForm="showForm = $event"
	@getSchedule="getSchedule"></alterForm>
	<!-- <view @tap="test()">这是一个test</view> -->
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { apiGetScheduleByuserId, apiDelSchedule, apiStatusSchedule, apiGetScheduleById, apiAddSchedule } from '../../api/apis'

// const test = ()=>{
// 	let res = apiAddSchedule({userId:1, content:"污染", status:0, startTime:"2026-1-10T09:00", endTime:"2026-1-10T10:00", isReminded:false});
// 	console.log({userId:1, content:"污染", status:0, startTime:"2026-1-10T09:00", endTime:"2026-1-10T10:00", isReminded:false})
// 	console.log("test")
// }

const ScheduleList= ref([]);
const limitedData = ref([]);

const getSchedule = async()=>{
	await new Promise(resolve => setTimeout(resolve, 100));
	let res = await apiGetScheduleByuserId({userId:1,begin:'2026-01-01',end:'2026-01-30'});
	// let res = await apiGetScheduleByuserId({userId:1,begin:'2025-11-01',end:'2025-12-30'});
	ScheduleList.value = res.data;
	limitedData.value = copyWithLimit(ScheduleList, 3);
	console.log(res.data);
}
getSchedule();

const showForm = ref(false)
const updateData = ref(false)
const onUpdate = async(id)=>{
	showForm.value = true
	let res = await apiGetScheduleById(id) 
	
	res.data.createTime = formatDateTimeArray(res.data.createTime).substring(0,10)
	res.data.startTime = formatDateTimeArray(res.data.startTime).substring(11)
	res.data.endTime =  formatDateTimeArray(res.data.endTime).substring(11)
	updateData.value = res.data
	console.log(updateData.value)
}

function onDelete(id) {
    uni.showModal({
    title: '提示',
    content: '确定删除吗？',
    success: (res) => {
        if (res.confirm) {
		apiDelSchedule(id);
		console.log(id);
		getSchedule();
        }
    }
  });
}


let status = null
let alterStatus = null
function handleCheckboxChange(value, checked){
	status = checked ? 1:0
	apiStatusSchedule({id:value,status})
	getSchedule();
	// console.log(`值: ${value}, 选中状态: ${status}`);
}

//数据限制函数
function copyWithLimit(tasksRef, maxPerDay = 3) {
  // 获取ref的实际值
  const tasks = tasksRef.value;
  
  // 用于按天分组和计数的对象
  const dayCounts = {};
  const filteredTasks = [];
  
  // 遍历所有任务
  tasks.forEach(task => {
    // 从createTime数组中提取年月日（假设格式为[年, 月, 日, 时, 分]）
    const [year, month, day] = task.createTime;
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // 初始化该日期的计数器
    if (!dayCounts[dateKey]) {
      dayCounts[dateKey] = 0;
    }
    
    // 如果该日期的任务数量未达到限制
    if (dayCounts[dateKey] < maxPerDay) {
      // 创建只包含content和createTime的新对象
      const filteredTask = {
        content: task.content,
        createTime: [...task.createTime] // 使用展开运算符创建副本
      };
      
      filteredTasks.push(filteredTask);
      dayCounts[dateKey]++;
    }
    // 如果已经达到限制，跳过该任务
  });
  
  return filteredTasks;
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







//-------------------------------------------------------
// 星期标题
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 当前日期
const currentDate = ref(new Date())
const currentYear = ref(currentDate.value.getFullYear())
const currentMonth = ref(currentDate.value.getMonth())
const currentDay = ref(currentDate.value.getDate())

// 显示的年月
const displayYear = ref(currentYear.value)
const displayMonth = ref(currentMonth.value)

// 是否显示月视图
const isMonthView = ref(true)

// 是否显示农历
const showLunar = ref(false)

const showSchedule = ref(false)

// 日历数据
const calendarDates = ref([])

// 当前周的日期索引
const currentWeekIndex = ref(0)
const currentWeekDates = ref([])

// 触摸相关变量
const touchStartY = ref(0)
const touchMoveY = ref(0)
const isTouching = ref(false)
const calendarTranslateY = ref(0)
const lastTranslateY = ref(0)

// 日历状态
const calendarState = ref(0)
const stateNames = ['展开', '收起', '下拉拉大']

// 周间距
const weekGap = ref(8)

// 提示信息
const showHint = ref(false)
const hintText = ref('')

// 选中的日期
const selectedDate = ref(null)

// 有备注的日期
const notedDates = ref([])

// 日期选择器
const showDatePicker = ref(false)
const pickerYear = ref(currentYear.value)
const pickerMonth = ref(currentMonth.value)

// 节假日数据（示例）
const holidays = ref({
  '1-1': '元旦',
  '2-14': '情人节',
  '3-8': '妇女节',
  '5-1': '劳动节',
  '6-1': '儿童节',
  '10-1': '国庆节',
  '12-25': '圣诞节'
})

// 计算显示的行数
const displayWeekCount = computed(() => {
  if (calendarState.value === 1) {
    return 1
  }
  return Math.ceil(calendarDates.value.length / 7)
})


const showHeight = computed(()=>{
	if(calendarStyle.value.height=="200px"){
		return '-300rpx'
	}else{
		return '0rpx'
	}
})


// 计算网格高度
const gridHeight = computed(() => {
  if (calendarState.value === 1) {
    return '80px'
  }
  return 'auto'
})

// 日历样式计算属性
const calendarStyle = computed(() => {
  let style = {
    transition: isTouching.value ? 'none' : 'transform 0.3s ease, height 0.3s ease',
    transform: `translateY(${calendarTranslateY.value}px)`
  }
  
  if (calendarState.value === 1) {
    style.height = '200px'
  } else if (calendarState.value === 2) {
    style.height = `${400 + (displayWeekCount.value - 4) * 20}px`
  } else {
    style.height = '400px'
  }
  
  return style
})

// 获取指定月份的天数
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

// 生成指定年月的日历数据
const generateCalendar = (year, month) => {
  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // 获取当月第一天是星期几
  const firstDayWeek = firstDay.getDay()
  
  // 获取上个月最后一天
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  
  // 计算需要显示的上个月日期
  const calendar = []
  
  // 添加上个月的日期
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(year, month - 1, day)
    calendar.push(createDateObject(date, false))
  }
  
  // 添加当月的日期
  const today = new Date()
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    const isToday = date.toDateString() === today.toDateString()
    calendar.push(createDateObject(date, true, isToday))
  }
  
  // 添加下个月的日期，补满6行（42天）
  const nextMonthDays = 42 - calendar.length
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i)
    calendar.push(createDateObject(date, false))
  }
  
  // 计算每个日期的周索引
  let weekIndex = 0
  calendar.forEach((date, index) => {
    date.weekIndex = weekIndex
    if ((index + 1) % 7 === 0) {
      weekIndex++
    }
    
    // 标记今天所在的周索引
    if (date.isToday) {
      currentWeekIndex.value = date.weekIndex
    }
  })
  
  calendarDates.value = calendar
  updateCurrentWeekDates()
}

// 创建日期对象
const createDateObject = (date, isCurrentMonth, isToday = false) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const weekDay = date.getDay()
  
  // 检查是否是选中日期
  const isSelected = selectedDate.value && 
    selectedDate.value.year === year && 
    selectedDate.value.month === month && 
    selectedDate.value.day === day
  
  // 检查是否有备注
  const hasNote = notedDates.value.includes(`${year}-${month + 1}-${day}`)
  
  // 检查是否是节假日
  const holidayKey = `${month + 1}-${day}`
  const holiday = holidays.value[holidayKey]
  
  // 生成农历信息（简化版，实际项目中可以使用农历库）
  const lunar = showLunar.value ? generateSimpleLunar(date) : null
  
  return {
    year,
    month,
    day,
    weekDay,
    isToday,
    isSelected,
    hasNote,
    holiday,
    lunar,
    isCurrentMonth,
    weekIndex: 0
  }
}

// 生成简化版农历信息
const generateSimpleLunar = (date) => {
  // 这里应该是复杂的农历计算，这里只做演示
  const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', 
                      '七月', '八月', '九月', '十月', '冬月', '腊月']
  const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']
  
  // 这只是示例，实际农历需要复杂的计算
  const monthIndex = date.getMonth() % 12
  const dayIndex = (date.getDate() - 1) % 30
  
  return {
    month: lunarMonths[monthIndex],
    monthStr: '月',
    day: lunarDays[dayIndex],
    dayStr: '',
    year: '甲子',
    animal: '鼠',
    isFirstDayOfMonth: dayIndex === 0
  }
}

// 更新当前周的日期数据
const updateCurrentWeekDates = () => {
  currentWeekDates.value = calendarDates.value.filter(date => date.weekIndex === currentWeekIndex.value)
}

// 选中日
const selectDay = ref(new Date().getDate())
const selectMonth = ref(new Date().getMonth()+1)
const selectYear = ref(new Date().getFullYear())
let selectLocalDate = selectYear.value+'-'+selectMonth.value.toString().padStart(2, '0')+'-'+selectDay.value.toString().padStart(2, '0')
// 选择日期
const selectDate = (date) => {
  // 重置所有日期的选中状态
  calendarDates.value.forEach(d => {
    d.isSelected = false
  })
  
  currentWeekDates.value.forEach(d => {
    d.isSelected = false
  })
  
  // 设置当前选中日期
  date.isSelected = true
  selectedDate.value = date
  
  // 如果选中的不是当前月份的日期，切换到该月份
  if (date.month !== displayMonth.value || date.year !== displayYear.value) {
    displayYear.value = date.year
    displayMonth.value = date.month
    generateCalendar(displayYear.value, displayMonth.value)
  }
  
  showHintMessage(`选中日期：${date.year}年${date.month + 1}月${date.day}日`)
  selectDay.value = date.day
  selectMonth.value = date.month+1
  selectYear.value = date.year
  selectLocalDate = selectYear.value+'-'+selectMonth.value.toString().padStart(2, '0')+'-'+selectDay.value.toString().padStart(2, '0')
  // console.log(selectLocalDate)
}


// 格式化选中日期显示
const formatSelectedDate = (date) => {
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekDay = new Date(date.year, date.month, date.day).getDay()
  return `${date.year}年${date.month + 1}月${date.day}日 ${weekDays[weekDay]}`
}

// 切换月份视图
const toggleMonthView = () => {
  isMonthView.value = !isMonthView.value
  showHintMessage(isMonthView.value ? '切换到月视图' : '切换到年视图')
}

// 切换到指定月份
const switchToMonth = (month) => {
  displayMonth.value = month
  isMonthView.value = true
  generateCalendar(displayYear.value, displayMonth.value)
  showHintMessage(`切换到${displayYear.value}年${month + 1}月`)
}

// 上一年
const previousYear = () => {
  displayYear.value -= 1
  generateCalendar(displayYear.value, displayMonth.value)
  showHintMessage(`${displayYear.value}年`)
}

// 下一年
const nextYear = () => {
  displayYear.value += 1
  generateCalendar(displayYear.value, displayMonth.value)
  showHintMessage(`${displayYear.value}年`)
}

// 上个月
const previousMonth = () => {
  if (displayMonth.value === 0) {
    displayMonth.value = 11
    displayYear.value -= 1
  } else {
    displayMonth.value -= 1
  }
  generateCalendar(displayYear.value, displayMonth.value)
  showHintMessage(`${displayYear.value}年${displayMonth.value + 1}月`)
}

// 下个月
const nextMonth = () => {
  if (displayMonth.value === 11) {
    displayMonth.value = 0
    displayYear.value += 1
  } else {
    displayMonth.value += 1
  }
  generateCalendar(displayYear.value, displayMonth.value)
  showHintMessage(`${displayYear.value}年${displayMonth.value + 1}月`)
}

// 回到今天
const goToToday = () => {
  displayYear.value = currentYear.value
  displayMonth.value = currentMonth.value
  generateCalendar(displayYear.value, displayMonth.value)
  showHintMessage('回到今天')
}

// 跳转到指定日期
const goToSpecificDate = () => {
  pickerYear.value = displayYear.value
  pickerMonth.value = displayMonth.value
  showDatePicker.value = true
}

// 关闭日期选择器
const closeDatePicker = () => {
  showDatePicker.value = false
}

// 减少选择器年份
const decrementPickerYear = () => {
  pickerYear.value -= 1
}

// 增加选择器年份
const incrementPickerYear = () => {
  pickerYear.value += 1
}

// 选择选择器月份
const selectPickerMonth = (month) => {
  pickerMonth.value = month
}

// 确认日期选择
const confirmDatePicker = () => {
  displayYear.value = pickerYear.value
  displayMonth.value = pickerMonth.value
  isMonthView.value = true
  generateCalendar(displayYear.value, displayMonth.value)
  showDatePicker.value = false
  showHintMessage(`跳转到${displayYear.value}年${displayMonth.value + 1}月`)
}

// 切换农历显示
const toggleLunar = () => {
  showLunar.value = !showLunar.value
  generateCalendar(displayYear.value, displayMonth.value)
}

// 触摸事件处理
const handleTouchStart = (e) => {
  if (!isMonthView.value) return
  
  isTouching.value = true
  touchStartY.value = e.touches[0].clientY
  touchMoveY.value = e.touches[0].clientY
  console.log("滑动")
}

const handleTouchMove = (e) => {
  if (!isMonthView.value || !isTouching.value) return
  
  const touchY = e.touches[0].clientY
  const deltaY = touchY - touchMoveY.value
  touchMoveY.value = touchY
  
  if (calendarState.value === 0) {
    calendarTranslateY.value = lastTranslateY.value + deltaY
  } else if (calendarState.value === 1) {
    if (deltaY > 0) {
      calendarTranslateY.value = lastTranslateY.value + deltaY
    }
  } else if (calendarState.value === 2) {
    if (deltaY < 0) {
      calendarTranslateY.value = lastTranslateY.value + deltaY
    }
  }
  
  // 限制滑动范围
  if (calendarState.value === 0) {
    if (calendarTranslateY.value < -150) calendarTranslateY.value = -150
    if (calendarTranslateY.value > 100) calendarTranslateY.value = 100
  } else if (calendarState.value === 1) {
    if (calendarTranslateY.value > 0) calendarTranslateY.value = 0
  } else if (calendarState.value === 2) {
    if (calendarTranslateY.value < 0) calendarTranslateY.value = 0
  }
}

const handleTouchEnd = () => {
  if (!isMonthView.value) return
  
  isTouching.value = false
  const deltaY = touchMoveY.value - touchStartY.value
  
  if (calendarState.value === 0) {
    if (deltaY < -30) {
      switchToState(1)
      showHintMessage('日历已收起，只显示当前周，向下滑动可展开')
    } else if (deltaY > 30) {
      switchToState(2)
      showHintMessage('日历已拉大，向上滑动可恢复')
	  showSchedule.value = true
    } else {
      switchToState(0)
    }
  } else if (calendarState.value === 1) {
    if (deltaY > 30) {
      switchToState(0)
      showHintMessage('日历已展开')
    } else {
      switchToState(1)
    }
  } else if (calendarState.value === 2) {
    if (deltaY < -30) {
      switchToState(0)
      showHintMessage('日历已恢复')
	  showSchedule.value = false
    } else {
      switchToState(2)
    }
  }
}

// 切换到指定状态
const switchToState = (state) => {
  calendarState.value = state
  
  if (state === 0) {
    calendarTranslateY.value = 0
    weekGap.value = 8
  } else if (state === 1) {
    calendarTranslateY.value = -150
    weekGap.value = 8
  } else if (state === 2) {
    calendarTranslateY.value = 0
    weekGap.value = 40
  }
  
  lastTranslateY.value = calendarTranslateY.value
}

// 显示提示信息
const showHintMessage = (message) => {
  hintText.value = message
  showHint.value = true
  
  setTimeout(() => {
    showHint.value = false
  }, 2000)
}

// 添加测试备注
const addTestNote = () => {
  const year = displayYear.value
  const month = displayMonth.value + 1
  
  for (let i = 0; i < 3; i++) {
    const randomDay = Math.floor(Math.random() * 28) + 1
    const dateKey = `${year}-${month}-${randomDay}`
    
    if (!notedDates.value.includes(dateKey)) {
      notedDates.value.push(dateKey)
    }
  }
  
  generateCalendar(displayYear.value, displayMonth.value)
  showHintMessage('已添加测试备注到随机日期')
}

// 重置日历
const resetCalendar = () => {
  calendarState.value = 0
  calendarTranslateY.value = 0
  lastTranslateY.value = 0
  weekGap.value = 8
  notedDates.value = []
  displayYear.value = currentYear.value
  displayMonth.value = currentMonth.value
  selectedDate.value = null
  
  generateCalendar(displayYear.value, displayMonth.value)
  showHintMessage('日历已重置')
}

// 显示当前状态
const showCurrentState = () => {
  showHintMessage(`当前日历状态: ${stateNames[calendarState.value]}`)
}

// 监听年月变化
watch([displayYear, displayMonth], () => {
  generateCalendar(displayYear.value, displayMonth.value)
})

// 监听农历显示开关
watch(showLunar, () => {
  generateCalendar(displayYear.value, displayMonth.value)
})

// 初始化
onMounted(() => {
  generateCalendar(displayYear.value, displayMonth.value)
  showHintMessage('欢迎使用通用日历！可切换年月，支持多种视图模式')
})

</script>

<style lang="scss" scoped>
@import "../../common/style/panel.scss";
</style>