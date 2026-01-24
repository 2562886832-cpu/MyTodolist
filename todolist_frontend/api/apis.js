import { request } from "@/utils/request.js"

export function apiGetScheduleByuserId(data={}){
	return request({
		url:"/schedule/date",
		data:data
	})	
}

export function apiGetScheduleById(id){
	return request({
		url:`/schedule?id=${id}`
	})	
}

export function apiAddSchedule(data={}){
	return request({
		url:"/schedule",
		method:"POST",
		data:data
	})	
}

export function apiDelSchedule(id){
	return request({
		url:`/schedule?id=${id}`,
		method:"DELETE",
	})	
}


export function apiStatusSchedule(data={}){
	return request({
		url:"/schedule/status",
		method:"PUT",
		data:data
	})	
}

export function apiUpdateSchedule(data={}){
	return request({
		url:"/schedule",
		method:"PUT",
		data:data
	})	
}

// export function apiGetSchedule(){
// 	return uni.request({
// 	    url: 'http://localhost:8080/user/schedule/1',
// 	    method: 'GET',
// 	    header: {
// 	        // 添加一些通用的请求头
// 	        'Content-Type': 'application/json'
// 	    }
// 	})
// }


// uni.request({
// 	    url: 'http://localhost:8080/book',
// 	    method: 'GET',
// 	    header: {
// 	        // 添加一些通用的请求头
// 	        'Content-Type': 'application/json'
// 	    },
// 		success: (res) => { 
// 		        console.log('简化测试成功:', res); 
// 		    },
// 		    fail: (err) => { 
// 		        console.error('详细错误信息:', err);
// 		        console.error('状态码:', err.statusCode);
// 		        console.error('错误消息:', err.errMsg);
// 		    }
// })