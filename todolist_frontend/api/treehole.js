import { request } from "@/utils/request.js"

export function apiGetTreeHolePostByUserId(data = {}){
	return request({
		url:`/treehole/page?page=${data.page}&pageSize=${data.pageSize}&content=${data.content}&userId=${data.userId}`
	})	
}

export function apiGetTreeHolePost(data = {}){
	return request({
		url:`/treehole/page?page=${data.page}&pageSize=${data.pageSize}&content=${data.content}`
	})	
}


export function apiAddTreeHolePost(data = {}){
	return request({
		url:`/treehole/`,
		method:"POST",
		data:data
	})	
}

export function apiTreeHolePostLike(data = {}){
	return request({
		url:`/treehole/like`,
		method:"PUT",
		data:data
	})	
}

export function apiTreeHoleCommentLike(data = {}){
	return request({
		url:`/treehole-comment/like`,
		method:"PUT",
		data:data
	})	
}

export function apiGetTreeHolePostComments(data = {}){
	return request({
		url:`/treehole/page/comments/${data.postId}?page=${data.page}&pageSize=${data.pageSize}&is_new=${data.is_new}`
	})	
}

export function apiAddTreeHolePostComment(data = {}){
	return request({
		url:`/treehole/comment`,
		method:"POST",
		data:data
	})	
}

export function apiDelTreeHolePostComment(commentId){
	return request({
		url:`/treehole/comment/${commentId}`,
		method:"DELETE"
	})	
}
