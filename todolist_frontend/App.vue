<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			let token = uni.getStorageSync('token') || false
			if (!token) {
			    console.log('no token')
				uni.showModal({
				  title: '温馨提示',
				  content: '授权微信登录后才能正常使用小程序功能',
				  success: (res) => {
				    if (res.confirm) {
				      console.log('用户点击了确定')
				      uni.showToast({
				        title: '点击了确定',
				        icon: 'success'
				      })
				    } else if (res.cancel) {
				      console.log('用户点击了取消')
				    }
					uni.reLaunch({
					    url: "/pages/mine/mine"
					})
				  }
				})
			    return
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
