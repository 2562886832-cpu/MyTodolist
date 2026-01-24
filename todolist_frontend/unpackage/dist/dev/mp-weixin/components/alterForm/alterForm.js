"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const _sfc_main = {
  __name: "alterForm",
  props: ["showForm", "updateData"],
  emits: ["update:showForm", "getSchedule"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function showFormChange() {
      emit("update:showForm", false);
    }
    const showForm = common_vendor.ref(false);
    common_vendor.ref(["低", "中", "高"]);
    common_vendor.computed(() => {
      const d = /* @__PURE__ */ new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    });
    const submit = () => {
      let { id, userId, content, status, createTime, startTime, endTime, remindTime, isReminded } = props.updateData;
      startTime = createTime + "T" + startTime;
      endTime = createTime + "T" + endTime;
      createTime = startTime;
      remindTime = startTime;
      if (!content || !startTime || !endTime) {
        common_vendor.index.showToast({ title: "请完善信息", icon: "none" });
        return;
      }
      if (startTime >= endTime) {
        common_vendor.index.showToast({ title: "结束时间必须晚于开始时间", icon: "none" });
        return;
      }
      api_apis.apiUpdateSchedule({ id, userId, content, status, createTime, startTime, endTime, remindTime, isReminded });
      common_vendor.index.__f__("log", "at components/alterForm/alterForm.vue:150", "提交数据", { id, userId, content, status, createTime, startTime, endTime, remindTime, isReminded });
      showFormChange();
      common_vendor.index.showToast({ title: "保存成功" });
      resetAndClose();
    };
    const resetAndClose = () => {
      props.updateData.content = "";
      props.updateData.startTime = "";
      props.updateData.endTime = "";
      props.updateData.isReminded = false;
      showForm.value = false;
    };
    __expose({
      open,
      submit,
      resetAndClose
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.showForm
      }, props.showForm ? {
        b: common_vendor.o(($event) => showFormChange())
      } : {}, {
        c: props.updateData.content,
        d: common_vendor.o(($event) => props.updateData.content = $event.detail.value),
        e: common_vendor.t(props.updateData.createTime || "请选择开始时间"),
        f: props.updateData.createTime,
        g: common_vendor.o((e) => props.updateData.createTime = e.detail.value),
        h: common_vendor.t(props.updateData.startTime || "请选择开始时间"),
        i: props.updateData.startTime,
        j: common_vendor.o((e) => props.updateData.startTime = e.detail.value),
        k: common_vendor.t(props.updateData.endTime || "请选择结束时间"),
        l: props.updateData.endTime,
        m: common_vendor.o((e) => props.updateData.endTime = e.detail.value),
        n: props.updateData.isReminded,
        o: common_vendor.o((e) => props.updateData.isReminded = e.detail.value),
        p: common_vendor.o(($event) => _ctx.$emit("getSchedule")),
        q: common_vendor.o(submit),
        r: props.showForm ? 1 : ""
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e416a595"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/alterForm/alterForm.js.map
