import { request } from "@/utils/request.js"

export function apiCountTreeHolePostByUserId(userId){
	return request({
		url:`/treehole/count/${userId}`
	})	
}

export function apiDelTreeHolePost(postId){
	return request({
		url:`/treehole/${postId}`,
		method: "DELETE"
	})
}

export function apiGetUserOpenId(data = {}) {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (loginAuth) => {
        const params = {
          code: loginAuth.code
        }
        
        request({
          url: '/user/login',
          method: 'POST',
          data: params
        }).then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}