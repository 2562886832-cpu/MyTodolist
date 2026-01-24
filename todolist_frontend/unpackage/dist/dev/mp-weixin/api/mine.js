"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
function apiCountTreeHolePostByUserId(userId) {
  return utils_request.request({
    url: `/treehole/count/${userId}`
  });
}
function apiDelTreeHolePost(postId) {
  return utils_request.request({
    url: `/treehole/${postId}`,
    method: "DELETE"
  });
}
function apiGetUserOpenId(data = {}) {
  return new Promise((resolve, reject) => {
    common_vendor.index.login({
      provider: "weixin",
      success: (loginAuth) => {
        const params = {
          code: loginAuth.code
        };
        utils_request.request({
          url: "/user/login",
          method: "POST",
          data: params
        }).then((response) => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}
exports.apiCountTreeHolePostByUserId = apiCountTreeHolePostByUserId;
exports.apiDelTreeHolePost = apiDelTreeHolePost;
exports.apiGetUserOpenId = apiGetUserOpenId;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/mine.js.map
