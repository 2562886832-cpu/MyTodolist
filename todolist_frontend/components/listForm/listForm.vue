<template>
  <!-- 触发按钮 -->
  <view class="safe-area-container">
	  <view class="trigger-box" v-if="!showForm">
	    <button class="circle-btn safe-area-btn" @click="open">+</button>
	  </view>
  </view>

  <!-- 遮罩层（点击关闭） -->
  <view
    v-if="showForm"
    class="mask"
    @click="showForm=false"
  />

  <!-- 半屏表单 -->
  <view class="half-screen-form" :class="{show:showForm}">
    <view class="form-header">新建日程 {{props.selectLocalDate}}</view>

    <form @submit="submit">
      <!-- 日程内容 -->
      <view class="form-item">
        <text class="label">日程内容</text>
        <input
          name="content"
          v-model="form.content"
          placeholder="请输入日程内容"
          maxlength="100"
        />
      </view>

<!--      优先级
      <view class="form-item">
        <text class="label">优先级</text>
        <picker name="priority" :value="form.priority" :range="priorityArr" @change="onPriorityChange">
          <view class="picker">{{priorityArr[form.priority]}}</view>
        </picker>
      </view> -->
	  
	  <view class="form-item">
	    <text class="label">日期</text>
	    <picker
	      mode="date"
	      :value="form.dayTime"
	      @change="e=>form.dayTime=e.detail.value"
	    >
	      <view class="picker">{{form.dayTime || '请选择开始时间'}}</view>
	    </picker>
	  </view>

      <!-- 开始时间 -->
      <view class="form-item">
        <text class="label">开始时间</text>
        <picker
          mode="time"
          :value="form.startTime"
          @change="e=>form.startTime=e.detail.value"
        >
          <view class="picker">{{form.startTime || '请选择开始时间'}}</view>
        </picker>
      </view>

      <!-- 结束时间 -->
      <view class="form-item">
        <text class="label">结束时间</text>
        <picker
          mode="time"
          :value="form.endTime"
          @change="e=>form.endTime=e.detail.value"
        >
          <view class="picker">{{form.endTime || '请选择结束时间'}}</view>
        </picker>
      </view>

      <!-- 是否提醒 -->
      <view class="form-item switch-item">
        <text class="label">是否提醒</text>
        <switch name="isReminded" :checked="form.isReminded" @change="e=>form.isReminded=e.detail.value" />
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" form-type="submit" type="primary" @click="$emit('getSchedule')">保存</button>
    </form>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { apiAddSchedule } from '../../api/apis'
const props = defineProps(['selectLocalDate'])
const emit = defineEmits(['getSchedule'])

// 响应式数据
const showForm = ref(false)
const priorityArr = ref(['低', '中', '高'])

// 表单数据使用 reactive
const form = reactive({
  content: '',
  priority: 1,
  dayTime: '',
  startTime: '',
  endTime: '',
  isReminded: false
})

//计算今天日期（可以放在模板中使用）
const todayDate = computed(() => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

// 打开表单的方法
const open = () => {
  // 默认带当天日期
  form.dayTime = props.selectLocalDate
  form.startTime = `09:00`
  form.endTime = `10:00`
  showForm.value = true
}

// 优先级变化处理
const onPriorityChange = (e) => {
  form.priority = Number(e.detail.value)
}

// 提交表单
const submit = () => {
  let { content, dayTime, startTime, endTime, isReminded } = form
  startTime = dayTime+'T'+startTime
  endTime = dayTime+'T'+endTime
  const userId = 1
  const status = 0
  
  if (!content || !startTime || !endTime) {
    uni.showToast({ title: '请完善信息', icon: 'none' })
    return
  }
  
  // 时间大小比较（同一天）
  if (startTime >= endTime) {
    uni.showToast({ title: '结束时间必须晚于开始时间', icon: 'none' })
    return
  }
  
  console.log('提交数据', { userId, content, status, startTime, endTime, isReminded })
  let res = apiAddSchedule({userId, content, status, startTime, endTime, isReminded});
  uni.showToast({ title: '保存成功' })
  
  resetAndClose()
}

// 重置表单并关闭
const resetAndClose = () => {
  // 重置表单数据
  form.content = ''
  form.priority = 1
  form.startTime = ''
  form.endTime = ''
  form.isReminded = false
  
  // 关闭表单
  showForm.value = false
}

// 如果需要，可以导出给模板使用
defineExpose({
  open,
  submit,
  resetAndClose
})
</script>

<style scoped>
.safe-area-container {
  position: fixed;
  right: 10rpx;
  bottom: calc( 100rpx + env(safe-area-inset-bottom, 0px));
  bottom: calc( 100rpx + constant(safe-area-inset-bottom, 0px));
  /* z-index: 1000; */
}

.circle-btn.safe-area-btn {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #007AFF;
  color: white;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
}

	
/* 触发按钮 */
.trigger-box{
	padding: 32upx 40upx
}

/* 遮罩 */
.mask{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  z-index: 998;
}

/* 半屏抽屉 */
.half-screen-form{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 72vh;
  background: #fff;
  border-radius: 24upx 24upx 0 0;
  box-shadow: 0 -4upx 24upx rgba(0,0,0,.08);
  transform: translateY(100%);
  transition: transform .3s cubic-bezier(.4,0,.2,1);
  z-index: 999;
  display: flex;
  flex-direction: column;
}
.half-screen-form.show{transform: translateY(0)}

/* 顶部标题 */
.form-header{
  height: 100upx;
  line-height: 100upx;
  text-align: center;
  font-size: 34upx;
  font-weight: 500;
  color: #1a1a1a;
  border-bottom: 1upx solid #f0f0f0;
}

/* 表单区 */
form{
  flex: 1;
  overflow-y: auto;
  padding: 24upx 40upx 60upx;
}

/* 表单项 */
.form-item{margin-top: 36upx}
.label{
  display: block;
  font-size: 30upx;
  color: #333;
  margin-bottom: 16upx;
}

input,.picker{
  width: 100%;
  height: 88upx;
  line-height: 88upx;
  padding: 0 28upx;
  border: 2upx solid #e5e5e5;
  border-radius: 12upx;
  font-size: 32upx;
  box-sizing: border-box;
  transition: border-color .2s;
}
input:focus,.picker:focus{
  border-color: #2979ff;
}

.picker{color: #555}

/* switch 行 */
.switch-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 保存按钮 */
.submit-btn{
  margin-top: 60upx;
  height: 88upx;
  line-height: 88upx;
  font-size: 32upx;
  color: #fff;
  border-radius: 12upx;
  background: linear-gradient(135deg,#2979ff 0%,#4a90e2 100%);
  box-shadow: 0 4upx 16upx rgba(41,121,255,.25);
}
.submit-btn:active{opacity: .92}
</style>