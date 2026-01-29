"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_mine = require("../../api/mine.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_uni_popup_dialog = common_vendor.resolveComponent("uni-popup-dialog");
  const _component_uni_popup = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _component_uni_popup_dialog + _component_uni_popup)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const STORAGE_KEY = "user_login_status";
const USER_INFO_KEY = "user_info";
const _sfc_main = {
  __name: "mine",
  setup(__props) {
    const isLoggedIn = common_vendor.ref(false);
    const todoCount = common_vendor.ref(0);
    const getTreeHolePost = async () => {
      try {
        let res = await api_mine.apiCountTreeHolePostByUserId(1);
        todoCount.value = res.data || 0;
        common_vendor.index.__f__("log", "at pages/mine/mine.vue:236", "获取帖子数量成功:", res.data);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine.vue:238", "获取帖子数量失败:", error);
        todoCount.value = 0;
      }
    };
    const userInfo = common_vendor.ref({});
    const userStats = common_vendor.ref({
      todoCount: 0,
      treeholeCount: 8,
      focusDays: 45,
      achievementCount: 5
    });
    const cacheSize = common_vendor.ref("125.8 MB");
    const namePopup = common_vendor.ref(null);
    const cachePopup = common_vendor.ref(null);
    const logoutPopup = common_vendor.ref(null);
    common_vendor.onMounted(() => {
      checkLoginStatus();
    });
    const checkLoginStatus = () => {
      try {
        const loginStatus = common_vendor.index.getStorageSync(STORAGE_KEY);
        const savedUserInfo = common_vendor.index.getStorageSync(USER_INFO_KEY);
        if (loginStatus && savedUserInfo) {
          isLoggedIn.value = true;
          userInfo.value = savedUserInfo;
          getTreeHolePost();
          common_vendor.index.__f__("log", "at pages/mine/mine.vue:283", "自动登录成功，用户:", savedUserInfo.nickname);
        } else {
          isLoggedIn.value = false;
          common_vendor.index.__f__("log", "at pages/mine/mine.vue:286", "未检测到登录状态");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine.vue:289", "读取登录状态失败:", error);
        isLoggedIn.value = false;
      }
    };
    const saveLoginStatus = () => {
      try {
        common_vendor.index.setStorageSync(STORAGE_KEY, true);
        common_vendor.index.setStorageSync(USER_INFO_KEY, userInfo.value);
        common_vendor.index.__f__("log", "at pages/mine/mine.vue:300", "登录状态已保存");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine.vue:302", "保存登录状态失败:", error);
      }
    };
    const clearLoginStatus = () => {
      try {
        common_vendor.index.removeStorageSync(STORAGE_KEY);
        common_vendor.index.removeStorageSync(USER_INFO_KEY);
        common_vendor.index.__f__("log", "at pages/mine/mine.vue:312", "登录状态已清除");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine.vue:314", "清除登录状态失败:", error);
      }
    };
    const generateUUID = () => {
      const hexStr = "xxxxxxxxxxxx".replace(/x/g, () => {
        const r = Math.random() * 16 | 0;
        return r.toString(16);
      });
      return `小海棠-${hexStr}`;
    };
    const handleLogin = () => {
      common_vendor.index.showModal({
        mask: true,
        title: "温馨提示",
        content: "授权微信登录后才能正常使用小程序功能",
        success(res) {
          if (res.confirm) {
            common_vendor.index.getUserProfile({
              desc: "获取你的昵称、头像",
              success: (userRes) => {
                if (userRes.errMsg == "getUserProfile:ok" && userRes.userInfo != void 0) {
                  userInfo.value = {
                    avatar: "/static/avatar-default.png",
                    nickname: generateUUID(),
                    userId: "USER20231218"
                  };
                  api_mine.apiGetUserOpenId(userInfo).then((res2) => {
                    isLoggedIn.value = true;
                    common_vendor.index.setStorageSync("token", res2.data.token);
                    common_vendor.index.setStorageSync("openId", res2.openId);
                    getTreeHolePost();
                    saveLoginStatus();
                    common_vendor.index.showToast({
                      title: "登录成功",
                      icon: "success"
                    });
                  }).catch((err) => {
                    common_vendor.index.showToast({
                      title: "登录失败",
                      icon: "none"
                    });
                  });
                } else {
                  common_vendor.index.showToast({
                    icon: "none",
                    title: "获取失败，请重试"
                  });
                }
              },
              fail: (error) => {
                common_vendor.index.__f__("error", "at pages/mine/mine.vue:389", "获取用户信息失败:", error);
              }
            });
          }
        }
      });
    };
    const handleAvatarClick = () => {
      if (!isLoggedIn.value) {
        handleLogin();
        return;
      }
      common_vendor.index.showToast({
        title: "选择头像功能开发中",
        icon: "none"
      });
    };
    const handleEditName = () => {
      if (!isLoggedIn.value) {
        handleLogin();
        return;
      }
      showNamePopup();
    };
    const showNamePopup = () => {
      common_vendor.nextTick$1(() => {
        if (namePopup.value && namePopup.value.open) {
          namePopup.value.open();
        } else {
          common_vendor.index.__f__("error", "at pages/mine/mine.vue:443", "namePopup 引用无效");
          common_vendor.index.showToast({
            title: "弹窗加载失败",
            icon: "error"
          });
        }
      });
    };
    const handleNameConfirm = (value) => {
      if (value && value.trim()) {
        userInfo.value.nickname = value.trim();
        saveLoginStatus();
        common_vendor.index.showToast({
          title: "昵称修改成功",
          icon: "success"
        });
      } else {
        common_vendor.index.showToast({
          title: "昵称不能为空",
          icon: "none"
        });
      }
    };
    const handleClearCache = () => {
      if (!isLoggedIn.value) {
        handleLogin();
        return;
      }
      showCachePopup();
    };
    const showCachePopup = () => {
      common_vendor.nextTick$1(() => {
        if (cachePopup.value && cachePopup.value.open) {
          cachePopup.value.open();
        } else {
          common_vendor.index.__f__("error", "at pages/mine/mine.vue:489", "cachePopup 引用无效");
          common_vendor.index.showModal({
            title: "清除缓存",
            content: "确定要清除所有缓存数据吗？",
            success: (res) => {
              if (res.confirm) {
                handleCacheConfirm();
              }
            }
          });
        }
      });
    };
    const handleCacheConfirm = () => {
      cacheSize.value = "0 MB";
      common_vendor.index.showToast({
        title: "缓存已清除",
        icon: "success"
      });
    };
    const showLogoutConfirm = () => {
      common_vendor.nextTick$1(() => {
        if (logoutPopup.value && logoutPopup.value.open) {
          logoutPopup.value.open();
        } else {
          common_vendor.index.__f__("error", "at pages/mine/mine.vue:523", "logoutPopup 引用无效，使用 uni.showModal 替代");
          common_vendor.index.showModal({
            title: "退出登录",
            content: "确定要退出登录吗？",
            showCancel: true,
            cancelText: "取消",
            confirmText: "退出",
            confirmColor: "#ff3b30",
            success: (res) => {
              if (res.confirm) {
                handleLogoutConfirm();
              }
            }
          });
        }
      });
    };
    const handleLogoutConfirm = async () => {
      try {
        clearLoginStatus();
        common_vendor.index.removeStorageSync("token");
        isLoggedIn.value = false;
        common_vendor.index.showToast({
          title: "已退出登录",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine.vue:576", "退出登录失败:", error);
        common_vendor.index.showToast({
          title: "退出登录失败",
          icon: "error"
        });
      }
    };
    const navigateTo = (page) => {
      if (!isLoggedIn.value) {
        handleLogin();
        return;
      }
      let url = "";
      switch (page) {
        case "todo":
          url = "/pages/mine/minePost";
          break;
        case "settings":
          url = "/pages/settings/index";
          break;
        case "theme":
          url = "/pages/settings/theme";
          break;
        case "notification":
          url = "/pages/message/notification";
          break;
        case "backup":
          url = "/pages/settings/backup";
          break;
        case "feedback":
          url = "/pages/settings/feedback";
          break;
        case "about":
          url = "/pages/settings/about";
          break;
        default:
          url = "/pages/mine/minePost";
      }
      common_vendor.index.navigateTo({
        url,
        success: () => {
          common_vendor.index.__f__("log", "at pages/mine/mine.vue:622", `跳转到${page}页面`);
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/mine/mine.vue:625", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "页面暂未开发完成",
            icon: "none"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        b: common_assets._imports_0,
        c: common_vendor.o(handleLogin),
        d: common_vendor.p({
          type: "checkbox-filled",
          size: "20",
          color: "#07c160"
        }),
        e: common_vendor.p({
          type: "checkbox-filled",
          size: "20",
          color: "#07c160"
        }),
        f: common_vendor.p({
          type: "checkbox-filled",
          size: "20",
          color: "#07c160"
        }),
        g: common_vendor.p({
          type: "checkbox-filled",
          size: "20",
          color: "#07c160"
        })
      } : {
        h: userInfo.value.avatar,
        i: common_vendor.p({
          type: "camera-filled",
          size: "20",
          color: "#fff"
        }),
        j: common_vendor.o(handleAvatarClick),
        k: common_vendor.t(userInfo.value.nickname),
        l: common_vendor.p({
          type: "compose",
          size: "20",
          color: "#999"
        }),
        m: common_vendor.o(handleEditName),
        n: common_vendor.t(userInfo.value.userId),
        o: common_vendor.t(todoCount.value),
        p: common_vendor.o(($event) => navigateTo("todo")),
        q: common_vendor.t(userStats.value.treeholeCount),
        r: common_vendor.o(($event) => navigateTo("treehole")),
        s: common_vendor.t(userStats.value.focusDays),
        t: common_vendor.o(($event) => navigateTo("focus")),
        v: common_vendor.t(userStats.value.achievementCount),
        w: common_vendor.o(($event) => navigateTo("achievement")),
        x: common_vendor.p({
          type: "gear-filled",
          size: "24",
          color: "#fff"
        }),
        y: common_vendor.p({
          type: "right",
          size: "18",
          color: "#ccc"
        }),
        z: common_vendor.o(($event) => navigateTo("settings")),
        A: common_vendor.p({
          type: "paintbrush-filled",
          size: "24",
          color: "#fff"
        }),
        B: common_vendor.p({
          type: "right",
          size: "18",
          color: "#ccc"
        }),
        C: common_vendor.o(($event) => navigateTo("theme")),
        D: common_vendor.p({
          type: "bell-filled",
          size: "24",
          color: "#fff"
        }),
        E: common_vendor.p({
          type: "right",
          size: "18",
          color: "#ccc"
        }),
        F: common_vendor.o(($event) => navigateTo("notification")),
        G: common_vendor.p({
          type: "cloud-upload-filled",
          size: "24",
          color: "#fff"
        }),
        H: common_vendor.p({
          type: "right",
          size: "18",
          color: "#ccc"
        }),
        I: common_vendor.o(($event) => navigateTo("backup")),
        J: common_vendor.p({
          type: "trash-filled",
          size: "24",
          color: "#fff"
        }),
        K: common_vendor.t(cacheSize.value),
        L: common_vendor.p({
          type: "right",
          size: "18",
          color: "#ccc"
        }),
        M: common_vendor.o(handleClearCache),
        N: common_vendor.p({
          type: "chatboxes-filled",
          size: "24",
          color: "#fff"
        }),
        O: common_vendor.p({
          type: "right",
          size: "18",
          color: "#ccc"
        }),
        P: common_vendor.o(($event) => navigateTo("feedback")),
        Q: common_vendor.p({
          type: "info-filled",
          size: "24",
          color: "#fff"
        }),
        R: common_vendor.p({
          type: "right",
          size: "18",
          color: "#ccc"
        }),
        S: common_vendor.o(($event) => navigateTo("about")),
        T: common_vendor.p({
          type: "undo-filled",
          size: "20",
          color: "#fff"
        }),
        U: common_vendor.o(showLogoutConfirm)
      }, {
        V: common_vendor.o(handleNameConfirm),
        W: common_vendor.p({
          mode: "input",
          title: "修改昵称",
          value: userInfo.value.nickname,
          placeholder: "请输入新昵称"
        }),
        X: common_vendor.sr(namePopup, "7c2ebfa5-21", {
          "k": "namePopup"
        }),
        Y: common_vendor.p({
          type: "dialog"
        }),
        Z: common_vendor.o(handleCacheConfirm),
        aa: common_vendor.p({
          mode: "base",
          type: "warn",
          title: "清除缓存",
          content: "确定要清除所有缓存数据吗？"
        }),
        ab: common_vendor.sr(cachePopup, "7c2ebfa5-23", {
          "k": "cachePopup"
        }),
        ac: common_vendor.p({
          type: "dialog"
        }),
        ad: common_vendor.o(handleLogoutConfirm),
        ae: common_vendor.p({
          mode: "base",
          type: "warn",
          title: "退出登录",
          content: "确定要退出登录吗？"
        }),
        af: common_vendor.sr(logoutPopup, "7c2ebfa5-25", {
          "k": "logoutPopup"
        }),
        ag: common_vendor.p({
          type: "dialog"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7c2ebfa5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/mine.js.map
