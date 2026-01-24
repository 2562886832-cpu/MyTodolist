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
  __name: "treehole",
  setup(__props, { expose: __expose }) {
    const queryParams = {
      page: 1,
      pageSize: 10
    };
    const TreeHolePostList = common_vendor.ref([]);
    const noData = common_vendor.ref(false);
    const getTreeHolePost = async () => {
      let res = await api_treehole.apiGetTreeHolePost(queryParams);
      TreeHolePostList.value = [...TreeHolePostList.value, ...res.data.records];
      if (queryParams.pageSize > res.data.records.length)
        noData.value = true;
      common_vendor.index.__f__("log", "at pages/treehole/treehole.vue:109", res.data);
    };
    const treeHoldPostLike = async (userId, postId, like) => {
      await api_treehole.apiTreeHoldPostLike({ userId, postId, like });
    };
    const activeCategory = common_vendor.ref(0);
    const categories = common_vendor.ref(["全部", "热门", "推荐", "科技", "生活", "美食", "旅行", "影视"]);
    const posts = common_vendor.ref([]);
    const hasMore = common_vendor.ref(true);
    const page = common_vendor.ref(1);
    common_vendor.ref({});
    common_vendor.onLoad(() => {
      loadPosts();
    });
    common_vendor.onShow(() => {
      queryParams.page = 1;
      queryParams.pageSize = 10;
      TreeHolePostList.value = [];
      noData.value = false;
      getTreeHolePost();
    });
    common_vendor.onReachBottom(() => {
      if (noData.value)
        return;
      queryParams.page++;
      getTreeHolePost();
    });
    common_vendor.onPullDownRefresh(() => {
      queryParams.page = 1;
      noData.value = false;
      TreeHolePostList.value = [];
      getTreeHolePost().then(() => {
        common_vendor.index.stopPullDownRefresh();
        common_vendor.index.showToast({
          title: "刷新成功",
          icon: "success"
        });
      }).catch((err) => {
        common_vendor.index.stopPullDownRefresh();
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "none"
        });
      });
    });
    const switchCategory = (index) => {
      activeCategory.value = index;
      posts.value = [];
      page.value = 1;
      hasMore.value = true;
      loadPosts();
    };
    const loadPosts = () => {
      const mockPosts = generateMockPosts();
      if (page.value === 1) {
        posts.value = mockPosts;
      } else {
        posts.value = [...posts.value, ...mockPosts];
      }
    };
    const loadMorePosts = () => {
      page.value++;
      loadPosts();
    };
    const generateMockPosts = () => {
      const categoryList = categories.value.slice(2);
      const usernames = ["张三", "李四", "王五", "赵六", "小明", "小红"];
      const avatars = [
        "https://via.placeholder.com/40/007aff/ffffff?text=用户1",
        "https://via.placeholder.com/40/34c759/ffffff?text=用户2",
        "https://via.placeholder.com/40/ff9500/ffffff?text=用户3",
        "https://via.placeholder.com/40/ff3b30/ffffff?text=用户4"
      ];
      const mockImages = [
        "https://via.placeholder.com/300x200/007aff/ffffff?text=图片1",
        "https://via.placeholder.com/300x200/34c759/ffffff?text=图片2",
        "https://via.placeholder.com/300x200/ff9500/ffffff?text=图片3"
      ];
      return Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        username: usernames[Math.floor(Math.random() * usernames.length)],
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        category: categoryList[Math.floor(Math.random() * categoryList.length)],
        time: formatTime(new Date(Date.now() - Math.random() * 1e9)),
        content: `这是第${page.value}页的第${i + 1}条帖子内容。这是一个示例内容，展示了帖子的基本结构。用户可以在这里发布自己的想法、分享生活点滴。`,
        images: Math.random() > 0.3 ? [mockImages[Math.floor(Math.random() * mockImages.length)]] : [],
        likeCount: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * 50),
        liked: Math.random() > 0.5
      }));
    };
    const formatTime = (date) => {
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      const dayDiff = Math.floor(diff / (1e3 * 60 * 60 * 24));
      if (dayDiff === 0) {
        const hourDiff = Math.floor(diff / (1e3 * 60 * 60));
        if (hourDiff === 0) {
          return `${Math.floor(diff / (1e3 * 60))}分钟前`;
        }
        return `${hourDiff}小时前`;
      } else if (dayDiff === 1) {
        return "昨天";
      } else if (dayDiff < 7) {
        return `${dayDiff}天前`;
      } else {
        return `${date.getMonth() + 1}-${date.getDate()}`;
      }
    };
    const handleShare = (post) => {
      common_vendor.index.showActionSheet({
        itemList: ["分享到微信", "分享到QQ", "分享到微博", "复制链接"],
        success: () => {
          common_vendor.index.showToast({
            title: `已分享：${post.username}的帖子`,
            icon: "success"
          });
        }
      });
    };
    const handleComment = (post) => {
      common_vendor.index.setStorageSync("tempPostData", post);
      common_vendor.index.navigateTo({
        url: "/pages/post/postDetail",
        success: () => {
          common_vendor.index.__f__("log", "at pages/treehole/treehole.vue:268", "跳转到帖子详情页");
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/treehole/treehole.vue:271", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "发布页面暂未开发完成",
            icon: "none"
          });
        }
      });
    };
    const handleLike = (id, likeStatus) => {
      const index = TreeHolePostList.value.findIndex((item) => item.id === id);
      if (index === -1)
        return;
      const post = TreeHolePostList.value[index];
      const newLikeStatus = likeStatus != 1 ? 1 : 0;
      post.likeStatus = newLikeStatus;
      post.likeCount = newLikeStatus ? post.likeCount + 1 : post.likeCount - 1;
      const like = newLikeStatus ? 1 : -1;
      treeHoldPostLike(1, id, like);
    };
    const previewImage = (images, currentIndex) => {
      common_vendor.index.previewImage({
        urls: images,
        current: currentIndex
      });
    };
    const gotoPublish = () => {
      common_vendor.index.navigateTo({
        url: "/pages/post/create",
        success: () => {
          common_vendor.index.__f__("log", "at pages/treehole/treehole.vue:314", "跳转到发布页面");
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/treehole/treehole.vue:317", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "发布页面暂未开发完成",
            icon: "none"
          });
        }
      });
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
    __expose({
      activeCategory,
      categories,
      posts,
      hasMore,
      page,
      switchCategory,
      loadMorePosts,
      handleShare,
      handleComment,
      handleLike,
      previewImage,
      gotoPublish
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !TreeHolePostList.value.length && !noData.value
      }, !TreeHolePostList.value.length && !noData.value ? {
        b: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        c: common_vendor.f(categories.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: activeCategory.value === index ? 1 : "",
            d: common_vendor.o(($event) => switchCategory(index), index)
          };
        }),
        d: common_vendor.f(TreeHolePostList.value, (post, index, i0) => {
          return common_vendor.e({
            a: post.avatar,
            b: common_vendor.t(post.userName),
            c: common_vendor.t(post.postClass),
            d: common_vendor.t(formatPostTimeSimple(post.createTime)),
            e: common_vendor.t(post.content),
            f: post.images && post.images.length
          }, post.images && post.images.length ? {
            g: common_vendor.f(post.images, (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => previewImage(post.images, imgIndex), imgIndex)
              };
            })
          } : {}, {
            h: common_vendor.o(($event) => handleShare(post), index),
            i: common_vendor.t(post.commentCount),
            j: common_vendor.o(($event) => handleComment(post), index),
            k: post.likeStatus ? "/static/icons/like-i.png" : "/static/icons/like-o.png",
            l: common_vendor.t(post.likeCount),
            m: post.likeStatus ? 1 : "",
            n: common_vendor.o(($event) => handleLike(post.id, post.likeStatus), index),
            o: index
          });
        }),
        e: common_assets._imports_0$1,
        f: common_assets._imports_1,
        g: TreeHolePostList.value.length || noData.value
      }, TreeHolePostList.value.length || noData.value ? {
        h: common_vendor.p({
          status: noData.value ? "noMore" : "loading"
        })
      } : {}, {
        i: common_vendor.o(gotoPublish)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2b7b037f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/treehole/treehole.js.map
