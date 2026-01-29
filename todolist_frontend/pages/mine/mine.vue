<template>
	<view class="mine-container">
		<!-- <custom-nav-bar title="我的"></custom-nav-bar> -->
		
		<!-- 未登录状态 -->
		<view v-if="!isLoggedIn" class="unlogin-section">
			<view class="unlogin-content">
				<view class="unlogin-avatar">
					<image 
						src="/static/unlogin-avatar.png" 
						class="unlogin-avatar-img"
						mode="aspectFill"
					></image>
				</view>
				
				<view class="unlogin-text">
					<text class="unlogin-title">未登录</text>
					<text class="unlogin-desc">登录后可查看个人资料和使用完整功能</text>
				</view>
				
				<button class="login-btn" @click="handleLogin">
					<text>立即登录</text>
				</button>
			</view>
			
			<view class="unlogin-features">
				<text class="features-title">登录后可享功能</text>
				<view class="features-list">
					<view class="feature-item">
						<uni-icons type="checkbox-filled" size="20" color="#07c160"></uni-icons>
						<text>发布帖子与树洞</text>
					</view>
					<view class="feature-item">
						<uni-icons type="checkbox-filled" size="20" color="#07c160"></uni-icons>
						<text>点赞、评论与收藏</text>
					</view>
					<view class="feature-item">
						<uni-icons type="checkbox-filled" size="20" color="#07c160"></uni-icons>
						<text>个性化主题设置</text>
					</view>
					<view class="feature-item">
						<uni-icons type="checkbox-filled" size="20" color="#07c160"></uni-icons>
						<text>数据备份与同步</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 已登录状态 -->
		<view v-else>
			<view class="user-info-section">
				<view class="user-avatar-container" @click="handleAvatarClick">
					<image 
						:src="userInfo.avatar" 
						class="user-avatar"
						mode="aspectFill"
					></image>
					<view class="avatar-edit">
						<uni-icons type="camera-filled" size="20" color="#fff"></uni-icons>
					</view>
				</view>
				
				<view class="user-name-container" @click="handleEditName">
					<text class="user-name">{{ userInfo.nickname }}</text>
					<uni-icons type="compose" size="20" color="#999"></uni-icons>
				</view>
				
				<text class="user-id">ID: {{ userInfo.userId }}</text>
			</view>
			
			<view class="stats-section">
				<view class="stats-grid">
					<view class="stats-item" @click="navigateTo('todo')">
						<text class="stats-value">{{ todoCount }}</text>
						<text class="stats-label">帖子</text>
					</view>
					
					<view class="stats-item" @click="navigateTo('treehole')">
						<text class="stats-value">{{ userStats.treeholeCount }}</text>
						<text class="stats-label">点赞</text>
					</view>
					
					<view class="stats-item" @click="navigateTo('focus')">
						<text class="stats-value">{{ userStats.focusDays }}</text>
						<text class="stats-label">评论</text>
					</view>
					
					<view class="stats-item" @click="navigateTo('achievement')">
						<text class="stats-value">{{ userStats.achievementCount }}</text>
						<text class="stats-label">收藏</text>
					</view>
				</view>
			</view>
			
			<view class="function-section">
				<view class="function-list">
					<view class="function-item" @click="navigateTo('settings')">
						<view class="function-left">
							<view class="function-icon settings-icon">
								<uni-icons type="gear-filled" size="24" color="#fff"></uni-icons>
							</view>
							<text class="function-title">应用设置</text>
						</view>
						<uni-icons type="right" size="18" color="#ccc"></uni-icons>
					</view>
					
					<view class="function-item" @click="navigateTo('theme')">
						<view class="function-left">
							<view class="function-icon theme-icon">
								<uni-icons type="paintbrush-filled" size="24" color="#fff"></uni-icons>
							</view>
							<text class="function-title">主题设置</text>
						</view>
						<uni-icons type="right" size="18" color="#ccc"></uni-icons>
					</view>
					
					<view class="function-item" @click="navigateTo('notification')">
						<view class="function-left">
							<view class="function-icon notification-icon">
								<uni-icons type="bell-filled" size="24" color="#fff"></uni-icons>
							</view>
							<text class="function-title">消息通知</text>
						</view>
						<uni-icons type="right" size="18" color="#ccc"></uni-icons>
					</view>
					
					<view class="function-item" @click="navigateTo('backup')">
						<view class="function-left">
							<view class="function-icon backup-icon">
								<uni-icons type="cloud-upload-filled" size="24" color="#fff"></uni-icons>
							</view>
							<text class="function-title">数据备份</text>
						</view>
						<uni-icons type="right" size="18" color="#ccc"></uni-icons>
					</view>
				</view>
			</view>
			
			<view class="tool-section">
				<view class="tool-list">
					<view class="tool-item" @click="handleClearCache">
						<view class="tool-left">
							<view class="tool-icon cache-icon">
								<uni-icons type="trash-filled" size="24" color="#fff"></uni-icons>
							</view>
							<text class="tool-title">清除缓存</text>
						</view>
						<view class="tool-right">
							<text class="cache-size">{{ cacheSize }}</text>
							<uni-icons type="right" size="18" color="#ccc"></uni-icons>
						</view>
					</view>
					
					<view class="tool-item" @click="navigateTo('feedback')">
						<view class="tool-left">
							<view class="tool-icon feedback-icon">
								<uni-icons type="chatboxes-filled" size="24" color="#fff"></uni-icons>
							</view>
							<text class="tool-title">意见反馈</text>
						</view>
						<uni-icons type="right" size="18" color="#ccc"></uni-icons>
					</view>
					
					<view class="tool-item" @click="navigateTo('about')">
						<view class="tool-left">
							<view class="tool-icon about-icon">
								<uni-icons type="info-filled" size="24" color="#fff"></uni-icons>
							</view>
							<text class="tool-title">关于我们</text>
						</view>
						<uni-icons type="right" size="18" color="#ccc"></uni-icons>
					</view>
				</view>
			</view>
			
			<view class="logout-section">
				<button class="logout-btn" @click="showLogoutConfirm">
					<uni-icons type="undo-filled" size="20" color="#fff"></uni-icons>
					<text>退出登录</text>
				</button>
			</view>
		</view>
		
		<!-- 修改昵称弹窗 -->
		<uni-popup ref="namePopup" type="dialog">
			<uni-popup-dialog 
				mode="input"
				title="修改昵称"
				:value="userInfo.nickname"
				placeholder="请输入新昵称"
				@confirm="handleNameConfirm"
			></uni-popup-dialog>
		</uni-popup>
		
		<!-- 清除缓存确认框 -->
		<uni-popup ref="cachePopup" type="dialog">
			<uni-popup-dialog 
				mode="base"
				type="warn"
				title="清除缓存"
				content="确定要清除所有缓存数据吗？"
				@confirm="handleCacheConfirm"
			></uni-popup-dialog>
		</uni-popup>
		
		<!-- 退出登录确认框 -->
		<uni-popup ref="logoutPopup" type="dialog">
			<uni-popup-dialog 
				mode="base"
				type="warn"
				title="退出登录"
				content="确定要退出登录吗？"
				@confirm="handleLogoutConfirm"
			></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { apiCountTreeHolePostByUserId, apiGetUserOpenId } from '../../api/mine'

