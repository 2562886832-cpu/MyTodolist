"use strict";
const common_vendor = require("../../common/vendor.js");
const api_treehole = require("../../api/treehole.js");
const _sfc_main = {
  __name: "create",
  setup(__props) {
    const postContent = common_vendor.ref("");
    const uploadedImages = common_vendor.ref([]);
    const maxImageCount = common_vendor.ref(9);
    const postClass = common_vendor.ref("daily");
    const publishing = common_vendor.ref(false);
    const contentHeight = common_vendor.ref(0);
    const textAreaHeight = common_vendor.ref(0);
    const categoryList = common_vendor.reactive([
      { name: "日常分享", value: "daily" },
      { name: "经验交流", value: "experience" },
      { name: "问题求助", value: "help" },
      { name: "技术讨论", value: "tech" },
      { name: "生活技巧", value: "life" },
      { name: "其他", value: "other" }
    ]);
    const canPublish = common_vendor.computed(() => {
      return postContent.value.trim().length > 0 && !publishing.value;
    });
    const calculateHeights = () => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      const windowHeight = systemInfo.windowHeight;
      const windowWidth = systemInfo.windowWidth;
      const navBarHeight = 88 / 750 * windowWidth;
      contentHeight.value = windowHeight - navBarHeight;
      textAreaHeight.value = contentHeight.value * 0.4;
    };
    const onContentInput = (e) => {
      common_vendor.index.__f__("log", "at pages/post/create.vue:150", "当前字数:", e.detail.value.length);
    };
    const chooseImage = () => {
      const count = maxImageCount.value - uploadedImages.value.length;
      common_vendor.index.chooseImage({
        count,
        sizeType: ["compressed"],
        // 压缩图
        sourceType: ["album", "camera"],
        // 相册和相机
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          common_vendor.index.showLoading({
            title: "上传中..."
          });
          setTimeout(() => {
            uploadedImages.value = [...uploadedImages.value, ...tempFilePaths];
            common_vendor.index.hideLoading();
          }, 500);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/post/create.vue:196", "选择图片失败:", err);
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    };
    const removeImage = (index) => {
      uploadedImages.value.splice(index, 1);
    };
    const previewImage = (index) => {
      common_vendor.index.previewImage({
        current: index,
        urls: uploadedImages.value
      });
    };
    const selectCategory = (category) => {
      postClass.value = category;
    };
    const handlePublish = () => {
      if (!canPublish.value)
        return;
      if (postContent.value.trim().length < 5) {
        common_vendor.index.showToast({
          title: "内容至少5个字",
          icon: "none"
        });
        return;
      }
      publishing.value = true;
      let res = api_treehole.apiAddTreeHolePost({ userId: 1, content: postContent.value, postClass: postClass.value });
      common_vendor.index.__f__("log", "at pages/post/create.vue:235", "提交数据", "1", postContent.value, postClass.value);
      common_vendor.index.showLoading({
        title: "发布中..."
      });
      common_vendor.index.__f__("log", "at pages/post/create.vue:241", res);
      res.then((result) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success",
          duration: 1500
        });
        postContent.value = "";
        uploadedImages.value = [];
        postClass.value = "daily";
        publishing.value = false;
        common_vendor.index.reLaunch({
          url: "/pages/treehole/treehole",
          success: () => {
            common_vendor.index.__f__("log", "at pages/post/create.vue:262", "跳转到发布页面");
          },
          fail: (err) => {
            common_vendor.index.__f__("log", "at pages/post/create.vue:265", "跳转失败:", err);
            common_vendor.index.showToast({
              title: "发布页面暂未开发完成",
              icon: "none"
            });
          }
        });
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "发布失败",
          icon: "fail",
          duration: 1500
        });
        setTimeout(() => {
          publishing.value = false;
        }, 1500);
        common_vendor.index.__f__("log", "at pages/post/create.vue:282", "Promise出错", error);
      });
    };
    const viewRules = () => {
      common_vendor.index.showModal({
        title: "社区用户协议",
        content: "1. 请遵守国家法律法规\n2. 尊重他人，友善交流\n3. 不发布广告营销信息\n4. 保护个人隐私安全\n5. 确保内容原创性\n6. 及时举报违规内容",
        showCancel: false,
        confirmText: "我知道了"
      });
    };
    common_vendor.onLoad(() => {
      calculateHeights();
    });
    common_vendor.onReady(() => {
      setTimeout(() => {
        calculateHeights();
      }, 100);
    });
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: textAreaHeight.value + "px",
        b: common_vendor.o([($event) => postContent.value = $event.detail.value, onContentInput]),
        c: postContent.value,
        d: common_vendor.t(postContent.value.length),
        e: common_vendor.f(uploadedImages.value, (image, index, i0) => {
          return {
            a: image,
            b: common_vendor.o(($event) => removeImage(index), index),
            c: index,
            d: common_vendor.o(($event) => previewImage(index), index)
          };
        }),
        f: uploadedImages.value.length < maxImageCount.value
      }, uploadedImages.value.length < maxImageCount.value ? {
        g: common_vendor.o(chooseImage)
      } : {}, {
        h: uploadedImages.value.length > 0
      }, uploadedImages.value.length > 0 ? {
        i: common_vendor.t(uploadedImages.value.length),
        j: common_vendor.t(maxImageCount.value)
      } : {}, {
        k: common_vendor.f(categoryList, (category, index, i0) => {
          return {
            a: common_vendor.t(category.name),
            b: index,
            c: postClass.value === category.value ? 1 : "",
            d: common_vendor.o(($event) => selectCategory(category.value), index)
          };
        }),
        l: common_vendor.t(publishing.value ? "发布中..." : "立即发布"),
        m: !canPublish.value ? 1 : "",
        n: !canPublish.value,
        o: common_vendor.o(handlePublish),
        p: common_vendor.o(viewRules),
        q: contentHeight.value + "px"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4a9252c8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/post/create.js.map
