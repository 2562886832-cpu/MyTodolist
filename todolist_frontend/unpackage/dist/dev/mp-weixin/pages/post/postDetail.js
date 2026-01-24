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
    const windowHeight = common_vendor.ref(0);
    const postSectionHeight = common_vendor.ref(0);
    const commentSectionHeight = common_vendor.ref(0);
    const queryParams = {
      page: 1,
      pageSize: 10,
      postId: null
    };
    let TreeHolePostComments = common_vendor.ref([]);
    const totalComments = common_vendor.ref();
    const noData = common_vendor.ref(false);
    const GetTreeHoldPostComments = async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      queryParams.postId = id;
      let res = await api_treehole.apiGetTreeHoldPostComments(queryParams);
      TreeHolePostComments.value = [...TreeHolePostComments.value, ...res.data.records];
      totalComments.value = res.data.total;
      if (queryParams.pageSize > res.data.length)
        noData.value = true;
      common_vendor.index.__f__("log", "at pages/post/postDetail.vue:237", res.data);
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
    const generateFakeComments = () => {
      const users = [
        { id: 101, name: "李四", avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png" },
        { id: 102, name: "王五", avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png" },
        { id: 103, name: "赵六", avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png" },
        { id: 104, name: "钱七", avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png" },
        { id: 105, name: "孙八", avatar: "https://pic.rmb.bdstatic.com/bjh/6528b9f3c5c2e4e2492c4e8e6d8d2c8c.png" }
      ];
      const commentContents = [
        "这个技巧真的很实用，感谢分享！",
        "Uniapp确实很方便，我正在用它开发一个项目",
        "有没有更详细的教程可以推荐？",
        "图片加载有点慢，有什么优化建议吗？",
        "我试了一下，效果非常好，节省了很多时间",
        "跨平台开发确实是大趋势",
        "请问支持小程序和H5同时发布吗？",
        "性能方面怎么样？",
        "感谢作者的分享，学到了",
        "收藏了，以后开发的时候可以试试"
      ];
      const replyContents = [
        "是的，我也觉得",
        "同问，求教程",
        "可以试试图片懒加载",
        "性能挺好的，我用了没发现什么问题",
        "支持的，我用过"
      ];
      const generatedComments = [];
      for (let i = 0; i < 8; i++) {
        const user = users[i % users.length];
        const commentTime = /* @__PURE__ */ new Date();
        commentTime.setHours(commentTime.getHours() - Math.floor(Math.random() * 24));
        commentTime.setMinutes(commentTime.getMinutes() - Math.floor(Math.random() * 60));
        const hasReplies = Math.random() > 0.5;
        const replyCount = hasReplies ? Math.floor(Math.random() * 3) + 1 : 0;
        const comment = {
          id: 1e3 + i,
          userId: user.id,
          userName: user.name,
          avatar: user.avatar,
          content: commentContents[i % commentContents.length],
          createTime: commentTime.toISOString(),
          likeCount: Math.floor(Math.random() * 50),
          likeStatus: Math.random() > 0.7,
          replyCount,
          replies: []
        };
        if (hasReplies && replyCount > 0) {
          for (let j = 0; j < Math.min(replyCount, 2); j++) {
            const replyUser = users[(i + j + 1) % users.length];
            const targetUser = j === 0 ? null : user;
            const replyTime = new Date(commentTime);
            replyTime.setMinutes(replyTime.getMinutes() + Math.floor(Math.random() * 60));
            comment.replies.push({
              id: 2e3 + i * 10 + j,
              userId: replyUser.id,
              userName: replyUser.name,
              targetUserId: targetUser ? targetUser.id : null,
              targetUserName: targetUser ? targetUser.name : null,
              content: replyContents[(i + j) % replyContents.length],
              createTime: replyTime.toISOString(),
              likeCount: Math.floor(Math.random() * 20),
              likeStatus: Math.random() > 0.8
            });
          }
        }
        generatedComments.push(comment);
      }
      comments.value = generatedComments;
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
    const handleLike = (postId, likeStatus) => {
      if (likeStatus) {
        post.value.likeCount--;
        post.value.likeStatus = false;
        common_vendor.index.showToast({
          title: "取消点赞",
          icon: "none"
        });
      } else {
        post.value.likeCount++;
        post.value.likeStatus = true;
        common_vendor.index.showToast({
          title: "点赞成功",
          icon: "success"
        });
      }
    };
    const showOperating = (postId, userId, content) => {
      common_vendor.index.__f__("log", "at pages/post/postDetail.vue:564", postId, userId, content);
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
            common_vendor.index.__f__("log", "at pages/post/postDetail.vue:586", deleteText);
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
            common_vendor.index.__f__("log", "at pages/post/postDetail.vue:598", "举报审核中...");
          }
        },
        fail: (res) => {
          common_vendor.index.__f__("log", "at pages/post/postDetail.vue:602", "取消操作");
        }
      });
    };
    const handleCommentLike = (commentId, likeStatus) => {
      common_vendor.index.__f__("log", "at pages/post/postDetail.vue:609", commentId);
      const updateCommentLike = (commentList) => {
        for (let comment of commentList) {
          if (comment.id === commentId) {
            if (likeStatus) {
              comment.likeCount--;
              comment.likeStatus = false;
            } else {
              comment.likeCount++;
              comment.likeStatus = true;
            }
            return true;
          }
          if (comment.replies && comment.replies.length > 0) {
            for (let reply of comment.replies) {
              if (reply.id === commentId) {
                if (likeStatus) {
                  reply.likeCount--;
                  reply.likeStatus = false;
                } else {
                  reply.likeCount++;
                  reply.likeStatus = true;
                }
                return true;
              }
            }
          }
        }
        return false;
      };
      if (updateCommentLike(comments.value)) {
        common_vendor.index.showToast({
          title: likeStatus ? "取消点赞" : "点赞成功",
          icon: "none"
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
      TreeHolePostComments.value = [];
      showReplyComment.value = "";
      commentInput.value = "";
      preTextReplyComment.value = "";
      parentId.value = null;
      queryParams.page = 1;
      queryParams.pageSize = 10;
      noData.value = false;
      GetTreeHoldPostComments(id);
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
    common_vendor.onLoad((options) => {
      post.value = common_vendor.index.getStorageSync("tempPostData");
      const { id } = post.value;
      GetTreeHoldPostComments(id);
      generateFakeComments();
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
        o: !common_vendor.unref(TreeHolePostComments).length && !noData.value
      }, !common_vendor.unref(TreeHolePostComments).length && !noData.value ? {
        p: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        q: common_vendor.f(common_vendor.unref(TreeHolePostComments), (comment, index, i0) => {
          return common_vendor.e({
            a: comment.avatar,
            b: common_vendor.t(comment.userName),
            c: common_vendor.o(($event) => handleCommentLike(comment.id, comment.likeStatus), comment.id),
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
                c: common_vendor.o(($event) => handleCommentLike(reply.id, reply.likeStatus), reply.id),
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
        r: common_vendor.unref(TreeHolePostComments).length || noData.value
      }, common_vendor.unref(TreeHolePostComments).length || noData.value ? {
        s: common_vendor.p({
          status: noData.value ? "noMore" : "loading"
        })
      } : {}, {
        t: hasMoreComments.value
      }, hasMoreComments.value ? {
        v: common_vendor.o(loadMoreComments)
      } : {}, {
        w: commentSectionHeight.value + "px",
        x: common_vendor.o(($event) => loadMore()),
        y: showReplyComment.value != ""
      }, showReplyComment.value != "" ? {
        z: common_vendor.t(showReplyComment.value)
      } : {}, {
        A: common_vendor.o(onCommentInput),
        B: commentInput.value,
        C: isInputFocus.value,
        D: common_vendor.o(onInputFocus),
        E: common_vendor.o(onInputBlur),
        F: common_assets._imports_1$1,
        G: common_vendor.o(toggleEmoji),
        H: commentInput.value.trim().length > 0 ? 1 : "",
        I: common_vendor.o(sendComment),
        J: commentInput.value.trim().length === 0
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/post/postDetail.js.map
