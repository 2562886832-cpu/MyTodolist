"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "SearchBar",
  props: {
    // 初始值
    value: {
      type: String,
      default: ""
    },
    // 占位符
    placeholder: {
      type: String,
      default: "请输入搜索关键词"
    },
    // 是否显示清除按钮
    showClear: {
      type: Boolean,
      default: true
    },
    // 是否显示取消按钮
    showCancel: {
      type: Boolean,
      default: false
    },
    // 最大输入长度
    maxlength: {
      type: Number,
      default: 50
    },
    // 热门搜索关键词
    hotKeywords: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      keyword: this.value,
      isActive: false,
      isFocus: false
    };
  },
  watch: {
    value(newVal) {
      this.keyword = newVal;
    },
    keyword(newVal) {
      this.$emit("input", newVal);
      this.$emit("change", newVal);
    }
  },
  methods: {
    // 聚焦输入框
    onFocus() {
      this.isActive = true;
      this.isFocus = true;
      this.$emit("focus");
    },
    // 失焦输入框
    onBlur() {
      this.isActive = false;
      this.$emit("blur");
    },
    // 搜索确认
    onSearch() {
      const keyword = this.keyword.trim();
      if (keyword) {
        this.$emit("search", keyword);
      }
    },
    // 清除关键词
    clearKeyword() {
      this.keyword = "";
      this.$emit("clear");
    },
    // 点击取消
    onCancel() {
      this.keyword = "";
      this.isActive = false;
      this.isFocus = false;
      this.$emit("cancel");
    },
    // 点击搜索框
    focusInput() {
      this.isFocus = true;
    },
    // 选择热门关键词
    selectHotKeyword(keyword) {
      this.keyword = keyword;
      this.$emit("select-hot", keyword);
      this.$emit("search", keyword);
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      type: "search",
      size: "20",
      color: "#999"
    }),
    b: $props.placeholder,
    c: $data.isFocus,
    d: common_vendor.o((...args) => $options.onFocus && $options.onFocus(...args)),
    e: common_vendor.o((...args) => $options.onBlur && $options.onBlur(...args)),
    f: common_vendor.o((...args) => $options.onSearch && $options.onSearch(...args)),
    g: $props.maxlength,
    h: $data.keyword,
    i: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    j: $data.keyword && $props.showClear
  }, $data.keyword && $props.showClear ? {
    k: common_vendor.p({
      type: "clear",
      size: "18",
      color: "#999"
    }),
    l: common_vendor.o((...args) => $options.clearKeyword && $options.clearKeyword(...args))
  } : {}, {
    m: $props.showCancel
  }, $props.showCancel ? {
    n: common_vendor.o((...args) => $options.onCancel && $options.onCancel(...args))
  } : {}, {
    o: $data.isActive ? 1 : "",
    p: common_vendor.o((...args) => $options.focusInput && $options.focusInput(...args)),
    q: $props.hotKeywords.length > 0 && !$data.keyword
  }, $props.hotKeywords.length > 0 && !$data.keyword ? {
    r: common_vendor.f($props.hotKeywords, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: common_vendor.o(($event) => $options.selectHotKeyword(item), index)
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-727d09f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/test/test.js.map
