"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const _sfc_main = {
  __name: "listForm",
  props: ["selectLocalDate"],
  emits: ["getSchedule"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const showForm = common_vendor.ref(false);
    common_vendor.ref(["低", "中", "高"]);
    const form = common_vendor.reactive({
      content: "",
      priority: 1,
      dayTime: "",
      startTime: "",
      endTime: "",
      isReminded: false
    });
    common_vendor.computed(() => {
      const d = /* @__PURE__ */ new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    });
    const open = () => {
      form.dayTime = props.selectLocalDate;
      form.startTime = `09:00`;
      form.endTime = `10:00`;
      showForm.value = true;
    };
    const submit = () => {
      let { content, dayTime, startTime, endTime, isReminded } = form;
      startTime = dayTime + "T" + startTime;
      endTime = dayTime + "T" + endTime;
      const userId = 1;
      const status = 0;
      if (!content || !startTime || !endTime) {
        common_vendor.index.showToast({ title: "请完善信息", icon: "none" });
        return;
      }
      if (startTime >= endTime) {
        common_vendor.index.showToast({ title: "结束时间必须晚于开始时间", icon: "none" });
        return;
      }
      common_vendor.index.__f__("log", "at components/listForm/listForm.vue:149", "提交数据", { userId, content, status, startTime, endTime, isReminded });
      api_apis.apiAddSchedule({ userId, content, status, startTime, endTime, isReminded });
      common_vendor.index.showToast({ title: "保存成功" });
      resetAndClose();
    };
    const resetAndClose = () => {
      form.content = "";
      form.priority = 1;
      form.startTime = "";
      form.endTime = "";
      form.isReminded = false;
      showForm.value = false;
    };
    __expose({
      open,
      submit,
      resetAndClose
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !showForm.value
      }, !showForm.value ? {
        b: common_vendor.o(open)
      } : {}, {
        c: showForm.value
      }, showForm.value ? {
        d: common_vendor.o(($event) => showForm.value = false)
      } : {}, {
        e: common_vendor.t(props.selectLocalDate),
        f: form.content,
        g: common_vendor.o(($event) => form.content = $event.detail.value),
        h: common_vendor.t(form.dayTime || "请选择开始时间"),
        i: form.dayTime,
        j: common_vendor.o((e) => form.dayTime = e.detail.value),
        k: common_vendor.t(form.startTime || "请选择开始时间"),
        l: form.startTime,
        m: common_vendor.o((e) => form.startTime = e.detail.value),
        n: common_vendor.t(form.endTime || "请选择结束时间"),
        o: form.endTime,
        p: common_vendor.o((e) => form.endTime = e.detail.value),
        q: form.isReminded,
        r: common_vendor.o((e) => form.isReminded = e.detail.value),
        s: common_vendor.o(($event) => _ctx.$emit("getSchedule")),
        t: common_vendor.o(submit),
        v: showForm.value ? 1 : ""
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ebd5ae7a"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/listForm/listForm.js.map
