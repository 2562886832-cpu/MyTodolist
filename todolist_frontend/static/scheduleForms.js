import { ref, reactive, computed } from 'vue'

export function useTaskForm() {
  // 响应式数据
  const showForm = ref(false)
  const priorityArr = ref(['低', '中', '高'])
  
  // 表单数据
  const form = reactive({
    content: '',
    priority: 1,
    startTime: '',
    endTime: '',
    isReminded: false
  })
  
  // 计算属性
  const todayDate = computed(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  })
  
  // 方法
  const open = () => {
    const today = todayDate.value
    form.startTime = `${today} 09:00`
    form.endTime = `${today} 10:00`
    showForm.value = true
  }
  
  const onPriorityChange = (e) => {
    form.priority = Number(e.detail.value)
  }
  
  const submit = () => {
    const { content, priority, startTime, endTime, isReminded } = form
    
    if (!content || !startTime || !endTime) {
      uni.showToast({ title: '请完善信息', icon: 'none' })
      return
    }
    
    if (startTime >= endTime) {
      uni.showToast({ title: '结束时间必须晚于开始时间', icon: 'none' })
      return
    }
    
    console.log('提交数据', { content, priority, startTime, endTime, isReminded })
    uni.showToast({ title: '保存成功' })
    
    resetAndClose()
  }
  
  const resetAndClose = () => {
    form.content = ''
    form.priority = 1
    form.startTime = ''
    form.endTime = ''
    form.isReminded = false
    showForm.value = false
  }
  
  // 返回所有需要的数据和方法
  return {
    showForm,
    priorityArr,
    form,
    todayDate,
    open,
    onPriorityChange,
    submit,
    resetAndClose
  }
}