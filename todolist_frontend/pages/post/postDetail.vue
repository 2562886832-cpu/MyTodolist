<template>
  <view class="container">
    <!-- 帖子内容区域 - 占屏幕30% -->
      <view class="post-content-card" @tap="clear()">
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

<!--       帖子内容 -->
       <view class="post-content">
          <text class="content-text">{{ post.content }}</text>
          <view class="post-images" v-if="post.images && post.images.length">
            <!-- <image 
              v-for="(img, imgIndex) in post.images" 
              :key="imgIndex"
              class="content-image"
              :src="img"
              mode="aspectFill"
              @tap="previewImage(post.images, imgIndex)"
            ></image> -->
          </view>
        </view>

        <!-- 帖子底部操作栏 -->
        <view class="post-actions">
          <view class="action-item" @tap="handleShare(post)">
            <image class="action-icon" src="/static/share.png"></image>
            <text class="action-text">分享</text>
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
	  <!-- 评论统计 -->
	  <view class="comment-header">
	    <text class="comment-title">全部评论 ({{ totalComments }})</text>
	    <view class="comment-sort">
	      <text class="sort-item active">最热</text>
	      <text class="sort-item">最新</text>
	    </view>
	  </view>

    <!-- 评论列表区域 - 占屏幕70% -->
    <scroll-view class="comment-section" scroll-y :style="{ height: commentSectionHeight + 'px' }"
	@scrolltolower="loadMore()">
      
      
      <!-- 评论列表 -->
      <view class="comment-list">
		<view class="loadingLayout" v-if="!TreeHolePostComments.length && !noData">
			<uni-load-more status="loading"></uni-load-more>
		</view>
        <view 
          class="comment-item" 
          v-for="(comment, index) in TreeHolePostComments" 
          :key="comment.id"
        >
          <image class="comment-avatar" :src="comment.avatar" mode="aspectFill"></image>
          <view class="comment-content">
            <view class="comment-info">
              <text class="comment-name">{{ comment.userName }}</text>
			  <view class="comment-like">
			    <image 
				  @tap.stop="handleCommentLike(comment.id, comment.likeStatus)"
			      class="comment-like-icon" 
			      :src="comment.likeStatus ? '/static/icons/like-i.png' : '/static/icons/like-o.png'"
			    ></image>
			    <text class="comment-like-count">{{ comment.likeCount }}</text>
				<image
				@tap="showOperating(comment.id, comment.userId, comment.content)"
				class="comment-more-icon" 
				:src="'/static/icons/更多.png'" ></image>
			  </view>
              
            </view>
            <view class="comment-text">{{ comment.content }}</view>
            <view class="comment-actions">
              <text class="comment-time">{{ formatPostTimeSimple(comment.createTime) }}</text>
              <text class="comment-reply" @tap.stop="handleReply(comment)">回复</text>
            </view>
            
            <!-- 子评论（回复） -->
            <view class="sub-comments" v-if="comment.children && comment.children.length > 0">
              <view 
                class="sub-comment-item" 
                v-for="reply in comment.children" 
                :key="reply.id"
              >
             <!--  <view class="sub-comment-content">
                  <text class="sub-comment-name">{{ reply.userName }}</text>
                  <text class="sub-comment-target" v-if="reply.targetUserName">回复@{{ reply.targetUserName }}</text>
                  <text>：{{ reply.content }}</text>
                </view> -->
				
				
				<view class="comment-content">
				  <view class="sub-comment-info">
					<view class="left">
						<view>
							<image class="sub-comment-avatar" :src="reply.avatar" mode="aspectFill"></image>
						</view>
						<view>
							<text class="sub-comment-name" style="text-align: center;">{{ reply.userName }}</text>
						</view>
