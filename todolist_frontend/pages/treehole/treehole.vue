<template>
  <view class="container safe-area">
	<view class="loadingLayout" v-if="!TreeHolePostList.length && !noData">
		<uni-load-more status="loading"></uni-load-more>
	</view>
	
	<navigator url="/pages/post/search" class="search-bar">
	      <view class="search-box">
	        <text>🔍</text>
	        <input
	          placeholder="请输入关键词"
	        />
	      </view>
	</navigator>
	
    <!-- 分类条 -->
    <scroll-view class="category-scroll" scroll-x="true">
      <view 
        class="category-item" 
        v-for="(item, index) in categories" 
        :key="index"
        :class="{ active: activeCategory === index }"
        @tap="switchCategory(index)"
      >
        {{ item }}
      </view>
    </scroll-view>

    <!-- 帖子列表 -->
    <scroll-view class="post-list" scroll-y="true">
      <view class="post-item" v-for="(post, index) in TreeHolePostList" :key="index">
        <!-- 帖子头部 -->
        <view class="post-header">
          <image class="user-avatar" :src="post.avatar" mode="aspectFill"></image>
          <view class="user-info">
            <view class="user-name">{{ post.userName }}</view>
            <view class="post-meta">
              <view class="post-category">{{ post.postClass }}</view>
              <view class="post-time">{{ formatPostTimeSimple(post.createTime) }}</view>
            </view>
          </view>
        </view>

        <!-- 帖子内容 -->
        <view class="post-content">
          <text class="content-text">{{ post.content }}</text>
          <view class="post-images" v-if="post.images && post.images.length">
            <image 
              v-for="(img, imgIndex) in post.images" 
              :key="imgIndex"
              class="content-image"
              :src="img"
              mode="aspectFill"
              @tap="previewImage(post.images, imgIndex)"
            ></image>
          </view>
        </view>

        <!-- 帖子底部操作栏 -->
        <view class="post-actions">
          <view class="action-item" @tap="handleShare(post)">
            <image class="action-icon" src="/static/share.png"></image>
            <text class="action-text">分享</text>
          </view>
          <view class="action-item" @tap="handleComment(post)">
            <image class="action-icon" src="/static/comment.png"></image>
            <text class="action-text">{{ post.commentCount }}</text>
          </view>
          <view class="action-item" @tap="handleLike(post.id, post.likeStatus)">
            <image 
              class="action-icon" 
              :src="post.likeStatus ? '/static/icons/like-i.png' : '/static/icons/like-o.png'"
            ></image>
            <text class="action-text" :class="{ liked: post.likeStatus }">
              {{ post.likeCount }}
            </text>
          </view>
        </view>
      </view>
	  
	  
      <!-- 加载更多 -->
<!--     <view class="load-more">
        <text>加载更多</text>
      </view> -->
<!--      <view class="no-more" v-else>
        <text>没有更多了</text>
      </view> -->
    </scroll-view>
	
	<view class="loadingLayout" v-if="TreeHolePostList.length || noData">
		<uni-load-more :status="noData?'noMore':'loading'"></uni-load-more>
	</view>
  </view>
  
  <view class="publish-btn" @tap="gotoPublish">
	  +
        <!-- <image class="publish-icon" src="/static/add.png"></image> -->
  </view>
</template>