// 登录状态 - 初始时从本地存储读取
const isLoggedIn = ref(false)

// 本地存储键名
const STORAGE_KEY = 'user_login_status'
const USER_INFO_KEY = 'user_info'

const todoCount = ref(0)

const getTreeHolePost = async() => {
	try {
		let res = await apiCountTreeHolePostByUserId(1)
		todoCount.value = res.data || 0
		console.log('获取帖子数量成功:', res.data)
	} catch (error) {
		console.error('获取帖子数量失败:', error)
		todoCount.value = 0
	}
}

// 用户信息
const userInfo = ref({})

// 用户统计数据
const userStats = ref({
	todoCount: 0,
	treeholeCount: 8,
	focusDays: 45,
	achievementCount: 5
})

// 缓存大小
const cacheSize = ref('125.8 MB')

// 弹窗引用 - 使用 null 初始化
const namePopup = ref(null)
const cachePopup = ref(null)
const logoutPopup = ref(null)

// 生命周期
onMounted(() => {
	// 页面加载时检查登录状态
	checkLoginStatus()
})

// 检查登录状态
const checkLoginStatus = () => {
	try {
		// 从本地存储读取登录状态
		const loginStatus = uni.getStorageSync(STORAGE_KEY)
		const savedUserInfo = uni.getStorageSync(USER_INFO_KEY)
		
		if (loginStatus && savedUserInfo) {
			// 如果本地有保存的登录状态和用户信息，恢复登录状态
			isLoggedIn.value = true
			userInfo.value = savedUserInfo
			
			// 加载用户数据
			getTreeHolePost()
			
			console.log('自动登录成功，用户:', savedUserInfo.nickname)
		} else {
			isLoggedIn.value = false
			console.log('未检测到登录状态')
		}
	} catch (error) {
		console.error('读取登录状态失败:', error)
		isLoggedIn.value = false
	}
}

