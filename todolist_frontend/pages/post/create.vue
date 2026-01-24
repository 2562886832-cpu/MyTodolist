<template>
  <view class="page-container">
    <!-- 顶部导航栏 -->
<!--    <view class="nav-bar">
      <view class="nav-left" @tap="goBack">
        <text class="iconfont icon-back">取消</text>
      </view>
      <view class="nav-title">发布帖子</view>
      <view class="nav-right"></view>
    </view> -->

    <!-- 主内容区域 -->
    <scroll-view scroll-y class="main-content" :style="{ height: contentHeight + 'px' }">
      <!-- 文本输入和图片区域 -->
      <view class="editor-container">
        <!-- 文本输入区 -->
        <view class="text-input-area">
          <textarea 
            class="post-content" 
            v-model="postContent" 
            placeholder="分享你的想法、经验或问题..." 
            maxlength="1000"
            placeholder-style="color: #999;"
            :show-confirm-bar="false"
            :style="{ height: textAreaHeight + 'px' }"
            @input="onContentInput"
          />
          <view class="word-count">{{ postContent.length }}/1000</view>
        </view>

        <!-- 内嵌图片上传区域 -->
        <view class="inline-image-section">
          <view class="image-grid">
            <!-- 已上传的图片 -->
            <view 
              v-for="(image, index) in uploadedImages" 
              :key="index" 
              class="image-item"
              @tap="previewImage(index)"
            >
              <image :src="image" mode="aspectFill" class="uploaded-image"></image>
              <view class="delete-btn" @tap.stop="removeImage(index)">
                <text class="iconfont icon-close">×</text>
              </view>
            </view>
            
            <!-- 添加图片按钮（始终显示，直到达到上限） -->
            <view 
              v-if="uploadedImages.length < maxImageCount" 
              class="add-image-btn" 
              @tap="chooseImage"
            >
              <view class="plus-icon">+</view>
            </view>
          </view>
          <view class="image-tips" v-if="uploadedImages.length > 0">
            已上传 {{ uploadedImages.length }}/{{ maxImageCount }} 张图片
          </view>
        </view>
      </view>

      <!-- 分类选择 -->
      <view class="category-section">
        <view class="section-title">选择分类</view>
        <scroll-view scroll-x class="category-scroll">
          <view class="category-list">
            <view 
              v-for="(category, index) in categoryList" 
              :key="index"
              class="category-item"
              :class="{ active: postClass === category.value }"
              @tap="selectCategory(category.value)"
            >
              {{ category.name }}
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 发布按钮 -->
      <view class="publish-section">
        <button 
          class="publish-btn" 
          :class="{ disabled: !canPublish }" 
          :disabled="!canPublish"
          @tap="handlePublish"
        >
          {{ publishing ? '发布中...' : '立即发布' }}
        </button>
      </view>

      <!-- 社区规范（精简版） -->
      <view class="community-rules">
        <view class="rules-content">
          发布即表示您已阅读并同意
          <text class="highlight" @tap="viewRules">《社区用户协议》</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import { apiAddTreeHolePost } from '../../api/treehole'

// 响应式数据
const postContent = ref('')
const uploadedImages = ref([])
const maxImageCount = ref(9)
const postClass = ref('daily')
const publishing = ref(false)
const contentHeight = ref(0)
const textAreaHeight = ref(0)

// 分类数据（假数据）
const categoryList = reactive([
  { name: '日常分享', value: 'daily' },
  { name: '经验交流', value: 'experience' },
  { name: '问题求助', value: 'help' },
  { name: '技术讨论', value: 'tech' },
  { name: '生活技巧', value: 'life' },
  { name: '其他', value: 'other' }
])

// 计算属性
const canPublish = computed(() => {
  return postContent.value.trim().length > 0 && !publishing.value
})

// 方法
const calculateHeights = () => {
  const systemInfo = uni.getSystemInfoSync()
  const windowHeight = systemInfo.windowHeight
  const windowWidth = systemInfo.windowWidth
  
  // 导航栏高度（约88rpx，转为px）
  const navBarHeight = 88 / 750 * windowWidth
  
  // 内容区域高度 = 窗口高度 - 导航栏高度
  contentHeight.value = windowHeight - navBarHeight
  
  // 文本区域高度 = 内容区域高度的40%（因为图片区域内嵌了）
  textAreaHeight.value = contentHeight.value * 0.4
}

const onContentInput = (e) => {
  // 可以在这里添加额外的输入处理逻辑
  console.log('当前字数:', e.detail.value.length)
}

const goBack = () => {
  // 如果有未保存的内容，提示用户
  if (postContent.value.trim() || uploadedImages.value.length > 0) {
    uni.showModal({
      title: '提示',
      content: '确定要放弃编辑吗？',
      success: (res) => {
        if (res.confirm) {
          uni.navigateBack()
        }
      }
    })
  } else {
    uni.navigateBack()
  }
}

const chooseImage = () => {
  const count = maxImageCount.value - uploadedImages.value.length
  
  uni.chooseImage({
    count: count,
    sizeType: ['compressed'], // 压缩图
    sourceType: ['album', 'camera'], // 相册和相机
    success: (res) => {
      // 模拟上传过程
      const tempFilePaths = res.tempFilePaths
      
      // 显示上传中状态
      uni.showLoading({
        title: '上传中...'
      })
      
      // 模拟上传延迟
      setTimeout(() => {
        // 将新图片添加到已上传列表
        uploadedImages.value = [...uploadedImages.value, ...tempFilePaths]
        uni.hideLoading()
        
        // 不需要提示，静默上传
      }, 500)
    },
    fail: (err) => {
      console.error('选择图片失败:', err)
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    }
  })
}

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1)
}

