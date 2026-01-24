import { request } from "@/utils/request.js"

export function apiAddFocusRecord(data = {}){
	return request({
		url:`/focus-record/`,
		method:"POST",
		data:data,
	})	
}