"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/panel/panel.js";
  "./pages/data/data.js";
  "./pages/mine/mine.js";
  "./pages/clock/clock.js";
  "./pages/treehole/treehole.js";
  "./pages/test/test.js";
  "./pages/post/create.js";
  "./pages/mine/minePost.js";
  "./pages/post/postDetail.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
    let token = common_vendor.index.getStorageSync("token") || false;
    if (!token) {
      common_vendor.index.__f__("log", "at App.vue:7", "no token");
      common_vendor.index.showModal({
        title: "温馨提示",
        content: "授权微信登录后才能正常使用小程序功能",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.__f__("log", "at App.vue:13", "用户点击了确定");
            common_vendor.index.showToast({
              title: "点击了确定",
              icon: "success"
            });
          } else if (res.cancel) {
            common_vendor.index.__f__("log", "at App.vue:19", "用户点击了取消");
          }
          common_vendor.index.reLaunch({
            url: "/pages/mine/mine"
          });
        }
      });
      return;
    }
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:30", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:33", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
