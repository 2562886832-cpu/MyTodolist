
const BASE_URL = 'http://localhost:8080/user';

export function request(config={}){	
	let {
		url,
		data={},
		method="GET",
		header={
			// 'Content-Type': 'application/json'
			'authentication':uni.getStorageSync('token') || null
		}
	} = config
	
	url = BASE_URL+url
	header['Content-Type'] = 'application/json'
	
	
	return new Promise((resolve,reject)=>{		
		uni.request({
			url,
			data,
			method,
			header,
			success:res=>{
				if(res.data.code===1){
					resolve(res.data)
				}else if(res.data.code === 0){
					uni.showModal({
						title:"错误提示",
						content:res.data.errMsg,
						showCancel:false
					})
					reject(res.data)
				}else{
					uni.showToast({
						title:res.data.errMsg,
						icon:"none"
					})
					reject(res.data)
				}				
			},
			fail:err=>{
				reject(err)
			}
		})
	})
}
