"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const api_clock = require("../../api/clock.js");
if (!Array) {
  const _easycom_alterForm2 = common_vendor.resolveComponent("alterForm");
  const _easycom_listForm2 = common_vendor.resolveComponent("listForm");
  (_easycom_alterForm2 + _easycom_listForm2)();
}
const _easycom_alterForm = () => "../../components/alterForm/alterForm.js";
const _easycom_listForm = () => "../../components/listForm/listForm.js";
if (!Math) {
  (_easycom_alterForm + _easycom_listForm)();
}
const _sfc_main = {
  __name: "clock",
  setup(__props) {
    const ScheduleOneDay = common_vendor.ref([]);
    const getSchedule = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      let res = await api_apis.apiGetScheduleByuserId({ userId: 1, begin: selectLocalDate.value, end: selectLocalDate.value });
      ScheduleOneDay.value = res.data;
      common_vendor.index.__f__("log", "at pages/clock/clock.vue:152", res.data);
    };
    getSchedule();
    const todoClick = (startTime, endTime) => {
      const res = calculateMinutesConsumed(startTime, endTime);
      setDuration(res);
    };
    const todoOperating = (userId) => {
      common_vendor.index.__f__("log", "at pages/clock/clock.vue:162", userId);
      common_vendor.index.showActionSheet({
        itemList: ["修改", "删除"],
        success: (res) => {
          const index = res.tapIndex;
          if (index === 0) {
            common_vendor.index.__f__("log", "at pages/clock/clock.vue:171", "修改");
            UpdateSchedule(userId);
          } else if (index === 1) {
            common_vendor.index.showModal({
              title: "提示",
              content: "确定删除吗？",
              success: (res2) => {
                if (res2.confirm) {
                  api_apis.apiDelSchedule(userId);
                  getSchedule();
                }
              }
            });
          }
        },
        fail: (res) => {
          common_vendor.index.__f__("log", "at pages/clock/clock.vue:187", "取消操作");
        }
      });
    };
    const showForm = common_vendor.ref(false);
    const updateData = common_vendor.ref(false);
    const UpdateSchedule = async (id) => {
      showForm.value = true;
      let res = await api_apis.apiGetScheduleById(id);
      res.data.createTime = formatDateTimeArray(res.data.createTime).substring(0, 10);
      res.data.startTime = formatDateTimeArray(res.data.startTime).substring(11);
      res.data.endTime = formatDateTimeArray(res.data.endTime).substring(11);
      updateData.value = res.data;
      common_vendor.index.__f__("log", "at pages/clock/clock.vue:203", updateData.value);
    };
    const isRunning = common_vendor.ref(false);
    const remainingSeconds = common_vendor.ref(1 * 60);
    const selectedDuration = common_vendor.ref(1);
    const timerInterval = common_vendor.ref(null);
    const canvasSize = common_vendor.ref(300);
    const currentDate = common_vendor.ref("");
    const selectLocalDate = common_vendor.ref("");
    common_vendor.ref([
      {
        id: 1,
        title: "晨间阅读",
        description: "阅读专业书籍30页",
        startTime: "08:00",
        duration: 60,
        color: "#FFEED6",
        completed: true
      },
      {
        id: 2,
        title: "项目开发",
        description: "完成用户模块功能",
        startTime: "09:30",
        duration: 120,
        color: "#D6E4FF",
        completed: false
      },
      {
        id: 3,
        title: "团队会议",
        description: "周进度汇报",
        startTime: "14:00",
        duration: 45,
        color: "#E0F7FA",
        completed: false
      },
      {
        id: 4,
        title: "学习新框架",
        description: "Vue3高级特性",
        startTime: "15:30",
        duration: 90,
        color: "#F1D6FF",
        completed: false
      },
      {
        id: 5,
        title: "健身锻炼",
        description: "健身房有氧运动",
        startTime: "18:00",
        duration: 60,
        color: "#D6FFE2",
        completed: false
      },
      {
        id: 6,
        title: "晚间学习",
        description: "算法题练习",
        startTime: "20:00",
        duration: 90,
        color: "#FFF0D6",
        completed: false
      }
    ]);
    common_vendor.ref([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);
    const formatScheduleTimeSimple = (timeArray) => {
      if (!timeArray || timeArray.length !== 5) {
        return "时间错误";
      }
      const [year, month, day, hour, minute] = timeArray;
      const formattedHour = String(hour).padStart(2, "0");
      const formattedMinute = String(minute).padStart(2, "0");
      return `${formattedHour}:${formattedMinute}`;
    };
    const formattedTime = common_vendor.computed(() => {
      const minutes = Math.floor(remainingSeconds.value / 60);
      const seconds = remainingSeconds.value % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    });
    const timerStatus = common_vendor.computed(() => {
      if (!isRunning.value && remainingSeconds.value === selectedDuration.value * 60) {
        return "准备开始";
      } else if (isRunning.value) {
        return "专注中...";
      } else {
        return "已暂停";
      }
    });
    common_vendor.onMounted(() => {
      setCurrentDate();
      initCanvas();
    });
    common_vendor.onUnmounted(() => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
      }
    });
    const setCurrentDate = () => {
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
      const weekday = weekdays[now.getDay()];
      currentDate.value = `${year}年${month}月${day}日 星期${weekday}`;
      month = month.toString().padStart(2, "0");
      day = day.toString().padStart(2, "0");
      selectLocalDate.value = `${year}-${month}-${day}`;
    };
    const initCanvas = () => {
      const ctx = common_vendor.index.createCanvasContext("progressCanvas");
      drawProgress(ctx, 0);
    };
    const drawProgress = (ctx, progress) => {
      const center = canvasSize.value / 2;
      const radius = canvasSize.value / 2 - 10;
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + 2 * Math.PI * progress;
      ctx.clearRect(0, 0, canvasSize.value, canvasSize.value);
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
      ctx.setStrokeStyle("#EEEEEE");
      ctx.setLineWidth(12);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.setStrokeStyle("#4CAF50");
      ctx.setLineWidth(12);
      ctx.setLineCap("round");
      ctx.stroke();
      ctx.draw();
    };
    const toggleTimer = () => {
      if (isRunning.value) {
        pauseTimer();
      } else {
        startTimer();
      }
    };
    const startTimer = () => {
      if (remainingSeconds.value <= 0)
        return;
      isRunning.value = true;
      timerInterval.value = setInterval(() => {
        remainingSeconds.value--;
        const progress = 1 - remainingSeconds.value / (selectedDuration.value * 60);
        const ctx = common_vendor.index.createCanvasContext("progressCanvas");
        drawProgress(ctx, progress);
        if (remainingSeconds.value <= 0) {
          timerComplete();
        }
      }, 1e3);
    };
    const pauseTimer = () => {
      isRunning.value = false;
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
        timerInterval.value = null;
      }
    };
    const resetTimer = () => {
      pauseTimer();
      remainingSeconds.value = selectedDuration.value * 60;
      const ctx = common_vendor.index.createCanvasContext("progressCanvas");
      drawProgress(ctx, 0);
    };
    const timerComplete = () => {
      const userId = 1;
      const duration = selectedDuration.value;
      api_clock.apiAddFocusRecord({ userId, duration });
      common_vendor.index.__f__("log", "at pages/clock/clock.vue:424", userId, duration);
      pauseTimer();
      common_vendor.index.showModal({
        title: "专注完成",
        content: "恭喜您完成了一次专注！用时" + duration + "分钟",
        showCancel: false,
        success: () => {
          resetTimer();
        }
      });
    };
    const setDuration = (minutes) => {
      selectedDuration.value = minutes;
      resetTimer();
    };
    const selectTodo = (Schedule) => {
      common_vendor.index.showModal({
        content: `${Schedule.content}
时长: ${calculateTimeConsumed(Schedule.startTime, Schedule.endTime)}
`,
        confirmText: Schedule.status ? "标记未完成" : "标记完成",
        cancelText: "关闭",
        success: (res) => {
          if (res.confirm) {
            api_apis.apiStatusSchedule({ id: Schedule.id, status: Schedule.status ? 0 : 1 }).then((response) => {
              if (response.code == 1) {
                Schedule.status = Schedule.status ? 0 : 1;
                getSchedule();
              } else {
                common_vendor.index.showToast({
                  title: "修改失败",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    };
    const calculateTimeConsumed = (startTime, endTime) => {
      if (!Array.isArray(startTime) || !Array.isArray(endTime) || startTime.length < 5 || endTime.length < 5) {
        return "0分钟";
      }
      try {
        const start = new Date(
          startTime[0],
          startTime[1] - 1,
          startTime[2],
          startTime[3],
          startTime[4]
        );
        const end = new Date(
          endTime[0],
          endTime[1] - 1,
          endTime[2],
          endTime[3],
          endTime[4]
        );
        const diffMs = end - start;
        if (diffMs < 0) {
          return "时间异常";
        }
        const totalMinutes = Math.floor(diffMs / (1e3 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0 && minutes > 0) {
          return `${hours}小时${minutes}分钟`;
        } else if (hours > 0) {
          return `${hours}小时`;
        } else if (minutes > 0) {
          return `${minutes}分钟`;
        } else {
          return "0分钟";
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/clock/clock.vue:539", "计算时间消耗时出错:", error);
        return "计算错误";
      }
    };
    const calculateMinutesConsumed = (startTime, endTime) => {
      if (!Array.isArray(startTime) || !Array.isArray(endTime)) {
        common_vendor.index.__f__("warn", "at pages/clock/clock.vue:547", "参数不是数组");
        return 0;
      }
      if (startTime.length < 5 || endTime.length < 5) {
        common_vendor.index.__f__("warn", "at pages/clock/clock.vue:552", "时间数组长度不足");
        return 0;
      }
      try {
        const start = new Date(
          startTime[0],
          startTime[1] - 1,
          startTime[2],
          startTime[3],
          startTime[4]
        );
        const end = new Date(
          endTime[0],
          endTime[1] - 1,
          endTime[2],
          endTime[3],
          endTime[4]
        );
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          common_vendor.index.__f__("warn", "at pages/clock/clock.vue:576", "无效的日期时间");
          return 0;
        }
        const diffMs = end - start;
        if (diffMs < 0) {
          common_vendor.index.__f__("warn", "at pages/clock/clock.vue:585", "结束时间早于开始时间");
          return 0;
        }
        return Math.floor(diffMs / (1e3 * 60));
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/clock/clock.vue:592", "计算分钟数时出错:", error);
        return 0;
      }
    };
    function formatDateTimeArray(timeArray) {
      const [year, month, day, hour, minute] = timeArray;
      const pad = (num) => num.toString().padStart(2, "0");
      const formattedYear = year.toString();
      const formattedMonth = pad(month);
      const formattedDay = pad(day);
      const formattedHour = pad(hour);
      const formattedMinute = pad(minute);
      return `${formattedYear}-${formattedMonth}-${formattedDay}-${formattedHour}:${formattedMinute}`;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(formattedTime.value),
        b: common_vendor.t(timerStatus.value),
        c: common_vendor.t(isRunning.value ? "暂停" : "开始"),
        d: isRunning.value ? 1 : "",
        e: common_vendor.o(toggleTimer),
        f: common_vendor.o(resetTimer),
        g: isRunning.value,
        h: selectedDuration.value === 25 ? 1 : "",
        i: common_vendor.o(($event) => setDuration(25)),
        j: selectedDuration.value === 40 ? 1 : "",
        k: common_vendor.o(($event) => setDuration(40)),
        l: selectedDuration.value === 60 ? 1 : "",
        m: common_vendor.o(($event) => setDuration(60)),
        n: selectedDuration.value === 90 ? 1 : "",
        o: common_vendor.o(($event) => setDuration(90)),
        p: common_vendor.t(currentDate.value),
        q: ScheduleOneDay.value.length == 0
      }, ScheduleOneDay.value.length == 0 ? {} : {}, {
        r: common_vendor.f(ScheduleOneDay.value, (Schedule, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(formatScheduleTimeSimple(Schedule.startTime)),
            c: common_vendor.t(formatScheduleTimeSimple(Schedule.endTime)),
            d: common_vendor.t(Schedule.content),
            e: common_vendor.t(Schedule.status ? "✓" : "○"),
            f: Schedule.status ? 1 : "",
            g: common_vendor.o(($event) => selectTodo(Schedule), Schedule.id),
            h: Schedule.id,
            i: common_vendor.o(($event) => todoOperating(Schedule.id), Schedule.id),
            j: common_vendor.o(($event) => todoClick(Schedule.startTime, Schedule.endTime), Schedule.id)
          };
        }),
        s: common_vendor.o(($event) => showForm.value = $event),
        t: common_vendor.o(getSchedule),
        v: common_vendor.p({
          showForm: showForm.value,
          updateData: updateData.value
        }),
        w: common_vendor.o(getSchedule),
        x: common_vendor.p({
          selectLocalDate: selectLocalDate.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a4507d51"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/clock/clock.js.map