// 保存登录状态
const saveLoginStatus = () => {
	try {
		// 保存登录状态和用户信息到本地存储
		uni.setStorageSync(STORAGE_KEY, true)
		uni.setStorageSync(USER_INFO_KEY, userInfo.value)
		console.log('登录状态已保存')
	} catch (error) {
		console.error('保存登录状态失败:', error)
	}
}

// 清除登录状态
const clearLoginStatus = () => {
	try {
		// 清除本地存储中的登录状态和用户信息
		uni.removeStorageSync(STORAGE_KEY)
		uni.removeStorageSync(USER_INFO_KEY)
		console.log('登录状态已清除')
	} catch (error) {
		console.error('清除登录状态失败:', error)
	}
}

const generateUUID = () => {
  // 生成12位十六进制字符串
    const hexStr = 'xxxxxxxxxxxx'.replace(/x/g, () => {
      // 生成0-15的随机数
      const r = Math.random() * 16 | 0;
      // 转换为十六进制字符
      return r.toString(16);
    });
    
    // 返回"小海棠-"前缀加上12位十六进制字符串
    return `小海棠-${hexStr}`;
}

// 点击登录按钮
const handleLogin = () => {
	// 这里可以跳转到登录页面或弹出登录框
	// 为了演示，这里直接设置为已登录状态
	uni.showModal({
	    mask: true,
	    title: '温馨提示',
	    content: '授权微信登录后才能正常使用小程序功能',
	    success(res) {
	      if (res.confirm) {
	        uni.getUserProfile({
	          desc: '获取你的昵称、头像',
	          success: userRes => {
	            if (userRes.errMsg == 'getUserProfile:ok' && userRes.userInfo != undefined) {
	              // const userInfo = {
	              //   avatarUrl: userRes.userInfo.avatarUrl,
	              //   nickName: userRes.userInfo.nickName
	              // };
	              
	              // 更新响应式数据
				  // isLoggedIn.value = true;
				  userInfo.value = {
				  	avatar: '/static/avatar-default.png',
				  	nickname: generateUUID(),
				  	userId: 'USER20231218'
				  }
	              
	              // 调用接口请求openid
	              apiGetUserOpenId(userInfo).then((res) => {
					  isLoggedIn.value = true;
					  
					  uni.setStorageSync('token', res.data.token); // 根据你的API返回字段调整
					  uni.setStorageSync('openId', res.openId); // 存储openId
					  
					  getTreeHolePost()
					  saveLoginStatus()
					  uni.showToast({
					  	title: '登录成功',
					  	icon: 'success'
					  })
					}).catch(err => {
					  uni.showToast({
						title: '登录失败',
						icon: 'none'
					  });
					});
				  // uni.showToast({
				  // 	title: '登录成功',
				  // 	icon: 'success'
				  // })
	            } else {
	              uni.showToast({
	                icon: "none",
	                title: "获取失败，请重试"
	              });
	            }
	          },
	          fail: error => {
	            console.error('获取用户信息失败:', error);
	          }
	        });
	      }
	    }
	  })
	
	// 保存登录状态到本地存储
	// saveLoginStatus()
	
	// 模拟登录成功后加载用户数据
	// setTimeout(() => {
	// 	getTreeHolePost()
	// 	uni.showToast({
	// 		title: '登录成功',
	// 		icon: 'success'
	// 	})
	// }, 500)
	
	// 实际项目中，这里应该调用登录API
	// 登录成功后，保存返回的用户信息
	// userInfo.value = loginResponse.data
	// saveLoginStatus()
}

// 点击头像
const handleAvatarClick = () => {
	if (!isLoggedIn.value) {
		handleLogin()
		return
	}
	// 选择头像逻辑
	uni.showToast({
		title: '选择头像功能开发中',
		icon: 'none'
	})
}

// 编辑昵称
const handleEditName = () => {
	if (!isLoggedIn.value) {
		handleLogin()
		return
	}
	// 打开昵称修改弹窗
	showNamePopup()
}

// 显示修改昵称弹窗
const showNamePopup = () => {
	nextTick(() => {
		if (namePopup.value && namePopup.value.open) {
			namePopup.value.open()
		} else {
			console.error('namePopup 引用无效')
			uni.showToast({
				title: '弹窗加载失败',
				icon: 'error'
			})
		}
	})
}

// 确认修改昵称
const handleNameConfirm = (value) => {
	if (value && value.trim()) {
		// 更新昵称
		userInfo.value.nickname = value.trim()
		
		// 更新本地存储中的用户信息
		saveLoginStatus()
		
		uni.showToast({
			title: '昵称修改成功',
			icon: 'success'
		})
	} else {
		uni.showToast({
			title: '昵称不能为空',
			icon: 'none'
		})
	}
}