<!-- 						<view v-if="reply.targetUserName">
							<text>&nbsp;回复&nbsp;</text>
							<text class="sub-comment-name">{{reply.targetUserName}}</text>
						</view> -->
					</view>
					<view class="right">
						<view class="sub-comment-like" >
						  <image
						    @tap.stop="handleCommentLike(reply.id, reply.likeStatus)"
						    class="comment-like-icon" 
						    :src="reply.likeStatus ? '/static/icons/like-i.png' : '/static/icons/like-o.png'"
						  ></image>
						  <text class="comment-like-count">{{ reply.likeCount }}</text>
						  <image
						  @tap="showOperating(reply.id, reply.userId, reply.content)"
						  class="comment-more-icon" 
						  :src="'/static/icons/更多.png'" ></image>
						</view>
					</view>
				  </view>
				  <view class="sub-comment-content">{{ reply.content }}</view>
				  <view class="sub-comment-actions">
				    <text class="comment-time">{{ formatPostTimeSimple(reply.createTime) }}</text>
				    <text class="comment-reply" @tap="handleSubReply(reply,comment)">回复</text>
				  </view>
				</view>
                <!-- <view class="sub-comment-actions">
                  <view class="sub-comment-like" @tap.stop="handleCommentLike(reply.id, reply.likeStatus)">
                    <image 
                      class="sub-comment-like-icon" 
                      :src="reply.likeStatus ? '/static/icons/liked.png' : '/static/icons/like.png'"
                    ></image>
                    <text class="sub-comment-like-count">{{ reply.likeCount }}</text>
                  </view>
                   <text class="sub-comment-reply" @tap.stop="handleSubReply(comment, reply)">回复</text>
                </view> -->
              </view>
              
              <!-- 查看更多回复 -->
              <view class="view-more-replies" v-if="comment.replyCount > 2">
                <text>展开{{ comment.replyCount - 2 }}条回复</text>
              </view>
            </view>
          </view>
        </view>
		<view class="loadingLayout" v-if="TreeHolePostComments.length || noData">
			<uni-load-more :status="noData?'noMore':'loading'"></uni-load-more>
		</view>
      </view>
      
      <!-- 加载更多 -->
	  <view class="load-more" v-if="hasMoreComments">
        <text class="load-more-text" @tap="loadMoreComments">加载更多评论</text>
      </view>
      <view class="no-more" v-else>
        <text class="no-more-text">没有更多评论了</text>
      </view>
    </scroll-view>
    
    <!-- 底部评论输入框 -->
    <view class="comment-input-container">
	  <view v-if="showReplyComment != ''" class="simpleReply">
		  <text> {{showReplyComment}} </text>
	  </view>
      <view class="comment-input-wrapper">
        <input 
          class="comment-input" 
          @input="onCommentInput"
          placeholder="写下你的评论..."
		  :value = "commentInput"
          :focus="isInputFocus"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
        <view class="input-actions">
          <image 
            class="emoji-icon" 
            src="/static/icons/emoji.png"
            @tap="toggleEmoji"
          ></image>
          <button 
            class="send-btn" 
            :class="{ active: commentInput.trim().length > 0 }"
            @tap="sendComment"
            :disabled="commentInput.trim().length === 0"
          >发送</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { onLoad, onReady, onShow, onReachBottom } from '@dcloudio/uni-app'
import { apiGetTreeHoldPostComments, apiAddTreeHolePostComment, apiDelTreeHolePostComment } from '../../api/treehole.js'

// 响应式数据
const windowHeight = ref(0)
const postSectionHeight = ref(0)
const commentSectionHeight = ref(0)
const queryParams = {
		page:1,
		pageSize:10,
		postId:null
	}

let TreeHolePostComments = ref([])
const totalComments = ref()
const noData = ref(false)
const GetTreeHoldPostComments = async(id)=>{
		await new Promise(resolve => setTimeout(resolve, 100));
		queryParams.postId = id;
		let res = await apiGetTreeHoldPostComments(queryParams);
		TreeHolePostComments.value = [...TreeHolePostComments.value, ...res.data.records];
		totalComments.value = res.data.total;
		if(queryParams.pageSize > res.data.length) noData.value = true;
		console.log(res.data);
}