<script setup>
	import { ref, onMounted, computed } from 'vue'
	import { onLoad, onReachBottom,onPullDownRefresh, onShow } from '@dcloudio/uni-app'
	import { apiGetTreeHolePost, apiTreeHoldPostLike } from '../../api/treehole'
	
	const queryParams = {
		page:1,
		pageSize:10
	}
	
	const TreeHolePostList= ref([]);
	const noData = ref(false)
	const getTreeHolePost = async()=>{
		// await new Promise(resolve => setTimeout(resolve, 100));
		let res = await apiGetTreeHolePost(queryParams);
		TreeHolePostList.value = [...TreeHolePostList.value, ...res.data.records];
		if(queryParams.pageSize > res.data.records.length) noData.value = true;
		console.log(res.data);
	}
	
	const treeHoldPostLike = async(userId, postId, like)=>{
		let res = await apiTreeHoldPostLike({userId, postId, like});
		// console.log(res.data);
	}
	
	
	// 响应式数据
	const activeCategory = ref(0)
	const categories = ref(['全部', '热门', '推荐', '科技', '生活', '美食', '旅行', '影视'])
	const posts = ref([])
	const hasMore = ref(true)
	const page = ref(1)
	const animationData = ref({})
	
	// 计算属性（如果需要）
	// const someComputed = computed(() => {
	//   // 计算逻辑
	// })
	
	// 生命周期
	onLoad(() => {
	  loadPosts()
	})
	
	onShow(()=>{
		queryParams.page = 1
		queryParams.pageSize = 10
		TreeHolePostList.value = []
		noData.value = false
		getTreeHolePost();
	})
	
	onReachBottom(()=>{
		if(noData.value) return;
		queryParams.page++;
		getTreeHolePost();
	})
	
	onPullDownRefresh(()=>{
		queryParams.page=1
		noData.value=false
		TreeHolePostList.value = []
		getTreeHolePost().then(() => {
		      // 停止下拉刷新
		      uni.stopPullDownRefresh();
		      uni.showToast({
		        title: '刷新成功',
		        icon: 'success'
		      });
		    }).catch(err => {
		      uni.stopPullDownRefresh();
		      uni.showToast({
		        title: '刷新失败',
		        icon: 'none'
		      });
		    });
	    // console.log('开始刷新');
	})
	
	// 方法
	const switchCategory = (index) => {
	  activeCategory.value = index
	  posts.value = []
	  page.value = 1
	  hasMore.value = true
	  loadPosts()
	}
	
	const loadPosts = () => {
	  // 模拟加载数据
	  const mockPosts = generateMockPosts()
	  if (page.value === 1) {
	    posts.value = mockPosts
	  } else {
	    posts.value = [...posts.value, ...mockPosts]
	  }
	  
	  // 模拟分页
	  // if (page.value >= 3) {
	  //   hasMore.value = false
	  // }
	}
	
	const loadMorePosts = () => {
	  page.value++
	  loadPosts()
	}
	
	const generateMockPosts = () => {
	  const categoryList = categories.value.slice(2) // 去除前两个通用分类
	  const usernames = ['张三', '李四', '王五', '赵六', '小明', '小红']
	  const avatars = [
	    'https://via.placeholder.com/40/007aff/ffffff?text=用户1',
	    'https://via.placeholder.com/40/34c759/ffffff?text=用户2',
	    'https://via.placeholder.com/40/ff9500/ffffff?text=用户3',
	    'https://via.placeholder.com/40/ff3b30/ffffff?text=用户4'
	  ]
	  
	  const mockImages = [
	    'https://via.placeholder.com/300x200/007aff/ffffff?text=图片1',
	    'https://via.placeholder.com/300x200/34c759/ffffff?text=图片2',
	    'https://via.placeholder.com/300x200/ff9500/ffffff?text=图片3'
	  ]
	  
	  return Array.from({ length: 5 }, (_, i) => ({
	    id: Date.now() + i,
	    username: usernames[Math.floor(Math.random() * usernames.length)],
	    avatar: avatars[Math.floor(Math.random() * avatars.length)],
	    category: categoryList[Math.floor(Math.random() * categoryList.length)],
	    time: formatTime(new Date(Date.now() - Math.random() * 1000000000)),
	    content: `这是第${page.value}页的第${i + 1}条帖子内容。这是一个示例内容，展示了帖子的基本结构。用户可以在这里发布自己的想法、分享生活点滴。`,
	    images: Math.random() > 0.3 ? [mockImages[Math.floor(Math.random() * mockImages.length)]] : [],
	    likeCount: Math.floor(Math.random() * 100),
	    commentCount: Math.floor(Math.random() * 50),
	    liked: Math.random() > 0.5
	  }))
	}
	
	const formatTime = (date) => {
	  const now = new Date()
	  const diff = now - date
	  const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24))
	  
	  if (dayDiff === 0) {
	    const hourDiff = Math.floor(diff / (1000 * 60 * 60))
	    if (hourDiff === 0) {
	      return `${Math.floor(diff / (1000 * 60))}分钟前`
	    }
	    return `${hourDiff}小时前`
	  } else if (dayDiff === 1) {
	    return '昨天'
	  } else if (dayDiff < 7) {
	    return `${dayDiff}天前`
	  } else {
	    return `${date.getMonth() + 1}-${date.getDate()}`
	  }
	}
	
	const handleShare = (post) => {
	  uni.showActionSheet({
	    itemList: ['分享到微信', '分享到QQ', '分享到微博', '复制链接'],
	    success: () => {
	      uni.showToast({
	        title: `已分享：${post.username}的帖子`,
	        icon: 'success'
	      })
	    }
	  })
	}
	
	const handleComment = (post) => {
	  uni.setStorageSync('tempPostData', post)
	  
	  uni.navigateTo({
	    url: '/pages/post/postDetail',
	    success: () => {
	      console.log('跳转到帖子详情页')
	    },
	    fail: (err) => {
	      console.log('跳转失败:', err)
	      uni.showToast({
	        title: '发布页面暂未开发完成',
	        icon: 'none'
	      })
	    }
	  })
	  // 实际开发中可以跳转到评论页面
	  // uni.navigateTo({
	  //   url: `/pages/comment/comment?id=${post.id}`
	  // })
	}
	
	const handleLike = (id, likeStatus) => {
	  
	  const index = TreeHolePostList.value.findIndex(item => item.id === id)
	    if (index === -1) return
	    
	    const post = TreeHolePostList.value[index]
	    const newLikeStatus = likeStatus!=1?1:0
	    
	    // 方法1：直接修改 ref.value 中的对象
	    post.likeStatus = newLikeStatus
	    post.likeCount = newLikeStatus ? post.likeCount + 1 : post.likeCount - 1
		const like = newLikeStatus ? 1 : -1
		
		treeHoldPostLike(1, id, like);
		// console.log(id, likeStatus)

	}
	
	const previewImage = (images, currentIndex) => {
	  uni.previewImage({
	    urls: images,
	    current: currentIndex
	  })
	}
	
	// 发布功能相关（如果需要）
	const gotoPublish = () => {
	  uni.navigateTo({
	    url: '/pages/post/create',
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
	}
	
	const formatPostTimeSimple = (timeArray) => {
	  if (!timeArray || timeArray.length !== 6) {
	    return '时间错误'
	  }
	  
	  const [year, month, day, hour, minute, second] = timeArray
	  const postDate = new Date(year, month - 1, day, hour, minute, second)
	  const now = new Date()
	  const diffMs = now - postDate
	  
	  const diffSeconds = Math.floor(diffMs / 1000)
	  const diffMinutes = Math.floor(diffMs / (1000 * 60))
	  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
	  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
	  
	  // 使用中文时间描述
	  if (diffSeconds < 60) {
	    return '刚刚'
	  } else if (diffMinutes < 60) {
	    return `${diffMinutes}分钟前`
	  } else if (diffHours < 24) {
	    return `${diffHours}小时前`
	  } else if (diffDays === 1) {
	    return '昨天'
	  } else if (diffDays === 2) {
	    return '前天'
	  } else if (diffDays <= 3) {
	    return `${diffDays}天前`
	  } else {
	    // 超过3天显示具体日期
	    const formattedMonth = String(month).padStart(2, '0')
	    const formattedDay = String(day).padStart(2, '0')
	    const formattedHour = String(hour).padStart(2, '0')
	    const formattedMinute = String(minute).padStart(2, '0')
	    
	    // 同一年只显示月日，不同年显示年月日
	    if (now.getFullYear() === year) {
	      return `${formattedMonth}-${formattedDay} ${formattedHour}:${formattedMinute}`
	    } else {
	      return `${year}-${formattedMonth}-${formattedDay} ${formattedHour}:${formattedMinute}`
	    }
	  }
	}

	
	// 将需要在模板中使用的变量和方法暴露出去
	defineExpose({
	  activeCategory,
	  categories,
	  posts,
	  hasMore,
	  page,
	  switchCategory,
	  loadMorePosts,
	  handleShare,
	  handleComment,
	  handleLike,
	  previewImage,
	  gotoPublish
	})
</script>

<style scoped>
/* 使用uniapp的安全区域CSS类 */
.container.safe-area {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 专门为底部元素设置 */
.loading-layout.safe-area-bottom {
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
}

/* 或者调整整体布局 */
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  background-color: #f5f5f5;
}
	
	
.loadingLayout{
	background-color: #f5f5f5;
	/* margin-bottom: -200rpx; */
}

/* .container {
  padding-bottom: 120rpx;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
} */

/* 分类条样式 */
.category-scroll {
  white-space: nowrap;
  padding: 10rpx 0;
  background-color: #ffffff;
  border-bottom: 1rpx solid #e5e5e5;
}

.category-item {
  height: auto;
  display: inline-block;
  padding: 6rpx 16rpx;
  margin: 0 8rpx;
  font-size: 14rpx;
  color: #666;
  border-radius: 16rpx;
  background-color: #f0f0f0;
  transition: all 0.3s;
}

.category-item.active {
  background-color: #007aff;
  color: #ffffff;
  font-weight: bold;
}

/* 帖子列表样式 */
.post-list {
  background-color: #f5f5f5;
  padding-bottom: 500rpx;
  flex: 1;
  padding: 10rpx;
}

.post-item {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 16rpx;
  margin-bottom: 12rpx;
  margin-right: 40rpx;
  margin-left: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 帖子头部 */
.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.user-avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  margin-right: 12rpx;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 16rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.post-meta {
  display: flex;
  align-items: center;
  font-size: 12rpx;
  color: #999;
}

.post-category {
  background-color: #f0f0f0;
  padding: 2rpx 8rpx;
  border-radius: 10rpx;
  margin-right: 8rpx;
}

/* 帖子内容 */
.post-content {
  margin-bottom: 16rpx;
}

.content-text {
  font-size: 15rpx;
  line-height: 1.5;
  color: #333;
  display: block;
  margin-bottom: 12rpx;
  margin-left: 52rpx;
}

.post-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.content-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
  background-color: #f0f0f0;
}

/* 帖子操作栏 */
.post-actions {
  display: flex;
  justify-content: space-around;
  border-top: 1rpx solid #f0f0f0;
  padding-top: 12rpx;
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 6rpx 0;
}

.action-icon {
  width: 20rpx;
  height: 20rpx;
  margin-right: 6rpx;
}

.action-text {
  font-size: 14rpx;
  color: #666;
}

.action-text.liked {
  color: #ff3b30;
}

/* 加载更多 */
.no-more {
  text-align: center;
  padding: 20rpx;
  font-size: 14rpx;
  color: #999;
}

.load-more {
  background-color: #ffffff;
  border-radius: 8rpx;
  /* margin-top: 10rpx; */
}

/* 发布按钮样式 */
.publish-btn {
  color: white;
  position: fixed;
  right: 30rpx;
  bottom: 120rpx; /* 留出底部安全距离 */
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  transition: all 0.3s;
}

.publish-btn:active {
  transform: scale(0.95);
  box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.6);
}

.publish-icon {
  width: 50rpx;
  height: 50rpx;
  filter: brightness(0) invert(1); /* 使图标变为白色 */
}

.search-bar {
  padding: 12px;
  background-color: #fff;
}

.search-box {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 15px;
  background-color: #f8f8f8;
  border-radius: 20px;
}

.search-box text {
  margin-right: 10px;
  color: #999;
}

.search-box input {
  flex: 1;
  height: 100%;
  font-size: 15px;
}
</style>