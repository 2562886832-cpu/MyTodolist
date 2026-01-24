"use strict";
const utils_request = require("../utils/request.js");
function apiGetScheduleByuserId(data = {}) {
  return utils_request.request({
    url: "/schedule/date",
    data
  });
}
function apiGetScheduleById(id) {
  return utils_request.request({
    url: `/schedule?id=${id}`
  });
}
function apiAddSchedule(data = {}) {
  return utils_request.request({
    url: "/schedule",
    method: "POST",
    data
  });
}
function apiDelSchedule(id) {
  return utils_request.request({
    url: `/schedule?id=${id}`,
    method: "DELETE"
  });
}
function apiStatusSchedule(data = {}) {
  return utils_request.request({
    url: "/schedule/status",
    method: "PUT",
    data
  });
}
function apiUpdateSchedule(data = {}) {
  return utils_request.request({
    url: "/schedule",
    method: "PUT",
    data
  });
}
exports.apiAddSchedule = apiAddSchedule;
exports.apiDelSchedule = apiDelSchedule;
exports.apiGetScheduleById = apiGetScheduleById;
exports.apiGetScheduleByuserId = apiGetScheduleByuserId;
exports.apiStatusSchedule = apiStatusSchedule;
exports.apiUpdateSchedule = apiUpdateSchedule;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/apis.js.map
