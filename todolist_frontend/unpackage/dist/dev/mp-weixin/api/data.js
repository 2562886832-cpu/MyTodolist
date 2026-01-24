"use strict";
const utils_request = require("../utils/request.js");
function apiCloumnChartsWeek(data = {}) {
  return utils_request.request({
    url: `/charts/cloumn/week?status=${data.status}&userId=${data.userId}`
  });
}
function apiCloumnChartsYear(data = {}) {
  return utils_request.request({
    url: `/charts/cloumn/year?status=${data.status}&userId=${data.userId}`
  });
}
function apiLineChartsWeek(data = {}) {
  return utils_request.request({
    url: `/charts/line/week?userId=${data.userId}`
  });
}
function apiLineChartsYear(data = {}) {
  return utils_request.request({
    url: `/charts/line/year?userId=${data.userId}`
  });
}
exports.apiCloumnChartsWeek = apiCloumnChartsWeek;
exports.apiCloumnChartsYear = apiCloumnChartsYear;
exports.apiLineChartsWeek = apiLineChartsWeek;
exports.apiLineChartsYear = apiLineChartsYear;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/data.js.map
