<template>
  <view class="data-visualization">
    <!-- 标题 -->
<!--    <view class="header">
      <text class="title">数据统计报表</text>
    </view> -->

    <!-- 柱状图区域 -->
    <view class="chart-container">
      <view class="chart-header">
        <text class="chart-title">待办完成量</text>
        <view class="chart-time-selector">
          <view 
            class="time-option" 
            :class="{ active: columnTimeRange === 'week' }"
            @tap="changeColumnTimeRange('week')"
          >
            最近7日
          </view>
          <view 
            class="time-option" 
            :class="{ active: columnTimeRange === 'month' }"
            @tap="changeColumnTimeRange('month')"
          >
            今年
          </view>
        </view>
      </view>
      
      <!-- 柱状图统计卡片 -->
      <view class="stats-card">
        <view class="stat-item">
          <text class="stat-label">当前{{ columnTimeRange === 'week' ? '7日' : '12月' }}总计</text>
          <text class="stat-value">{{ columnTotal.toFixed(columnTimeRange === 'week' ? 1 : 2) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">平均值</text>
          <text class="stat-value">{{ columnAvg.toFixed(columnTimeRange === 'week' ? 1 : 2) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">峰值</text>
          <text class="stat-value">{{ columnMax.toFixed(columnTimeRange === 'week' ? 1 : 2) }}</text>
        </view>
      </view>
	  <view class="unit">单位（个）</view>
      
      <!-- 柱状图容器 - 周数据不滑动，月数据滑动 -->
      <scroll-view 
        v-if="columnTimeRange === 'month'" 
        class="chart-scroll-wrapper" 
        scroll-x="true" 
        show-scrollbar="true"
        :scroll-left="columnScrollLeft"
        @scroll="onColumnScroll"
      >
        <view class="chart-wrapper" :style="{ width: columnChartWidth }">
          <qiun-data-charts 
            type="column"
            :chartData="columnData"
            :opts="columnOpts"
            canvasId="columnChart"
            :canvas2d="true"
          />
        </view>
      </scroll-view>
      
      <!-- 周数据直接显示，不滑动 -->
      <view v-else class="chart-wrapper week-chart">
        <qiun-data-charts 
          type="column"
          :chartData="columnData"
          :opts="columnWeekOpts"
          canvasId="columnWeekChart"
          :canvas2d="true"
        />
      </view>
      
      <!-- x轴标签 - 最近7日显示完整日期 -->
<!--     <view class="x-axis-labels" v-if="columnData.categories && columnData.categories.length > 0">
        <text 
          v-for="(label, index) in columnData.categories" 
          :key="index" 
          class="x-axis-label"
          :style="{ width: `${100 / columnData.categories.length}%` }"
        >
          {{ label }}
        </text>
      </view> -->
    </view>

    <!-- 折线图区域 -->
    <view class="chart-container">
      <view class="chart-header">
        <text class="chart-title">专注时长</text>
        <view class="chart-time-selector">
          <view 
            class="time-option" 
            :class="{ active: lineTimeRange === 'week' }"
            @tap="changeLineTimeRange('week')"
          >
            最近7日
          </view>
          <view 
            class="time-option" 
            :class="{ active: lineTimeRange === 'month' }"
            @tap="changeLineTimeRange('month')"
          >
            今年
          </view>
        </view>
      </view>
      
      <!-- 折线图统计卡片 -->
      <view class="stats-card">
        <view class="stat-item">
          <text class="stat-label">最近{{ lineTimeRange === 'week' ? '7日' : '一年' }}总计</text>
          <text class="stat-value">{{ lineTotal }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">平均值</text>
          <text class="stat-value">{{ lineAvg.toFixed(0) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">峰值</text>
          <text class="stat-value">{{ lineMax }}</text>
        </view>
      </view>
	  <view class="unit">单位（分钟）</view>
      
      <!-- 折线图容器 - 周数据不滑动，月数据滑动 -->
      <scroll-view 
        v-if="lineTimeRange === 'month'" 
        class="chart-scroll-wrapper" 
        scroll-x="true" 
        show-scrollbar="true"
        :scroll-left="lineScrollLeft"
        @scroll="onLineScroll"
      >
        <view class="chart-wrapper" :style="{ width: lineChartWidth }">
          <qiun-data-charts 
            type="line"
            :chartData="lineData"
            :opts="lineOpts"
            canvasId="lineChart"
            :canvas2d="true"
          />
        </view>
      </scroll-view>
      
      <!-- 周数据直接显示，不滑动 -->
      <view v-else class="chart-wrapper week-chart">
        <qiun-data-charts 
          type="line"
          :chartData="lineData"
          :opts="lineWeekOpts"
          canvasId="lineWeekChart"
          :canvas2d="true"
        />
      </view>
      
      <!-- x轴标签 - 最近7日显示完整日期 -->
<!--      <view class="x-axis-labels" v-if="lineData.categories && lineData.categories.length > 0">
        <text 
          v-for="(label, index) in lineData.categories" 
          :key="index" 
          class="x-axis-label"
          :style="{ width: `${100 / lineData.categories.length}%` }"
        >
          {{ label }}
        </text>
      </view> -->
    </view>
  </view>
</template>


<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { apiCloumnChartsWeek, apiCloumnChartsYear, apiLineChartsWeek, apiLineChartsYear } from '../../api/data.js'

// 独立的时间范围状态
const columnTimeRange = ref('week') // 柱状图时间范围
const lineTimeRange = ref('week')   // 折线图时间范围

// 滚动位置
const columnScrollLeft = ref(0)
const lineScrollLeft = ref(0)

// 柱状图数据
const columnData = ref({
  categories: [],
  series: []
})

// 折线图数据
const lineData = ref({
  categories: [],
  series: []
})

// 统计数据
const columnTotal = ref(0)
const columnAvg = ref(0)
const columnMax = ref(0)

const lineTotal = ref(0)
const lineAvg = ref(0)
const lineMax = ref(0)

// 计算月数据图表宽度
const columnChartWidth = computed(() => {
  // 每月数据：12个点，每个点120rpx宽度
  return '1440rpx' // 12 * 120 = 1440
})

const lineChartWidth = computed(() => {
  // 每月数据：12个点，每个点120rpx宽度
  return '1440rpx' // 12 * 120 = 1440
})

// 柱状图配置 - 月数据（横向滚动）
const columnOpts = ref({
  color: ["#1890FF"],
  padding: [20, 20, 10, 20],
  enableScroll: false,
  legend: {
    show: false
  },
  xAxis: {
    disableGrid: false,
    axisLine: false,
    axisLineColor: '#E8E8E8',
    fontColor: '#666',
    fontSize: 8,
	// itemCount: 12,  // 确保显示全部12个数据点
 //    labelCount: 12
  },
  yAxis: {
    data: [{ min: 0 }],
    gridType: "solid",
    dashLength: 4,
    axisLine: true,
    splitLine: {
      lineType: "dash",
      dashLength: 4,
      lineColor: '#E8E8E8'
    },
    format: (val) => {
      return val % 10 === 0 ? val : ''
    }
  },
  extra: {
    column: {
      type: "group",
      width: 25,
      categoryGap: 20,
      barBorderRadius: 4,
      linearType: "custom"
    }
  },
  animation: true
})

// 柱状图配置 - 周数据（不滚动）
const columnWeekOpts = ref({
  color: ["#1890FF"],
  padding: [20, 20, 10, 20],
  enableScroll: false,
  legend: {
    show: false
  },
  xAxis: {
    disableGrid: false,
    axisLine: false,
    axisLineColor: '#E8E8E8',
    fontColor: '#666',
    fontSize: 8,
    // labelCount: 7, // 显示所有7个标签
    // itemCount: 7   // 确保显示全部7个标签
  },
  yAxis: {
    data: [{ min: 0 }],
    gridType: "solid",
    dashLength: 4,
	splitNumber: 1,
    axisLine: {
    show: false
    },
    splitLine: {
      lineType: "solid",
      dashLength: 4,
      lineColor: '#E8E8E8'
    },
    format: (val) => {
      return val % 10 === 0 ? val : ''
    }
  },
  extra: {
    column: {
      type: "group",
      width: 30, // 稍微窄一点，确保7个柱子都能完整显示
      categoryGap: 12,
      barBorderRadius: 4,
      linearType: "custom"
    }
  },
  animation: true
})

// 折线图配置 - 月数据（横向滚动）
const lineOpts = ref({
  color: ["#52C41A"],
  padding: [20, 20, 10, 20],
  enableScroll: false,
  legend: {
    show: false
  },
  xAxis: {
    disableGrid: false,
    axisLine: false,
    axisLineColor: '#E8E8E8',
    fontColor: '#666',
    fontSize: 8,
    // labelCount: 12
  },
  yAxis: {
    data: [{ min: 0 }],
    gridType: "solid",
    dashLength: 4,
    axisLine: false,
    splitLine: {
      lineType: "solid",
      dashLength: 4,
      lineColor: '#E8E8E8'
    },
    format: (val) => {
      return val % 200 === 0 ? val : ''
    }
  },
  extra: {
    line: {
      type: "curve",
      width: 3,
      activeType: "point",
      pointShape: "circle",
      pointSize: 6
    }
  },
  animation: true
})

// 折线图配置 - 周数据（不滚动）
const lineWeekOpts = ref({
  color: ["#52C41A"],
  padding: [20, 20, 10, 20],
  enableScroll: false,
  legend: {
    show: false
  },
  xAxis: {
    disableGrid: false,
    axisLine: false,
    axisLineColor: '#E8E8E8',
    fontColor: '#666',
    fontSize: 8,
    // labelCount: 7, // 显示所有7个标签
    // itemCount: 7   // 确保显示全部7个标签
  },
  yAxis: {
      data: [{ min: 0 }],
      gridType: "solid",
      axisLine: true,
      axisLineColor: '#E8E8E8',
      axisLineType: 'solid',
      axisLineWidth: 1,
      splitLine: {
        show: false, // 关闭y轴的横向网格线
      },
      format: (val) => {
        return val % 100 === 0 ? val : ''
      }
    },
  extra: {
    line: {
      type: "curve",
      width: 3,
      activeType: "point",
      pointShape: "circle",
      pointSize: 6
    }
  },
  animation: true
})

// 生成最近7天的日期数组，格式为 "MM-dd"
const generateRecent7Days = () => {
  const dates = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i) // 从6天前到今天
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    dates.push(`${month}-${day}`)
  }
  
  return dates
}

const CloumnChartsWeek = async()=>{
	// await new Promise(resolve => setTimeout(resolve, 100));
	let res = await apiCloumnChartsWeek({status:1, userId:1});
	// let res = await apiGetScheduleByuserId({userId:1,begin:'2025-11-01',end:'2025-12-30'});
	return res.data
}

// 生成最近7日的柱状图数据
const generateColumnWeekData = async () => {
  try {
    // 获取实际API数据
    const res = await CloumnChartsWeek();
    console.log('API返回数据:', res);
    
    // 假设res是你提供的数据结构：包含7个对象的数组
    const apiData = res; // 或 res.data，根据实际API返回结构调整
    
    const recentDates = generateRecent7Days();
    const salesData = [];
    
    let total = 0;
    let max = 0;
    
    // 使用实际API数据，而不是随机生成
    for (let i = 0; i < apiData.length; i++) {
      const item = apiData[i];
      
      // 这里假设item.count就是销售额数据
      // 如果count单位不同，可能需要转换，比如：const value = item.count * 1000 (如果count单位是千)
      const value = item.count; // 根据实际情况调整
      
      salesData.push(value);
      total += value;
      
      if (value > max) {
        max = value;
      }
      
      // 如果你需要验证dateTime的对应关系，可以打印出来
      console.log(`日期 ${recentDates[i]}: count = ${item.count}, dateTime = ${item.dateTime}`);
    }
    
    // 更新柱状图数据
    columnData.value = {
      categories: recentDates,
      series: [{
        name: '完成量',
        data: salesData,
        color: '#1890FF'
      }]
    };
    
    console.log('柱状图数据:', columnData.value);
    
    // 更新统计数据
    columnTotal.value = total;
    columnAvg.value = total / apiData.length;
    columnMax.value = max;
	// columnWeekOpts.value.yAxis.data[0].max = max
    
  } catch (error) {
    console.error('获取柱状图数据失败:', error);
    // 可以在这里添加错误处理，比如回退到模拟数据
  }
};

const CloumnChartsYear = async()=>{
	// await new Promise(resolve => setTimeout(resolve, 100));
	let res = await apiCloumnChartsYear({status:1, userId:1});
	// let res = await apiGetScheduleByuserId({userId:1,begin:'2025-11-01',end:'2025-12-30'});
	return res.data
}

// 生成一年12个月的柱状图数据
const generateColumnMonthData = async () => {
  try {
    // 调用API获取月数据
    const res = await CloumnChartsYear();
    const apiData = res; // 假设返回的数据在res.data中
	console.log(res)
    
    // 如果后端数据返回格式为12个月的数据数组
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const salesData = [];
    
    let total = 0;
    let max = 0;
    
    // 使用实际API数据
    for (let i = 0; i < apiData.length && i < 12; i++) {
      const item = apiData[i];
      
      // 假设item.count就是销售额数据
      // 如果需要单位转换，可以在这里处理
      const value = item.count;
      
      salesData.push(value);
      total += value;
      
      if (value > max) {
        max = value;
      }
      
      // 可以打印调试信息
      console.log(`月份 ${months[i]}: count = ${item.count}, dateTime = ${item.dateTime}`);
    }
    
    // 如果API返回的数据不足12个月，用0填充
    if (salesData.length < 12) {
      for (let i = salesData.length; i < 12; i++) {
        salesData.push(0);
      }
    }
    
    // 更新柱状图数据
    columnData.value = {
      categories: months,
      series: [{
        name: '完成量',
        data: salesData,
        color: '#1890FF'
      }]
    };
    
    console.log('月柱状图数据:', columnData.value);
    
    // 更新统计数据
    columnTotal.value = total;
    columnAvg.value = (total / 12);
    columnMax.value = max;
    
  } catch (error) {
    console.error('获取月数据失败:', error);
  }
};


const LineChartsWeek = async()=>{
	// await new Promise(resolve => setTimeout(resolve, 100));
	let res = await apiLineChartsWeek({userId:1});
	// let res = await apiGetScheduleByuserId({userId:1,begin:'2025-11-01',end:'2025-12-30'});
	return res.data
}

// 获取最近7日的折线图数据
const generateLineWeekData = async () => {
  try {
    // 获取实际API数据
    const res = await LineChartsWeek(); // 假设这是获取用户数据的API
    
    // 假设res是你提供的数据结构：包含7个对象的数组
    const apiData = res; // 或 res.data，根据实际API返回结构调整
    
    const recentDates = generateRecent7Days();
    const userData = [];
    
    let total = 0;
    let max = 0;
    
    // 使用实际API数据，而不是随机生成
    for (let i = 0; i < apiData.length; i++) {
      const item = apiData[i];
      
      // 这里假设item.count就是用户数据
      // 如果count单位不同，可能需要转换
      const value = item.count; // 根据实际情况调整
      
      userData.push(value);
      total += value;
      
      if (value > max) {
        max = value;
      }
      
    }
    
    // 更新折线图数据
    lineData.value = {
      categories: recentDates,
      series: [{
        name: '时长',
        data: userData,
        color: '#52C41A'
      }]
    };
    
    // 更新统计数据
    lineTotal.value = total;
    lineAvg.value = total / apiData.length;
    lineMax.value = max;
    
    // 如果需要更新y轴最大值配置
    // lineWeekOpts.value.yAxis.max = max; // 根据实际配置结构调整
    
  } catch (error) {
    console.error('获取折线图数据失败:', error);
    // 可以在这里添加错误处理，比如回退到模拟数据
  }
};


const LineChartsYear = async()=>{
	// await new Promise(resolve => setTimeout(resolve, 100));
	let res = await apiLineChartsYear({userId:1})
	// let res = await apiGetScheduleByuserId({userId:1,begin:'2025-11-01',end:'2025-12-30'});
	return res.data
}

// 获取一年12个月的折线图数据
const generateLineMonthData = async () => {
  try {
    // 调用API获取月数据
    const res = await LineChartsYear(); // 假设这是获取用户月数据的API
    const apiData = res; // 或 res.data，根据实际API返回结构调整
    
    // 月份标签
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const userData = [];
    
    let total = 0;
    let max = 0;
    
    // 使用实际API数据
    for (let i = 0; i < apiData.length && i < 12; i++) {
      const item = apiData[i];
      
      // 假设item.count就是用户数据
      // 如果需要单位转换，可以在这里处理
      const value = item.count;
      
      userData.push(value);
      total += value;
      
      if (value > max) {
        max = value;
      }
      
    }
    
    // 如果API返回的数据不足12个月，用0填充
    if (userData.length < 12) {
      for (let i = userData.length; i < 12; i++) {
        userData.push(0);
      }
    }
    
    // 更新折线图数据
    lineData.value = {
      categories: months,
      series: [{
        name: '时长',
        data: userData,
        color: '#52C41A'
      }]
    };
    
    // 更新统计数据
    lineTotal.value = total;
    lineAvg.value = (total / 12);
    lineMax.value = max;
    
  } catch (error) {
    console.error('获取月度折线图数据失败:', error);
    // 可以在这里添加错误处理，比如回退到模拟数据
  }
}

// 滚动事件处理
const onColumnScroll = (e) => {
  columnScrollLeft.value = e.detail.scrollLeft
}

const onLineScroll = (e) => {
  lineScrollLeft.value = e.detail.scrollLeft
}

// 切换柱状图时间范围
const changeColumnTimeRange = async (range) => {
  columnTimeRange.value = range
  if (range === 'week') {
    generateColumnWeekData()
	columnData.value.categories = []
	columnData.value.series = []
    columnScrollLeft.value = 0
  } else {
    generateColumnMonthData()
	columnData.value.categories = []
	columnData.value.series = []
    // 等待视图更新后，滚动到最右边
    await nextTick()
    // 设置一个大的scroll-left值，确保滚动到最右边
    // columnScrollLeft.value = 10000 // 这个值足够大，确保滚动到最右边
  }
}

// 切换折线图时间范围
const changeLineTimeRange = async (range) => {
  lineTimeRange.value = range
  if (range === 'week') {
    generateLineWeekData()
	lineData.value.categories = []
	lineData.value.series = []
    lineScrollLeft.value = 0
  } else {
    generateLineMonthData()
	lineData.value.categories = []
	lineData.value.series = []
    // 等待视图更新后，滚动到最右边
    await nextTick()
    // 设置一个大的scroll-left值，确保滚动到最右边
    // lineScrollLeft.value = 10000 // 这个值足够大，确保滚动到最右边
  }
}

// 初始化
onMounted(() => {
  generateColumnWeekData()
  generateLineWeekData()
})
</script>

<style lang="scss" scoped>
.data-visualization {
  padding: 20rpx;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
}

.header {
  margin-bottom: 30rpx;
  padding: 0 10rpx;
  
  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
    text-align: center;
  }
}

.chart-container {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  
  .chart-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }
  
  .chart-time-selector {
    display: flex;
    background: #f0f2f5;
    border-radius: 30rpx;
    padding: 4rpx;
    
    .time-option {
      padding: 10rpx 24rpx;
      font-size: 26rpx;
      color: #666;
      border-radius: 30rpx;
      transition: all 0.3s;
      
      &.active {
        background: #fff;
        color: #1890ff;
        font-weight: 500;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.stats-card {
  display: flex;
  justify-content: space-between;
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    
    .stat-label {
      font-size: 22rpx;
      color: #666;
      margin-bottom: 8rpx;
      text-align: center;
    }
    
    .stat-value {
      font-size: 28rpx;
      font-weight: 600;
      color: #1890ff;
    }
  }
}

// 滚动图表容器
.chart-scroll-wrapper {
  width: 100%;
  height: 400rpx;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  
  .chart-wrapper {
    height: 100%;
  }
}

// 周数据图表容器（不滚动）
.week-chart {
  width: 100%;
  height: 400rpx;
}

.x-axis-labels {
  display: flex;
  margin-top: 10rpx;
  overflow-x: hidden;
  
  .x-axis-label {
    font-size: 22rpx;
    color: #999;
    text-align: center;
    flex-shrink: 0;
    padding: 0 4rpx;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// 自定义滚动条样式
::-webkit-scrollbar {
  height: 8rpx;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4rpx;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4rpx;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

// 提示文字
.tip-text {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

// 响应式调整
@media (max-width: 750px) {
  .chart-wrapper,
  .week-chart {
    height: 350rpx !important;
  }
  
  .stat-value {
    font-size: 24rpx !important;
  }
  
  .stat-label {
    font-size: 20rpx !important;
  }
  
  .x-axis-label {
    font-size: 20rpx !important; // 稍微调大一点，确保日期可见
    padding: 0 2rpx !important;
  }
  
  .chart-time-selector {
    .time-option {
      padding: 8rpx 16rpx !important;
      font-size: 24rpx !important;
    }
  }
}
.unit {
    text-align: right;    /* 右对齐 */
    color: gray;          /* 灰色文字 */
	font-size: 6rpx;
}
</style>