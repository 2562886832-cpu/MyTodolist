"use strict";
const utils_request = require("../utils/request.js");
function apiGetTreeHolePostByUserId(data = {}) {
  return utils_request.request({
    url: `/treehole/page?page=${data.page}&pageSize=${data.pageSize}&content=${data.content}&userId=${data.userId}`
  });
}
function apiGetTreeHolePost(data = {}) {
  return utils_request.request({
    url: `/treehole/page?page=${data.page}&pageSize=${data.pageSize}`
  });
}
function apiAddTreeHolePost(data = {}) {
  return utils_request.request({
    url: `/treehole/`,
    method: "POST",
    data
  });
}
function apiTreeHoldPostLike(data = {}) {
  return utils_request.request({
    url: `/treehole/like`,
    method: "PUT",
    data
  });
}
function apiGetTreeHoldPostComments(data = {}) {
  return utils_request.request({
    url: `/treehole/page/comments/${data.postId}?page=${data.page}&pageSize=${data.pageSize}`
  });
}
function apiAddTreeHolePostComment(data = {}) {
  return utils_request.request({
    url: `/treehole/comment`,
    method: "POST",
    data
  });
}
function apiDelTreeHolePostComment(commentId) {
  return utils_request.request({
    url: `/treehole/comment/${commentId}`,
    method: "DELETE"
  });
}
exports.apiAddTreeHolePost = apiAddTreeHolePost;
exports.apiAddTreeHolePostComment = apiAddTreeHolePostComment;
exports.apiDelTreeHolePostComment = apiDelTreeHolePostComment;
exports.apiGetTreeHoldPostComments = apiGetTreeHoldPostComments;
exports.apiGetTreeHolePost = apiGetTreeHolePost;
exports.apiGetTreeHolePostByUserId = apiGetTreeHolePostByUserId;
exports.apiTreeHoldPostLike = apiTreeHoldPostLike;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/treehole.js.map
