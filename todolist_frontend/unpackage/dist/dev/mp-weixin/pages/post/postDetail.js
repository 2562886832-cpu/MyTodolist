"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_treehole = require("../../api/treehole.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  _easycom_uni_load_more();
}
const _sfc_main = {
  __name: "postDetail",
  setup(__props) {
    const activeSort = common_vendor.ref("hot");
    const handleSortClick = (type) => {
      activeSort.value = type;
      if (type === "hot") {
        common_vendor.index.__f__("log", "at pages/post/postDetail.vue:242", "按最热排序");
        RefreshData();
        queryParams.is_new = false;
        GetTreeHoldPostComments(post_id.value);
      } else {
        common_vendor.index.__f__("log", "at pages/post/postDetail.vue:247", "按最新排序");
        RefreshData();
        queryParams.is_new = true;
        GetTreeHoldPostComments(post_id.value);
      }
    };
    const windowHeight = common_vendor.ref(0);
    const postSectionHeight = common_vendor.ref(0);
    const commentSectionHeight = common_vendor.ref(0);
    const queryParams = {
      page: 1,
      pageSize: 10,
      postId: null,
      is_new: false
    };
    let TreeHolePostComments = common_vendor.ref([]);
    const totalComments = common_vendor.ref();
    const noData = common_vendor.ref(false);
    const GetTreeHoldPostComments = async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      queryParams.postId = id;
      let res = await api_treehole.apiGetTreeHolePostComments(queryParams);
      TreeHolePostComments.value = [...TreeHolePostComments.value, ...res.data.records];
      totalComments.value = res.data.total;
      if (queryParams.pageSize > res.data.length)
        noData.value = true;
      common_vendor.index.__f__("log", "at pages/post/postDetail.vue:291", res.data);
    };
    const comments = common_vendor.ref([]);
    const hasMoreComments = common_vendor.ref(true);
    const commentPage = common_vendor.ref(1);
    common_vendor.ref(10);
    const commentInput = common_vendor.ref("");
    const isInputFocus = common_vendor.ref(false);
    common_vendor.ref(null);
    const calculateSectionHeights = () => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      windowHeight.value = systemInfo.windowHeight;
      const inputHeight = 50;
      postSectionHeight.value = windowHeight.value * 0.3;
      commentSectionHeight.value = windowHeight.value * 0.7 - inputHeight;
    };
    const formatPostTimeSimple = (timeArray) => {
      if (!timeArray || timeArray.length !== 6) {
        return "时间错误";
      }
      const [year, month, day, hour, minute, second] = timeArray;
      const postDate = new Date(year, month - 1, day, hour, minute, second);
      const now = /* @__PURE__ */ new Date();
      const diffMs = now - postDate;
      const diffSeconds = Math.floor(diffMs / 1e3);
      const diffMinutes = Math.floor(diffMs / (1e3 * 60));
      const diffHours = Math.floor(diffMs / (1e3 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
      if (diffSeconds < 60) {
        return "刚刚";
      } else if (diffMinutes < 60) {
        return `${diffMinutes}分钟前`;
      } else if (diffHours < 24) {
        return `${diffHours}小时前`;
      } else if (diffDays === 1) {
        return "昨天";
      } else if (diffDays === 2) {
        return "前天";
      } else if (diffDays <= 3) {
        return `${diffDays}天前`;
      } else {
        const formattedMonth = String(month).padStart(2, "0");
        const formattedDay = String(day).padStart(2, "0");
        const formattedHour = String(hour).padStart(2, "0");
        const formattedMinute = String(minute).padStart(2, "0");
        if (now.getFullYear() === year) {
          return `${formattedMonth}-${formattedDay} ${formattedHour}:${formattedMinute}`;
        } else {
          return `${year}-${formattedMonth}-${formattedDay} ${formattedHour}:${formattedMinute}`;
        }
      }
    };
    const loadMoreComments = () => {
      if (!hasMoreComments.value)
        return;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      setTimeout(() => {
        const newComments = [];
        for (let i = 0; i < 5; i++) {
          newComments.push({
            id: 2e3 + i,
            userId: 106 + i,
            userName: `用户${106 + i}`,
            avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png",
            content: `这是第${comments.value.length + i + 1}条评论`,
            createTime: (/* @__PURE__ */ new Date()).toISOString(),
            likeCount: Math.floor(Math.random() * 30),
            likeStatus: false,
            replyCount: 0,
            replies: []
          });
        }
        comments.value = [...comments.value, ...newComments];
        commentPage.value++;
        if (commentPage.value >= 3) {
          hasMoreComments.value = false;
        }
        common_vendor.index.hideLoading();
      }, 800);
    };
    const handleShare = (postData) => {
      common_vendor.index.showActionSheet({
        itemList: ["分享到微信", "分享到QQ", "分享到微博", "复制链接"],
        success: (res) => {
          if (res.tapIndex === 0) {
            common_vendor.index.showToast({
              title: "已分享到微信",
              icon: "success"
            });
          } else if (res.tapIndex === 1) {
            common_vendor.index.showToast({
              title: "已分享到QQ",
              icon: "success"
            });
          } else if (res.tapIndex === 2) {
            common_vendor.index.showToast({
              title: "已分享到微博",
              icon: "success"
            });
          } else if (res.tapIndex === 3) {
            common_vendor.index.setClipboardData({
              data: `https://example.com/post/${postData.id}`,
              success: () => {
                common_vendor.index.showToast({
                  title: "链接已复制",
                  icon: "success"
                });
              }
            });
          }
        }
      });
    };
    const showOperating = (postId, userId, content) => {
      common_vendor.index.__f__("log", "at pages/post/postDetail.vue:588", postId, userId, content);
      const deleteText = userId === 1 ? "删除" : "举报";
      common_vendor.index.showActionSheet({
        itemList: ["复制评论", deleteText],
        success: (res) => {
          const index = res.tapIndex;
          if (index === 0) {
            common_vendor.index.setClipboardData({
              data: content,
              success: () => {
                common_vendor.index.showToast({
                  title: "复制成功",
                  icon: "success"
                });
              }
            });
          } else if (index === 1 && userId === 1) {
            common_vendor.index.__f__("log", "at pages/post/postDetail.vue:610", deleteText);
            common_vendor.index.showModal({
              title: "提示",
              content: "确定删除吗？",
              success: (res2) => {
                if (res2.confirm) {
                  api_treehole.apiDelTreeHolePostComment(postId);
                  RefreshPage();
                }
              }
            });
          } else {
            common_vendor.index.__f__("log", "at pages/post/postDetail.vue:622", "举报审核中...");
          }
        },
        fail: (res) => {
          common_vendor.index.__f__("log", "at pages/post/postDetail.vue:626", "取消操作");
        }
      });
    };
    const treeHolePostLike = async (userId, postId, like) => {
      await apitreeHolePostLike({ userId, postId, like });
    };
    const handleLike = (postId, likeStatus) => {
      if (likeStatus) {
        post.value.likeCount--;
        post.value.likeStatus = false;
        common_vendor.index.setStorageSync("tempPostData", post.value);
        treeHolePostLike(1, postId, -1);
        common_vendor.index.showToast({
          title: "取消点赞",
          icon: "none"
        });
      } else {
        post.value.likeCount++;
        post.value.likeStatus = true;
        common_vendor.index.setStorageSync("tempPostData", post.value);
        treeHolePostLike(1, postId, 1);
        common_vendor.index.showToast({
          title: "点赞成功",
          icon: "success"
        });
      }
    };
    const treeHoleCommentLike = async (commentId, userId, postId, like) => {
      await api_treehole.apiTreeHoleCommentLike({ commentId, userId, postId, like });
    };
    const handleCommentLike = (comment) => {
      const { id, likeStatus, postId } = comment;
      common_vendor.index.__f__("log", "at pages/post/postDetail.vue:667", id, likeStatus, postId);
      if (likeStatus) {
        comment.likeCount--;
        comment.likeStatus = false;
        treeHoleCommentLike(id, 1, postId, -1);
        common_vendor.index.showToast({
          title: "取消点赞",
          icon: "none"
        });
      } else {
        comment.likeCount++;
        comment.likeStatus = true;
        treeHoleCommentLike(id, 1, postId, 1);
        common_vendor.index.showToast({
          title: "点赞成功",
          icon: "success"
        });
      }
    };
    let parentId = common_vendor.ref(null);
    const showReplyComment = common_vendor.ref("");
    const handleReply = (comment) => {
      parentId.value = comment.id;
      const splitComment = comment.content.length > 10 ? comment.content.substring(0, 12) + "..." : comment.content;
      showReplyComment.value = `回复 @${comment.userName}: ${splitComment}`;
    };
    const preTextReplyComment = common_vendor.ref("");
    const handleSubReply = (reply, comment) => {
      parentId.value = comment.id;
      preTextReplyComment.value = `回复 @${reply.userName}: `;
      const splitComment = reply.content.length > 10 ? reply.content.substring(0, 12) + "..." : reply.content;
      showReplyComment.value = `回复 @${reply.userName}: ${splitComment}`;
    };
    const onCommentInput = (e) => {
      commentInput.value = e.detail.value;
    };
    const onInputFocus = () => {
      isInputFocus.value = true;
    };
    const onInputBlur = () => {
      setTimeout(() => {
        isInputFocus.value = false;
      }, 100);
    };
    const toggleEmoji = () => {
      common_vendor.index.showToast({
        title: "表情功能待实现",
        icon: "none"
      });
    };
    const clear = () => {
      showReplyComment.value = "";
      parentId.value = null;
    };
    const loadMore = () => {
      const { id } = post.value;
      if (noData.value)
        return;
      queryParams.page++;
      GetTreeHoldPostComments(id);
    };
    const RefreshPage = () => {
      const { id } = post.value;
      RefreshData();
      GetTreeHoldPostComments(id);
    };
    const RefreshData = () => {
      TreeHolePostComments.value = [];
      showReplyComment.value = "";
      commentInput.value = "";
      preTextReplyComment.value = "";
      parentId.value = null;
      queryParams.page = 1;
      queryParams.pageSize = 10;
      noData.value = false;
    };
    const sendComment = () => {
      const { id } = post.value;
      const newComment = {
        postId: id,
        userId: 1,
        // 当前用户ID
        content: parentId.value != null ? preTextReplyComment.value + "" + commentInput.value : commentInput.value,
        parentId: parentId.value
      };
      api_treehole.apiAddTreeHolePostComment(newComment);
      RefreshPage();
    };
    const post = common_vendor.ref([]);
    const post_id = common_vendor.ref();
    common_vendor.onLoad((options) => {
      post.value = common_vendor.index.getStorageSync("tempPostData");
      const { id } = post.value;
      post_id.value = id;
      GetTreeHoldPostComments(id);
    });
    common_vendor.onReady(() => {
      calculateSectionHeights();
    });
    common_vendor.onShow(() => {
      setTimeout(() => {
        calculateSectionHeights();
      }, 100);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: post.value.avatar,
        b: common_vendor.t(post.value.userName),
        c: common_vendor.t(post.value.postClass),
        d: common_vendor.t(formatPostTimeSimple(post.value.createTime)),
        e: common_vendor.t(post.value.content),
        f: post.value.images && post.value.images.length
      }, post.value.images && post.value.images.length ? {} : {}, {
        g: common_assets._imports_0$1,
        h: common_vendor.o(($event) => handleShare(post.value)),
        i: post.value.likeStatus ? "/static/icons/like-i.png" : "/static/icons/like-o.png",
        j: common_vendor.t(post.value.likeCount),
        k: post.value.likeStatus ? 1 : "",
        l: common_vendor.o(($event) => handleLike(post.value.id, post.value.likeStatus)),
        m: common_vendor.o(($event) => clear()),
        n: common_vendor.t(totalComments.value),
        o: common_vendor.n(activeSort.value === "hot" ? "active" : ""),
        p: common_vendor.o(($event) => handleSortClick("hot")),
        q: common_vendor.n(activeSort.value === "new" ? "active" : ""),
        r: common_vendor.o(($event) => handleSortClick("new")),
        s: !common_vendor.unref(TreeHolePostComments).length && !noData.value
      }, !common_vendor.unref(TreeHolePostComments).length && !noData.value ? {
        t: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        v: common_vendor.f(common_vendor.unref(TreeHolePostComments), (comment, index, i0) => {
          return common_vendor.e({
            a: comment.avatar,
            b: common_vendor.t(comment.userName),
            c: common_vendor.o(($event) => handleCommentLike(comment), comment.id),
            d: comment.likeStatus ? "/static/icons/like-i.png" : "/static/icons/like-o.png",
            e: common_vendor.t(comment.likeCount),
            f: common_vendor.o(($event) => showOperating(comment.id, comment.userId, comment.content), comment.id),
            g: common_vendor.t(comment.content),
            h: common_vendor.t(formatPostTimeSimple(comment.createTime)),
            i: common_vendor.o(($event) => handleReply(comment), comment.id),
            j: comment.children && comment.children.length > 0
          }, comment.children && comment.children.length > 0 ? common_vendor.e({
            k: common_vendor.f(comment.children, (reply, k1, i1) => {
              return {
                a: reply.avatar,
                b: common_vendor.t(reply.userName),
                c: common_vendor.o(($event) => handleCommentLike(reply), reply.id),
                d: reply.likeStatus ? "/static/icons/like-i.png" : "/static/icons/like-o.png",
                e: common_vendor.t(reply.likeCount),
                f: common_vendor.o(($event) => showOperating(reply.id, reply.userId, reply.content), reply.id),
                g: common_vendor.t(reply.content),
                h: common_vendor.t(formatPostTimeSimple(reply.createTime)),
                i: common_vendor.o(($event) => handleSubReply(reply, comment), reply.id),
                j: reply.id
              };
            }),
            l: comment.replyCount > 2
          }, comment.replyCount > 2 ? {
            m: common_vendor.t(comment.replyCount - 2)
          } : {}) : {}, {
            n: comment.id
          });
        }),
        w: common_vendor.unref(TreeHolePostComments).length || noData.value
      }, common_vendor.unref(TreeHolePostComments).length || noData.value ? {
        x: common_vendor.p({
          status: noData.value ? "noMore" : "loading"
        })
      } : {}, {
        y: hasMoreComments.value
      }, hasMoreComments.value ? {
        z: common_vendor.o(loadMoreComments)
      } : {}, {
        A: commentSectionHeight.value + "px",
        B: common_vendor.o(($event) => loadMore()),
        C: showReplyComment.value != ""
      }, showReplyComment.value != "" ? {
        D: common_vendor.t(showReplyComment.value)
      } : {}, {
        E: common_vendor.o(onCommentInput),
        F: commentInput.value,
        G: isInputFocus.value,
        H: common_vendor.o(onInputFocus),
        I: common_vendor.o(onInputBlur),
        J: common_assets._imports_1$1,
        K: common_vendor.o(toggleEmoji),
        L: commentInput.value.trim().length > 0 ? 1 : "",
        M: common_vendor.o(sendComment),
        N: commentInput.value.trim().length === 0
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/post/postDetail.js.map