const previewImage = (index) => {
  uni.previewImage({
    current: index,
    urls: uploadedImages.value
  })
}

const selectCategory = (category) => {
  postClass.value = category
}

const handlePublish = () => {
  if (!canPublish.value) return
  
  // 验证内容长度
  if (postContent.value.trim().length < 5) {
    uni.showToast({
      title: '内容至少5个字',
      icon: 'none'
    })
    return
  }
  
  publishing.value = true
  
  let res = apiAddTreeHolePost({userId:1, content:postContent.value, postClass:postClass.value})
  console.log('提交数据',"1",postContent.value, postClass.value)
  //模拟发布请求
  uni.showLoading({
    title: '发布中...',
  })
  
  console.log(res)
  
  res.then(result=>{
  	  uni.hideLoading()
  	  
  	  // 发布成功
  	  uni.showToast({
  	    title: '发布成功',
  	    icon: 'success',
  	    duration: 1500
  	  })
  	  
  	  postContent.value = ''
  	  uploadedImages.value = []
  	  postClass.value = 'daily'
  	  publishing.value = false
  	  
  	  
  	  uni.reLaunch({
  	    url: '/pages/treehole/treehole',
  	    success: () => {
  	      console.log('跳转到发布页面')
  	    },
  	    fail: (err) => {
  	      console.log('跳转失败:', err)
  	      uni.showToast({
  	        title: '发布页面暂未开发完成',
  	        icon: 'none'
  	      })
  	    }
  	  })
  }).catch(error=>{
  	  uni.hideLoading()
  	  uni.showToast({
  	    title: '发布失败',
  	    icon: 'fail',
  	    duration: 1500,
  	  })
  	  setTimeout(()=>{
  	  		  publishing.value = false
  	  		  },1500)
  	  console.log('Promise出错',error)
  })
}

const viewRules = () => {
  uni.showModal({
    title: '社区用户协议',
    content: '1. 请遵守国家法律法规\n2. 尊重他人，友善交流\n3. 不发布广告营销信息\n4. 保护个人隐私安全\n5. 确保内容原创性\n6. 及时举报违规内容',
    showCancel: false,
    confirmText: '我知道了'
  })
}

// 生命周期钩子
onLoad(() => {
  calculateHeights()
})

onReady(() => {
  setTimeout(() => {
    calculateHeights()
  }, 100)
})

// 如果需要使用 onMounted，可以这样写
onMounted(() => {
  // Vue 的生命周期钩子，在组件挂载后执行
})
</script>

<style lang="scss" scoped>
.page-container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

// 导航栏样式
.nav-bar {
  height: 88rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  border-bottom: 1rpx solid #eee;
  flex-shrink: 0;
  
  .nav-left {
    color: #333;
    font-size: 32rpx;
    
    .icon-back {
      font-size: 28rpx;
    }
  }
  
  .nav-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  .nav-right {
    width: 100rpx;
  }
}

// 主内容区域
.main-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

// 编辑容器（文本+图片）
.editor-container {
  background-color: #fff;
  margin-bottom: 20rpx;
  border-radius: 0 0 20rpx 20rpx;
}

// 文本输入区域
.text-input-area {
  padding: 32rpx 32rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
  
  .post-content {
    width: 100%;
    font-size: 32rpx;
    line-height: 1.6;
    color: #333;
  }
  
  .word-count {
    text-align: right;
    font-size: 24rpx;
    color: #999;
    margin-top: 16rpx;
  }
}

// 内嵌图片上传区域
.inline-image-section {
  padding: 24rpx 32rpx 32rpx;
  
  .image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    
    .image-item {
      position: relative;
      width: 160rpx;
      height: 160rpx;
      border-radius: 12rpx;
      overflow: hidden;
      background-color: #f8f8f8;
      
      .uploaded-image {
        width: 100%;
        height: 100%;
      }
      
      .delete-btn {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        width: 36rpx;
        height: 36rpx;
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 20rpx;
        font-weight: bold;
      }
    }
    
    .add-image-btn {
      width: 160rpx;
      height: 160rpx;
      background-color: #f8f8f8;
      border: 2rpx dashed #ddd;
      border-radius: 12rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .plus-icon {
        font-size: 48rpx;
        color: #999;
        font-weight: 300;
      }
    }
  }
  
  .image-tips {
    font-size: 24rpx;
    color: #999;
    margin-top: 20rpx;
  }
}

// 分类选择区域
.category-section {
  background-color: #fff;
  padding: 32rpx;
  margin-bottom: 20rpx;
  border-radius: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
  }
  
  .category-scroll {
    white-space: nowrap;
    width: 100%;
    
    .category-list {
      display: inline-flex;
      
      .category-item {
        padding: 16rpx 32rpx;
        background-color: #f8f8f8;
        border-radius: 40rpx;
        font-size: 28rpx;
        color: #666;
        margin-right: 20rpx;
        flex-shrink: 0;
        
        &:last-child {
          margin-right: 0;
        }
        
        &.active {
          background-color: #007aff;
          color: #fff;
        }
      }
    }
  }
}

// 发布按钮区域
.publish-section {
  padding: 0 32rpx 32rpx;
  
  .publish-btn {
    background-color: #007aff;
    color: #fff;
    border-radius: 50rpx;
    height: 88rpx;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: normal;
    font-weight: bold;
    
    &.disabled {
      background-color: #ccc;
      color: #fff;
    }
    
    &::after {
      border: none;
    }
  }
}

// 社区规范区域
.community-rules {
  padding: 0 32rpx 40rpx;
  
  .rules-content {
    font-size: 24rpx;
    color: #999;
    text-align: center;
    
    .highlight {
      color: #007aff;
    }
  }
}
</style>