// 清除缓存
const handleClearCache = () => {
	if (!isLoggedIn.value) {
		handleLogin()
		return
	}
	// 打开清除缓存确认框
	showCachePopup()
}

// 显示清除缓存弹窗
const showCachePopup = () => {
	nextTick(() => {
		if (cachePopup.value && cachePopup.value.open) {
			cachePopup.value.open()
		} else {
			console.error('cachePopup 引用无效')
			uni.showModal({
				title: '清除缓存',
				content: '确定要清除所有缓存数据吗？',
				success: (res) => {
					if (res.confirm) {
						handleCacheConfirm()
					}
				}
			})
		}
	})
}

// 确认清除缓存
const handleCacheConfirm = () => {
	// 清除缓存逻辑
	cacheSize.value = '0 MB'
	
	// 实际项目中这里应该清除应用缓存
	// uni.clearStorageSync() // 注意：这会清除所有本地存储，包括登录状态
	
	uni.showToast({
		title: '缓存已清除',
		icon: 'success'
	})
}

// 显示退出登录确认框
const showLogoutConfirm = () => {
	nextTick(() => {
		if (logoutPopup.value && logoutPopup.value.open) {
			logoutPopup.value.open()
		} else {
			console.error('logoutPopup 引用无效，使用 uni.showModal 替代')
			uni.showModal({
				title: '退出登录',
				content: '确定要退出登录吗？',
				showCancel: true,
				cancelText: '取消',
				confirmText: '退出',
				confirmColor: '#ff3b30',
				success: (res) => {
					if (res.confirm) {
						handleLogoutConfirm()
					}
				}
			})
		}
	})
}

// 确认退出登录
const handleLogoutConfirm = async () => {
	try {
		// 清除登录状态
		clearLoginStatus()
		uni.removeStorageSync('token')
		
		// 重置状态
		isLoggedIn.value = false
		// todoCount.value = 0
		
		// 重置用户信息为默认值
		// userInfo.value = {
		// 	avatar: '/static/avatar-default.png',
		// 	nickname: '时光旅人',
		// 	userId: 'USER20231218'
		// }
		
		// 重置用户统计数据
		// userStats.value = {
		// 	todoCount: 0,
		// 	treeholeCount: 8,
		// 	focusDays: 45,
		// 	achievementCount: 5
		// }
		
		uni.showToast({
			title: '已退出登录',
			icon: 'success'
		})
		
		// 实际项目中，这里可能还需要调用退出登录的API
		// await apiLogout()
		
	} catch (error) {
		console.error('退出登录失败:', error)
		uni.showToast({
			title: '退出登录失败',
			icon: 'error'
		})
	}
}

// 导航到其他页面
const navigateTo = (page) => {
	if (!isLoggedIn.value) {
		handleLogin()
		return
	}
	
	// 根据页面类型跳转到不同页面
	let url = ''
	switch (page) {
		case 'todo':
			url = '/pages/mine/minePost'
			break
		case 'settings':
			url = '/pages/settings/index'
			break
		case 'theme':
			url = '/pages/settings/theme'
			break
		case 'notification':
			url = '/pages/message/notification'
			break
		case 'backup':
			url = '/pages/settings/backup'
			break
		case 'feedback':
			url = '/pages/settings/feedback'
			break
		case 'about':
			url = '/pages/settings/about'
			break
		default:
			url = '/pages/mine/minePost'
	}
	
	uni.navigateTo({
	  url: url,
	  success: () => {
	    console.log(`跳转到${page}页面`)
	  },
	  fail: (err) => {
	    console.log('跳转失败:', err)
	    uni.showToast({
	      title: '页面暂未开发完成',
	      icon: 'none'
	    })
	  }
	})
}
</script>

