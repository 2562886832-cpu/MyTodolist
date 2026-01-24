import { request } from "@/utils/request.js"

export function apiCloumnChartsWeek(data = {}){
	return request({
		url:`/charts/cloumn/week?status=${data.status}&userId=${data.userId}`
	})	
}

export function apiCloumnChartsYear(data = {}){
	return request({
		url:`/charts/cloumn/year?status=${data.status}&userId=${data.userId}`
	})	
}

export function apiLineChartsWeek(data = {}){
	return request({
		url:`/charts/line/week?userId=${data.userId}`
	})	
}

export function apiLineChartsYear(data = {}){
	return request({
		url:`/charts/line/year?userId=${data.userId}`
	})	
}