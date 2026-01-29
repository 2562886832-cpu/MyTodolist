<template>

  <!-- 遮罩层（点击关闭） -->
  <view
    v-if="props.showForm"
    class="mask"
    @click="showFormChange()"
  />

  <!-- 半屏表单 -->
  <view class="half-screen-form" :class="{show:props.showForm}">
    <view class="form-header">修改日程</view>

    <form @submit="submit">
      <!-- 日程内容 -->
      <view class="form-item">
        <text class="label">日程内容</text>
        <input
          name="content"
          v-model="props.updateData.content"
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
	      :value="props.updateData.createTime"
	      @change="e=>props.updateData.createTime=e.detail.value"
	    >
	      <view class="picker">{{props.updateData.createTime|| '请选择开始时间'}}</view>
	    </picker>
	  </view>

      <!-- 开始时间 -->
      <view class="form-item">
        <text class="label">开始时间</text>
        <picker
          mode="time"
          :value="props.updateData.startTime"
          @change="e=>props.updateData.startTime=e.detail.value"
        >
          <view class="picker">{{props.updateData.startTime || '请选择开始时间'}}</view>
        </picker>
      </view>

      <!-- 结束时间 -->
      <view class="form-item">
        <text class="label">结束时间</text>
        <picker
          mode="time"
          :value="props.updateData.endTime"
          @change="e=>props.updateData.endTime=e.detail.value"
        >
          <view class="picker">{{props.updateData.endTime || '请选择结束时间'}}</view>
        </picker>
      </view>

      <!-- 是否提醒 -->
      <view class="form-item switch-item">
        <text class="label">是否提醒</text>
        <switch name="isReminded" :checked="props.updateData.isReminded" @change="e=>props.updateData.isReminded=e.detail.value" />
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" form-type="submit" type="primary" @click="$emit('getSchedule')">保存</button>
    </form>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { apiUpdateSchedule} from '../../api/apis'
const props = defineProps(['showForm','updateData'])
const emit = defineEmits(['update:showForm','getSchedule'])
// console.log(props.showForm)

function showFormChange(){
	emit('update:showForm', false) 
}
// 响应式数据
const showForm = ref(false)
const priorityArr = ref(['低', '中', '高'])

// 表单数据使用 reactive
// const form = reactive({
//   content: '',
//   priority: 1,
//   dayTime: '',
//   startTime: '',
//   endTime: '',
//   isReminded: false
// })

//计算今天日期（可以放在模板中使用）
const todayDate = computed(() => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

// 打开表单的方法
// const open = () => {
//   // 默认带当天日期
//   form.dayTime = todayDate.value
//   form.startTime = `09:00`
//   form.endTime = `10:00`
//   showForm.value = true
// }

// 优先级变化处理
// const onPriorityChange = (e) => {
//   form.priority = Number(e.detail.value)
// }

// 提交表单
const submit = () => {
  let { id, userId, content, status,createTime, startTime, endTime, remindTime, isReminded } = props.updateData
  startTime = createTime+'T'+startTime
  endTime = createTime+'T'+endTime
  createTime = startTime
  remindTime = startTime
  // const userId = 1
  // const status = 0
  
  if (!content || !startTime || !endTime) {
    uni.showToast({ title: '请完善信息', icon: 'none' })
    return
  }
  
  // 时间大小比较（同一天）
  if (startTime >= endTime) {
    uni.showToast({ title: '结束时间必须晚于开始时间', icon: 'none' })
    return
  }
  
  let res = apiUpdateSchedule({id, userId, content, status,createTime, startTime, endTime, remindTime, isReminded});
  console.log('提交数据', { id, userId, content, status,createTime, startTime, endTime, remindTime, isReminded })
  showFormChange()
  uni.showToast({ title: '保存成功' })
  
  resetAndClose()
}

// 重置表单并关闭
const resetAndClose = () => {
  // 重置表单数据
  props.updateData.content = ''
  props.updateData.startTime = ''
  props.updateData.endTime = ''
  props.updateData.isReminded = false
  
  // 关闭表单
  showForm.value = false
}

// 如果需要，可以导出给模板使用
defineExpose({
  submit,
  resetAndClose
})
</script>

<style scoped>

.circle-btn {
  /* 形状与尺寸 */
  width: 50px;
  height: 50px;
  border-radius: 50%; /* 关键属性：圆形 */
  
  /* 颜色与背景 */
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
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