// 帖子数据
// const post = ref({
//   id: 1,
//   userName: "张三",
//   avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png",
//   postClass: "技术分享",
//   createTime: "2023-10-15 14:30:00",
//   content: "今天给大家分享一个Uniapp开发小技巧，使用flex布局可以快速实现响应式设计。Uniapp的跨平台能力真的很强大，一次开发可以发布到多个平台。",
//   images: [
//     "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png",
//     "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png",
//     "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png"
//   ],
//   commentCount: 24,
//   likeCount: 156,
//   likeStatus: false
// })

// 评论数据
const comments = ref([])
const hasMoreComments = ref(true)
const commentPage = ref(1)
const commentPageSize = ref(10)

// 评论输入
const commentInput = ref("")
const isInputFocus = ref(false)
const replyTarget = ref(null) // 回复的目标评论

// 计算区域高度
const calculateSectionHeights = () => {
  const systemInfo = uni.getSystemInfoSync()
  windowHeight.value = systemInfo.windowHeight
  
  // 计算底部输入框高度（约50px）
  const inputHeight = 50
  // 计算帖子内容区域高度（30%屏幕）
  postSectionHeight.value = windowHeight.value * 0.3
  // 计算评论区域高度（70%屏幕减去输入框高度）
  commentSectionHeight.value = windowHeight.value * 0.7 - inputHeight
}

// 格式化帖子时间
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

// 格式化评论时间
const formatCommentTime = (timeStr) => {
  if (!timeStr) return ""
  const date = new Date(timeStr)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000) // 相差秒数
  
  if (diff < 60) {
    return "刚刚"
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟前`
  } else if (diff < 24 * 3600) {
    return `${Math.floor(diff / 3600)}小时前`
  } else if (diff < 30 * 24 * 3600) {
    return `${Math.floor(diff / (24 * 3600))}天前`
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${month}-${day}`
  }
}