<style lang="scss" scoped>
@import "../../common/style/base-style.scss";
.mine-container {
	padding-bottom: 40rpx;
	min-height: 100vh;
	background-color: #f8f8f8;
	
	// 未登录状态样式
	.unlogin-section {
		padding: 60rpx 30rpx;
		
		.unlogin-content {
			background: linear-gradient(135deg, $brand-theme-color, lighten($brand-theme-color, 20%));
			border-radius: 24rpx;
			padding: 80rpx 40rpx;
			text-align: center;
			color: #fff;
			margin-bottom: 40rpx;
			box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
			
			.unlogin-avatar {
				margin-bottom: 40rpx;
				
				.unlogin-avatar-img {
					width: 160rpx;
					height: 160rpx;
					border-radius: 50%;
					border: 6rpx solid rgba(255, 255, 255, 0.3);
				}
			}
			
			.unlogin-text {
				margin-bottom: 60rpx;
				
				.unlogin-title {
					display: block;
					font-size: 44rpx;
					font-weight: 700;
					margin-bottom: 20rpx;
				}
				
				.unlogin-desc {
					display: block;
					font-size: 28rpx;
					opacity: 0.9;
					line-height: 1.5;
				}
			}
			
			.login-btn {
				background-color: #fff;
				color: $brand-theme-color;
				height: 90rpx;
				line-height: 90rpx;
				border-radius: 45rpx;
				font-size: 34rpx;
				font-weight: 600;
				width: 100%;
				
				&::after {
					border: none;
				}
				
				&:active {
					opacity: 0.9;
				}
			}
		}
		
		.unlogin-features {
			background-color: #fff;
			border-radius: 24rpx;
			padding: 40rpx 30rpx;
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
			
			.features-title {
				display: block;
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
				margin-bottom: 30rpx;
				text-align: center;
			}
			
			.features-list {
				.feature-item {
					display: flex;
					align-items: center;
					padding: 20rpx 0;
					border-bottom: 1rpx solid #f5f5f5;
					
					&:last-child {
						border-bottom: none;
					}
					
					text {
						font-size: 30rpx;
						color: #333;
						margin-left: 20rpx;
					}
				}
			}
		}
	}
	
	// 已登录状态样式（原样式稍作调整）
	.user-info-section {
		background: linear-gradient(135deg, $brand-theme-color, lighten($brand-theme-color, 20%));
		padding: 80rpx 30rpx 60rpx;
		text-align: center;
		color: #fff;
		
		.user-avatar-container {
			position: relative;
			display: inline-block;
			margin-bottom: 30rpx;
			
			.user-avatar {
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				border: 4rpx solid rgba(255, 255, 255, 0.3);
			}
			
			.avatar-edit {
				position: absolute;
				bottom: 0;
				right: 0;
				width: 48rpx;
				height: 48rpx;
				background-color: rgba(0, 0, 0, 0.5);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2rpx solid #fff;
			}
		}
		
		.user-name-container {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 10rpx;
			
			.user-name {
				font-size: 44rpx;
				font-weight: 600;
				margin-right: 10rpx;
			}
		}
		
		.user-id {
			font-size: 28rpx;
			opacity: 0.8;
		}
	}
	
	.stats-section {
		background-color: #fff;
		margin: -40rpx 30rpx 0;
		border-radius: 24rpx;
		padding: 40rpx 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		position: relative;
		z-index: 1;
		
		.stats-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 20rpx;
			
			.stats-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 20rpx;
				
				.stats-value {
					font-size: 40rpx;
					font-weight: 700;
					color: #333;
					margin-bottom: 8rpx;
				}
				
				.stats-label {
					font-size: 26rpx;
					color: #666;
				}
			}
		}
	}
	
	.function-section,
	.tool-section {
		background-color: #fff;
		border-radius: 24rpx;
		margin: 30rpx;
		padding: 0 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		
		.function-list,
		.tool-list {
			.function-item,
			.tool-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx 0;
				border-bottom: 1rpx solid #f5f5f5;
				
				&:last-child {
					border-bottom: none;
				}
				
				.function-left,
				.tool-left {
					display: flex;
					align-items: center;
					
					.function-icon,
					.tool-icon {
						width: 60rpx;
						height: 60rpx;
						border-radius: 16rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 20rpx;
						
						&.settings-icon {
							background-color: #007aff;
						}
						
						&.theme-icon {
							background-color: #5856d6;
						}
						
						&.notification-icon {
							background-color: #ff2d55;
						}
						
						&.backup-icon {
							background-color: #34c759;
						}
						
						&.cache-icon {
							background-color: #ff9500;
						}
						
						&.feedback-icon {
							background-color: #5ac8fa;
						}
						
						&.about-icon {
							background-color: #af52de;
						}
					}
					
					.function-title,
					.tool-title {
						font-size: 32rpx;
						color: #333;
					}
				}
				
				.tool-right {
					display: flex;
					align-items: center;
					
					.cache-size {
						font-size: 28rpx;
						color: #999;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
	
	.logout-section {
		padding: 30rpx;
		
		.logout-btn {
			background-color: #ff3b30;
			color: #fff;
			height: 90rpx;
			border-radius: 45rpx;
			font-size: 34rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10rpx;
			
			&:active {
				opacity: 0.8;
			}
		}
	}
}
</style>