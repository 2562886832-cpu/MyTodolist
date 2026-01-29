"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:8080/user";
function request(config = {}) {
  let {
    url,
    data = {},
    method = "GET",
    header = {
      // 'Content-Type': 'application/json'
      "authentication": common_vendor.index.getStorageSync("token") || null
    }
  } = config;
  url = BASE_URL + url;
  header["Content-Type"] = "application/json";
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url,
      data,
      method,
      header,
      success: (res) => {
        if (res.data.code === 1) {
          resolve(res.data);
        } else if (res.data.code === 0) {
          common_vendor.index.showModal({
            title: "错误提示",
            content: res.data.errMsg,
            showCancel: false
          });
          reject(res.data);
        } else if (res.statusCode === 401) {
          common_vendor.index.showToast({
            title: "error！请登陆！",
            icon: "fail"
          });
          reject(res.data);
        } else {
          common_vendor.index.showToast({
            title: res.data.errMsg,
            icon: "none"
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