// 生成假评论数据
const generateFakeComments = () => {
  const users = [
    { id: 101, name: "李四", avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png" },
    { id: 102, name: "王五", avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png" },
    { id: 103, name: "赵六", avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png" },
    { id: 104, name: "钱七", avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png" },
    { id: 105, name: "孙八", avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png" }
  ]
  
  const commentContents = [
    "这个技巧真的很实用，感谢分享！",
    "Uniapp确实很方便，我正在用它开发一个项目",
    "有没有更详细的教程可以推荐？",
    "图片加载有点慢，有什么优化建议吗？",
    "我试了一下，效果非常好，节省了很多时间",
    "跨平台开发确实是大趋势",
    "请问支持小程序和H5同时发布吗？",
    "性能方面怎么样？",
    "感谢作者的分享，学到了",
    "收藏了，以后开发的时候可以试试"
  ]
  
  const replyContents = [
    "是的，我也觉得",
    "同问，求教程",
    "可以试试图片懒加载",
    "性能挺好的，我用了没发现什么问题",
    "支持的，我用过"
  ]
  
  // 生成主评论
  const generatedComments = []
  for (let i = 0; i < 8; i++) {
    const user = users[i % users.length]
    const commentTime = new Date()
    commentTime.setHours(commentTime.getHours() - Math.floor(Math.random() * 24))
    commentTime.setMinutes(commentTime.getMinutes() - Math.floor(Math.random() * 60))
    
    // 随机决定是否有回复
    const hasReplies = Math.random() > 0.5
    const replyCount = hasReplies ? Math.floor(Math.random() * 3) + 1 : 0
    
    const comment = {
      id: 1000 + i,
      userId: user.id,
      userName: user.name,
      avatar: user.avatar,
      content: commentContents[i % commentContents.length],
      createTime: commentTime.toISOString(),
      likeCount: Math.floor(Math.random() * 50),
      likeStatus: Math.random() > 0.7,
      replyCount: replyCount,
      replies: []
    }
    
    // 生成回复
    if (hasReplies && replyCount > 0) {
      for (let j = 0; j < Math.min(replyCount, 2); j++) {
        const replyUser = users[(i + j + 1) % users.length]
        const targetUser = j === 0 ? null : user
        
        const replyTime = new Date(commentTime)
        replyTime.setMinutes(replyTime.getMinutes() + Math.floor(Math.random() * 60))
        
        comment.replies.push({
          id: 2000 + i * 10 + j,
          userId: replyUser.id,
          userName: replyUser.name,
          targetUserId: targetUser ? targetUser.id : null,
          targetUserName: targetUser ? targetUser.name : null,
          content: replyContents[(i + j) % replyContents.length],
          createTime: replyTime.toISOString(),
          likeCount: Math.floor(Math.random() * 20),
          likeStatus: Math.random() > 0.8
        })
      }
    }
    
    generatedComments.push(comment)
  }
  
  comments.value = generatedComments
}

// 加载帖子详情
const loadPostDetail = () => {
  // 模拟API请求
  setTimeout(() => {
    // 这里应该是真实的API请求
    uni.showToast({
      title: '加载成功',
      icon: 'success'
    })
  }, 500)
}

// 加载更多评论
const loadMoreComments = () => {
  if (!hasMoreComments.value) return
  
  uni.showLoading({
    title: '加载中'
  })
  
  setTimeout(() => {
    // 模拟加载更多评论
    const newComments = []
    for (let i = 0; i < 5; i++) {
      newComments.push({
        id: 2000 + i,
        userId: 106 + i,
        userName: `用户${106 + i}`,
        avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png",
        content: `这是第${comments.value.length + i + 1}条评论`,
        createTime: new Date().toISOString(),
        likeCount: Math.floor(Math.random() * 30),
        likeStatus: false,
        replyCount: 0,
        replies: []
      })
    }
    
    comments.value = [...comments.value, ...newComments]
    commentPage.value++
    
    // 模拟没有更多数据
    if (commentPage.value >= 3) {
      hasMoreComments.value = false
    }
    
    uni.hideLoading()
  }, 800)
}

// 图片预览
const previewImage = (images, currentIndex) => {
  uni.previewImage({
    urls: images,
    current: currentIndex
  })
}

// 处理分享
const handleShare = (postData) => {
  uni.showActionSheet({
    itemList: ['分享到微信', '分享到QQ', '分享到微博', '复制链接'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.showToast({
          title: '已分享到微信',
          icon: 'success'
        })
      } else if (res.tapIndex === 1) {
        uni.showToast({
          title: '已分享到QQ',
          icon: 'success'
        })
      } else if (res.tapIndex === 2) {
        uni.showToast({
          title: '已分享到微博',
          icon: 'success'
        })
      } else if (res.tapIndex === 3) {
        uni.setClipboardData({
          data: `https://example.com/post/${postData.id}`,
          success: () => {
            uni.showToast({
              title: '链接已复制',
              icon: 'success'
            })
          }
        })
      }
    }
  })
}

// 处理评论点击
const handleComment = () => {
  isInputFocus.value = true
  replyTarget.value = null
}

// 处理点赞
const handleLike = (postId, likeStatus) => {
  // 模拟API请求
  if (likeStatus) {
    post.value.likeCount--
    post.value.likeStatus = false
    uni.showToast({
      title: '取消点赞',
      icon: 'none'
    })
  } else {
    post.value.likeCount++
    post.value.likeStatus = true
    uni.showToast({
      title: '点赞成功',
      icon: 'success'
    })
  }
  
  // 这里应该发送请求到后端
  // uni.request({
  //   url: '/api/post/like',
  //   method: 'POST',
  //   data: { postId, like: !likeStatus },
  //   success: (res) => {
  //     // 更新状态
  //   }
  // })
}

const showOperating = (postId, userId,content) => {
	console.log(postId, userId, content)
	// this.currentItem = item
	// this.currentIndex = index
	
	// 根据type决定按钮文本
	const deleteText = userId === 1 ? '删除' : '举报'
	
	uni.showActionSheet({
	  itemList: ['复制评论', deleteText],
	  success: (res) => {
		const index = res.tapIndex
		if (index === 0) {
		  uni.setClipboardData({
		    data: content,
		    success: () => {
		      uni.showToast({
		        title: '复制成功',
		        icon: 'success'
		      })
		    }
		  })
		} else if (index === 1 && userId===1) {
		  console.log(deleteText)
		  uni.showModal({
		    title: '提示',
		    content: '确定删除吗？',
		    success: (res) => {
		        if (res.confirm) {
		  		apiDelTreeHolePostComment(postId);
				RefreshPage()
		        }
		    }
		  });
		}else{
			console.log("举报审核中...")
		}
	  },
	  fail: (res) => {
	    console.log('取消操作')
	  }
	})
}

// 处理评论点赞
const handleCommentLike = (commentId, likeStatus) => {
  console.log(commentId)
  // 找到评论并更新
  const updateCommentLike = (commentList) => {
    for (let comment of commentList) {
      if (comment.id === commentId) {
        if (likeStatus) {
          comment.likeCount--
          comment.likeStatus = false
        } else {
          comment.likeCount++
          comment.likeStatus = true
        }
        return true
      }
      
      // 检查回复
      if (comment.replies && comment.replies.length > 0) {
        for (let reply of comment.replies) {
          if (reply.id === commentId) {
            if (likeStatus) {
              reply.likeCount--
              reply.likeStatus = false
            } else {
              reply.likeCount++
              reply.likeStatus = true
            }
            return true
          }
        }
      }
    }
    return false
  }
  
  if (updateCommentLike(comments.value)) {
    uni.showToast({
      title: likeStatus ? '取消点赞' : '点赞成功',
      icon: 'none'
    })
  }
}

// 处理回复
let parentId = ref(null)
const showReplyComment = ref("")
const handleReply = (comment) => {
  parentId.value = comment.id
  // console.log(parentId.value)
  // isInputFocus.value = true
  // replyTarget.value = {
  //   id: comment.id,
  //   userName: comment.userName,
  //   type: 'comment'
  // }
  const splitComment = comment.content.length > 10 ? comment.content.substring(0, 12)+'...' : comment.content;
  showReplyComment.value = `回复 @${comment.userName}: ${splitComment}`
}

const preTextReplyComment = ref("")
// 处理子回复
const handleSubReply = (reply, comment) => {
  parentId.value = comment.id
  // console.log(parentId.value)
  // isInputFocus.value = true
  // replyTarget.value = {
  //   id: reply.id,
  //   userName: reply.userName,
  //   commentId: comment.id,
  //   type: 'reply'
  // }
  // commentInput.value = `回复 @${reply.userName}: `
  preTextReplyComment.value = `回复 @${reply.userName}: `
  const splitComment = reply.content.length > 10 ? reply.content.substring(0, 12)+'...' : reply.content;
  showReplyComment.value = `回复 @${reply.userName}: ${splitComment}`
}

// 评论输入
const onCommentInput = (e) => {
  commentInput.value = e.detail.value
}

// 输入框聚焦
const onInputFocus = () => {
  isInputFocus.value = true
}

// 输入框失焦
const onInputBlur = () => {
  // 延迟失焦，避免键盘收起过快
  setTimeout(() => {
    isInputFocus.value = false
  }, 100)
}

// 切换表情
const toggleEmoji = () => {
  uni.showToast({
    title: '表情功能待实现',
    icon: 'none'
  })
}

const clear = () => {
	showReplyComment.value = ""
	parentId.value = null
}

const loadMore = () => {
	const {id} = post.value
	// console.log(noData.value)
	if(noData.value) return;
	queryParams.page++;
	GetTreeHoldPostComments(id);
}

const RefreshPage = () =>{
	const {id} = post.value
	
	//数据初始化
	TreeHolePostComments.value = []
	showReplyComment.value = ""
	commentInput.value = ""
	preTextReplyComment.value = ""
	parentId.value = null
	queryParams.page = 1
	queryParams.pageSize = 10
	noData.value = false
	
	GetTreeHoldPostComments(id)
}

// 发送评论
const sendComment = () => {
  // if (!commentInput.value.trim()) return
  const {id} = post.value

  const newComment = {
    postId: id,
    userId: 1, // 当前用户ID
    content: parentId.value != null ? preTextReplyComment.value+''+commentInput.value : commentInput.value,
	parentId: parentId.value
  }
  
  let res = apiAddTreeHolePostComment(newComment)
  RefreshPage()
  
  
  // 如果是回复
  // if (replyTarget.value) {
  //   // 找到要回复的评论
  //   for (let comment of comments.value) {
  //     if (comment.id === replyTarget.value.commentId || comment.id === replyTarget.value.id) {
  //       if (!comment.replies) {
  //         comment.replies = []
  //       }
        
  //       // 添加回复
  //       comment.replies.push({
  //         id: Date.now() + 1,
  //         userId: 999,
  //         userName: "当前用户",
  //         targetUserId: replyTarget.value.id,
  //         targetUserName: replyTarget.value.userName,
  //         content: commentInput.value.replace(`回复 @${replyTarget.value.userName}: `, ''),
  //         createTime: new Date().toISOString(),
  //         likeCount: 0,
  //         likeStatus: false
  //       })
        
  //       comment.replyCount++
  //       break
  //     }
      
  //     // 检查回复中的回复
  //     if (comment.replies && comment.replies.length > 0) {
  //       for (let reply of comment.replies) {
  //         if (reply.id === replyTarget.value.id) {
  //           // 这里可以添加对回复的回复
  //           // 为简单起见，我们添加到主评论的回复中
  //           if (!comment.replies) {
  //             comment.replies = []
  //           }
            
  //           comment.replies.push({
  //             id: Date.now() + 1,
  //             userId: 999,
  //             userName: "当前用户",
  //             targetUserId: replyTarget.value.id,
  //             targetUserName: replyTarget.value.userName,
  //             content: commentInput.value.replace(`回复 @${replyTarget.value.userName}: `, ''),
  //             createTime: new Date().toISOString(),
  //             likeCount: 0,
  //             likeStatus: false
  //           })
            
  //           comment.replyCount++
  //           break
  //         }
  //       }
  //     }
  //   }
  // } else {
  //   // 添加新评论
  //   comments.value.unshift(newComment)
  //   totalComments.value++
  //   post.value.commentCount++
  // }
  
  // // 清空输入框
  // commentInput.value = ""
  // replyTarget.value = null
  // isInputFocus.value = false
  
  // uni.showToast({
  //   title: '评论成功',
  //   icon: 'success'
  // })
  
  // // 滚动到顶部
  // setTimeout(() => {
  //   uni.pageScrollTo({
  //     scrollTop: postSectionHeight.value,
  //     duration: 300
  //   })
  // }, 100)
}

// 生命周期钩子
const post = ref([])
onLoad((options) => {
  post.value = uni.getStorageSync('tempPostData')
  const {id} = post.value
  GetTreeHoldPostComments(id)
  // 获取帖子ID
  // if (options.id) {
  //   this.postId = options.id;
  //   this.loadPostDetail();
  // }
  
  // 初始化假评论数据
  generateFakeComments()
})

// onReachBottom(()=>{
//   const {id} = post.value
//   console.log(noData.value)
//   if(noData.value) return;
//   queryParams.page++;
//   GetTreeHoldPostComments(id);
// })

onReady(() => {
  calculateSectionHeights()
})

onShow(() => {
  // 页面显示时重新计算高度
  setTimeout(() => {
    calculateSectionHeights()
  }, 100)
})
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 帖子内容区域 */
.post-section {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.post-content-card {
  padding: 20rpx 30rpx;
  background-color: #ffffff;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.08);
}

/* 帖子操作栏 */
.post-actions {
  display: flex;
  position: relative;
  justify-content: space-around;
  padding: 20rpx 0;
  border-top: 1rpx solid #f0f0f0;
}

/* 帖子头部样式 */
.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.post-meta {
  display: flex;
  align-items: center;
}

.post-category {
  font-size: 24rpx;
  color: #1890ff;
  background-color: #e6f7ff;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  margin-right: 16rpx;
}

.post-time {
  font-size: 24rpx;
  color: #999;
}

/* 帖子内容样式 */
.post-content {
  margin-bottom: 30rpx;
}

.content-text {
  font-size: 30rpx;
  line-height: 1.6;
  color: #333;
  margin-bottom: 20rpx;
}

.post-images {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -5rpx;
}

.content-image {
  width: calc(33.33% - 10rpx);
  height: 180rpx;
  margin: 5rpx;
  border-radius: 8rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.action-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 8rpx;
}

.action-text {
  font-size: 24rpx;
  color: #666;
}

.action-text.liked {
  color: #ff6b6b;
}

/* 评论区域 */
.comment-section {
  flex: 1;
  background-color: #f5f5f5;
  margin-top: 10rpx;
  border-radius: 20rpx 20rpx 0 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.comment-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.comment-sort {
  display: flex;
}

.sort-item {
  font-size: 26rpx;
  color: #999;
  margin-left: 30rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.sort-item.active {
  color: #1890ff;
  background-color: #e6f7ff;
}

/* 评论列表 */
.comment-list {
	padding-left: 20rpx;
}

.comment-item {
  display: flex;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f9f9f9;
}

.comment-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.sub-comment-avatar{
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.sub-comment-info{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  .left{
	  display: flex;
	  // flex-direction: ;
	  align-items: center;
	  justify-content: center;
  }
  .sub-comment-avatar{
	  
  }
}


.comment-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.comment-time {
  font-size: 24rpx;
  color: #999;
}

.sub-comment-time {
  font-size: 24rpx;
  color: #999;
}

.comment-text {
  font-size: 28rpx;
  line-height: 1.5;
  color: #333;
  margin-bottom: 20rpx;
}

.comment-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
  padding-right: 30rpx;
}

.sub-comment-actions {
  margin-left: 10rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
  padding-left: 64rpx;
}

.comment-like {
  display: flex;
  align-items: center;
  margin-right: 40rpx;
}

.comment-like-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
}

.comment-more-icon {
	width: 32rpx;
	height: 32rpx;
	margin-left: 10rpx;
}

.comment-like-count {
  font-size: 24rpx;
  color: #999;
}

.comment-reply {
  margin-right: 30rpx;
  font-size: 24rpx;
  color: #999;
}

/* 子评论 */
.sub-comments {
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 12rpx;
}

.sub-comment-item {
  border-bottom: 1rpx solid #f0f0f0;
}

.sub-comment-item:last-child {
  border-bottom: none;
}

.sub-comment-content {
  margin-left: 10rpx;
  padding-left: 64rpx;
  font-size: 26rpx;
  line-height: 1.4;
  color: #666;
  margin-bottom: 12rpx;
}

.sub-comment-name {
  margin-left: 10rpx;
  color: #1890ff;
}

.sub-comment-target {
  color: #1890ff;
}


.sub-comment-like {
  display: flex;
  align-items: center;
  margin-right: 30rpx;
}

.sub-comment-like-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 8rpx;
}

.sub-comment-like-count {
  font-size: 22rpx;
  color: #999;
}

.sub-comment-reply {
  font-size: 22rpx;
  color: #999;
}

.view-more-replies {
  text-align: center;
  padding: 15rpx;
  color: #1890ff;
  font-size: 26rpx;
}

/* 加载更多 */
.load-more, .no-more {
  text-align: center;
  padding: 40rpx 0;
}

.load-more-text {
  font-size: 28rpx;
  color: #1890ff;
}

.no-more-text {
  font-size: 26rpx;
  color: #999;
}

/* 底部评论输入框 */
.comment-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 1rpx solid #f0f0f0;
  padding: 20rpx 30rpx;
  z-index: 100;
}

.comment-input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 15rpx;
  padding: 10rpx 20rpx;
}

.comment-input {
  flex: 1;
  font-size: 28rpx;
  height: 60rpx;
  padding: 0 20rpx;
}

.input-actions {
  display: flex;
  align-items: center;
}

.emoji-icon {
  width: 44rpx;
  height: 44rpx;
  margin-right: 20rpx;
}

.send-btn {
  font-size: 28rpx;
  color: #ccc;
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  line-height: 1;
}

.send-btn.active {
  color: #1890ff;
}

.send-btn:after {
  border: none;
}

.loadingLayout{
	background-color: #f5f5f5;
	/* margin-bottom: -200rpx; */
}
.simpleReply{
	color: gray;
	padding-bottom: 10rpx;
}
</style>