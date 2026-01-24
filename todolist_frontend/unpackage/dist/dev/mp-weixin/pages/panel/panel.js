"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_listForm2 = common_vendor.resolveComponent("listForm");
  const _easycom_alterForm2 = common_vendor.resolveComponent("alterForm");
  (_easycom_listForm2 + _easycom_alterForm2)();
}
const _easycom_listForm = () => "../../components/listForm/listForm.js";
const _easycom_alterForm = () => "../../components/alterForm/alterForm.js";
if (!Math) {
  (_easycom_listForm + _easycom_alterForm)();
}
const _sfc_main = {
  __name: "panel",
  setup(__props) {
    const ScheduleList = common_vendor.ref([]);
    const limitedData = common_vendor.ref([]);
    const getSchedule = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      let res = await api_apis.apiGetScheduleByuserId({ userId: 1, begin: "2026-01-01", end: "2026-01-30" });
      ScheduleList.value = res.data;
      limitedData.value = copyWithLimit(ScheduleList, 3);
      common_vendor.index.__f__("log", "at pages/panel/panel.vue:287", res.data);
    };
    getSchedule();
    const showForm = common_vendor.ref(false);
    const updateData = common_vendor.ref(false);
    const onUpdate = async (id) => {
      showForm.value = true;
      let res = await api_apis.apiGetScheduleById(id);
      res.data.createTime = formatDateTimeArray(res.data.createTime).substring(0, 10);
      res.data.startTime = formatDateTimeArray(res.data.startTime).substring(11);
      res.data.endTime = formatDateTimeArray(res.data.endTime).substring(11);
      updateData.value = res.data;
      common_vendor.index.__f__("log", "at pages/panel/panel.vue:301", updateData.value);
    };
    function onDelete(id) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定删除吗？",
        success: (res) => {
          if (res.confirm) {
            api_apis.apiDelSchedule(id);
            common_vendor.index.__f__("log", "at pages/panel/panel.vue:311", id);
            getSchedule();
          }
        }
      });
    }
    let status = null;
    function handleCheckboxChange(value, checked) {
      status = checked ? 1 : 0;
      api_apis.apiStatusSchedule({ id: value, status });
      getSchedule();
    }
    function copyWithLimit(tasksRef, maxPerDay = 3) {
      const tasks = tasksRef.value;
      const dayCounts = {};
      const filteredTasks = [];
      tasks.forEach((task) => {
        const [year, month, day] = task.createTime;
        const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (!dayCounts[dateKey]) {
          dayCounts[dateKey] = 0;
        }
        if (dayCounts[dateKey] < maxPerDay) {
          const filteredTask = {
            content: task.content,
            createTime: [...task.createTime]
            // 使用展开运算符创建副本
          };
          filteredTasks.push(filteredTask);
          dayCounts[dateKey]++;
        }
      });
      return filteredTasks;
    }
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
    const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
    const currentDate = common_vendor.ref(/* @__PURE__ */ new Date());
    const currentYear = common_vendor.ref(currentDate.value.getFullYear());
    const currentMonth = common_vendor.ref(currentDate.value.getMonth());
    common_vendor.ref(currentDate.value.getDate());
    const displayYear = common_vendor.ref(currentYear.value);
    const displayMonth = common_vendor.ref(currentMonth.value);
    const isMonthView = common_vendor.ref(true);
    const showLunar = common_vendor.ref(false);
    const showSchedule = common_vendor.ref(false);
    const calendarDates = common_vendor.ref([]);
    const currentWeekIndex = common_vendor.ref(0);
    const currentWeekDates = common_vendor.ref([]);
    const touchStartY = common_vendor.ref(0);
    const touchMoveY = common_vendor.ref(0);
    const isTouching = common_vendor.ref(false);
    const calendarTranslateY = common_vendor.ref(0);
    const lastTranslateY = common_vendor.ref(0);
    const calendarState = common_vendor.ref(0);
    const weekGap = common_vendor.ref(8);
    const showHint = common_vendor.ref(false);
    const hintText = common_vendor.ref("");
    const selectedDate = common_vendor.ref(null);
    const notedDates = common_vendor.ref([]);
    common_vendor.ref(false);
    common_vendor.ref(currentYear.value);
    common_vendor.ref(currentMonth.value);
    const holidays = common_vendor.ref({
      "1-1": "元旦",
      "2-14": "情人节",
      "3-8": "妇女节",
      "5-1": "劳动节",
      "6-1": "儿童节",
      "10-1": "国庆节",
      "12-25": "圣诞节"
    });
    const displayWeekCount = common_vendor.computed(() => {
      if (calendarState.value === 1) {
        return 1;
      }
      return Math.ceil(calendarDates.value.length / 7);
    });
    const showHeight = common_vendor.computed(() => {
      if (calendarStyle.value.height == "200px") {
        return "-300rpx";
      } else {
        return "0rpx";
      }
    });
    const gridHeight = common_vendor.computed(() => {
      if (calendarState.value === 1) {
        return "80px";
      }
      return "auto";
    });
    const calendarStyle = common_vendor.computed(() => {
      let style = {
        transition: isTouching.value ? "none" : "transform 0.3s ease, height 0.3s ease",
        transform: `translateY(${calendarTranslateY.value}px)`
      };
      if (calendarState.value === 1) {
        style.height = "200px";
      } else if (calendarState.value === 2) {
        style.height = `${400 + (displayWeekCount.value - 4) * 20}px`;
      } else {
        style.height = "400px";
      }
      return style;
    });
    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };
    const generateCalendar = (year, month) => {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const firstDayWeek = firstDay.getDay();
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      const calendar = [];
      for (let i = firstDayWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const date = new Date(year, month - 1, day);
        calendar.push(createDateObject(date, false));
      }
      const today = /* @__PURE__ */ new Date();
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        const isToday = date.toDateString() === today.toDateString();
        calendar.push(createDateObject(date, true, isToday));
      }
      const nextMonthDays = 42 - calendar.length;
      for (let i = 1; i <= nextMonthDays; i++) {
        const date = new Date(year, month + 1, i);
        calendar.push(createDateObject(date, false));
      }
      let weekIndex = 0;
      calendar.forEach((date, index) => {
        date.weekIndex = weekIndex;
        if ((index + 1) % 7 === 0) {
          weekIndex++;
        }
        if (date.isToday) {
          currentWeekIndex.value = date.weekIndex;
        }
      });
      calendarDates.value = calendar;
      updateCurrentWeekDates();
    };
    const createDateObject = (date, isCurrentMonth, isToday = false) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const weekDay = date.getDay();
      const isSelected = selectedDate.value && selectedDate.value.year === year && selectedDate.value.month === month && selectedDate.value.day === day;
      const hasNote = notedDates.value.includes(`${year}-${month + 1}-${day}`);
      const holidayKey = `${month + 1}-${day}`;
      const holiday = holidays.value[holidayKey];
      const lunar = showLunar.value ? generateSimpleLunar(date) : null;
      return {
        year,
        month,
        day,
        weekDay,
        isToday,
        isSelected,
        hasNote,
        holiday,
        lunar,
        isCurrentMonth,
        weekIndex: 0
      };
    };
    const generateSimpleLunar = (date) => {
      const lunarMonths = [
        "正月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "冬月",
        "腊月"
      ];
      const lunarDays = [
        "初一",
        "初二",
        "初三",
        "初四",
        "初五",
        "初六",
        "初七",
        "初八",
        "初九",
        "初十",
        "十一",
        "十二",
        "十三",
        "十四",
        "十五",
        "十六",
        "十七",
        "十八",
        "十九",
        "二十",
        "廿一",
        "廿二",
        "廿三",
        "廿四",
        "廿五",
        "廿六",
        "廿七",
        "廿八",
        "廿九",
        "三十"
      ];
      const monthIndex = date.getMonth() % 12;
      const dayIndex = (date.getDate() - 1) % 30;
      return {
        month: lunarMonths[monthIndex],
        monthStr: "月",
        day: lunarDays[dayIndex],
        dayStr: "",
        year: "甲子",
        animal: "鼠",
        isFirstDayOfMonth: dayIndex === 0
      };
    };
    const updateCurrentWeekDates = () => {
      currentWeekDates.value = calendarDates.value.filter((date) => date.weekIndex === currentWeekIndex.value);
    };
    const selectDay = common_vendor.ref((/* @__PURE__ */ new Date()).getDate());
    const selectMonth = common_vendor.ref((/* @__PURE__ */ new Date()).getMonth() + 1);
    const selectYear = common_vendor.ref((/* @__PURE__ */ new Date()).getFullYear());
    let selectLocalDate = selectYear.value + "-" + selectMonth.value.toString().padStart(2, "0") + "-" + selectDay.value.toString().padStart(2, "0");
    const selectDate = (date) => {
      calendarDates.value.forEach((d) => {
        d.isSelected = false;
      });
      currentWeekDates.value.forEach((d) => {
        d.isSelected = false;
      });
      date.isSelected = true;
      selectedDate.value = date;
      if (date.month !== displayMonth.value || date.year !== displayYear.value) {
        displayYear.value = date.year;
        displayMonth.value = date.month;
        generateCalendar(displayYear.value, displayMonth.value);
      }
      showHintMessage(`选中日期：${date.year}年${date.month + 1}月${date.day}日`);
      selectDay.value = date.day;
      selectMonth.value = date.month + 1;
      selectYear.value = date.year;
      selectLocalDate = selectYear.value + "-" + selectMonth.value.toString().padStart(2, "0") + "-" + selectDay.value.toString().padStart(2, "0");
    };
    const toggleMonthView = () => {
      isMonthView.value = !isMonthView.value;
      showHintMessage(isMonthView.value ? "切换到月视图" : "切换到年视图");
    };
    const switchToMonth = (month) => {
      displayMonth.value = month;
      isMonthView.value = true;
      generateCalendar(displayYear.value, displayMonth.value);
      showHintMessage(`切换到${displayYear.value}年${month + 1}月`);
    };
    const previousYear = () => {
      displayYear.value -= 1;
      generateCalendar(displayYear.value, displayMonth.value);
      showHintMessage(`${displayYear.value}年`);
    };
    const nextYear = () => {
      displayYear.value += 1;
      generateCalendar(displayYear.value, displayMonth.value);
      showHintMessage(`${displayYear.value}年`);
    };
    const previousMonth = () => {
      if (displayMonth.value === 0) {
        displayMonth.value = 11;
        displayYear.value -= 1;
      } else {
        displayMonth.value -= 1;
      }
      generateCalendar(displayYear.value, displayMonth.value);
      showHintMessage(`${displayYear.value}年${displayMonth.value + 1}月`);
    };
    const nextMonth = () => {
      if (displayMonth.value === 11) {
        displayMonth.value = 0;
        displayYear.value += 1;
      } else {
        displayMonth.value += 1;
      }
      generateCalendar(displayYear.value, displayMonth.value);
      showHintMessage(`${displayYear.value}年${displayMonth.value + 1}月`);
    };
    const goToToday = () => {
      displayYear.value = currentYear.value;
      displayMonth.value = currentMonth.value;
      generateCalendar(displayYear.value, displayMonth.value);
      showHintMessage("回到今天");
    };
    const handleTouchStart = (e) => {
      if (!isMonthView.value)
        return;
      isTouching.value = true;
      touchStartY.value = e.touches[0].clientY;
      touchMoveY.value = e.touches[0].clientY;
      common_vendor.index.__f__("log", "at pages/panel/panel.vue:781", "滑动");
    };
    const handleTouchMove = (e) => {
      if (!isMonthView.value || !isTouching.value)
        return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - touchMoveY.value;
      touchMoveY.value = touchY;
      if (calendarState.value === 0) {
        calendarTranslateY.value = lastTranslateY.value + deltaY;
      } else if (calendarState.value === 1) {
        if (deltaY > 0) {
          calendarTranslateY.value = lastTranslateY.value + deltaY;
        }
      } else if (calendarState.value === 2) {
        if (deltaY < 0) {
          calendarTranslateY.value = lastTranslateY.value + deltaY;
        }
      }
      if (calendarState.value === 0) {
        if (calendarTranslateY.value < -150)
          calendarTranslateY.value = -150;
        if (calendarTranslateY.value > 100)
          calendarTranslateY.value = 100;
      } else if (calendarState.value === 1) {
        if (calendarTranslateY.value > 0)
          calendarTranslateY.value = 0;
      } else if (calendarState.value === 2) {
        if (calendarTranslateY.value < 0)
          calendarTranslateY.value = 0;
      }
    };
    const handleTouchEnd = () => {
      if (!isMonthView.value)
        return;
      isTouching.value = false;
      const deltaY = touchMoveY.value - touchStartY.value;
      if (calendarState.value === 0) {
        if (deltaY < -30) {
          switchToState(1);
          showHintMessage("日历已收起，只显示当前周，向下滑动可展开");
        } else if (deltaY > 30) {
          switchToState(2);
          showHintMessage("日历已拉大，向上滑动可恢复");
          showSchedule.value = true;
        } else {
          switchToState(0);
        }
      } else if (calendarState.value === 1) {
        if (deltaY > 30) {
          switchToState(0);
          showHintMessage("日历已展开");
        } else {
          switchToState(1);
        }
      } else if (calendarState.value === 2) {
        if (deltaY < -30) {
          switchToState(0);
          showHintMessage("日历已恢复");
          showSchedule.value = false;
        } else {
          switchToState(2);
        }
      }
    };
    const switchToState = (state) => {
      calendarState.value = state;
      if (state === 0) {
        calendarTranslateY.value = 0;
        weekGap.value = 8;
      } else if (state === 1) {
        calendarTranslateY.value = -150;
        weekGap.value = 8;
      } else if (state === 2) {
        calendarTranslateY.value = 0;
        weekGap.value = 40;
      }
      lastTranslateY.value = calendarTranslateY.value;
    };
    const showHintMessage = (message) => {
      hintText.value = message;
      showHint.value = true;
      setTimeout(() => {
        showHint.value = false;
      }, 2e3);
    };
    common_vendor.watch([displayYear, displayMonth], () => {
      generateCalendar(displayYear.value, displayMonth.value);
    });
    common_vendor.watch(showLunar, () => {
      generateCalendar(displayYear.value, displayMonth.value);
    });
    common_vendor.onMounted(() => {
      generateCalendar(displayYear.value, displayMonth.value);
      showHintMessage("欢迎使用通用日历！可切换年月，支持多种视图模式");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(previousYear),
        b: common_vendor.t(displayYear.value),
        c: common_vendor.o(nextYear),
        d: common_vendor.o(previousMonth),
        e: common_vendor.t(displayMonth.value + 1),
        f: common_vendor.o(nextMonth),
        g: common_vendor.o(goToToday),
        h: common_vendor.t(isMonthView.value ? "年视图" : "月视图"),
        i: common_vendor.o(toggleMonthView),
        j: !isMonthView.value
      }, !isMonthView.value ? {
        k: common_vendor.f(12, (month, k0, i0) => {
          return {
            a: common_vendor.t(month),
            b: common_vendor.t(getDaysInMonth(displayYear.value, month - 1)),
            c: month,
            d: month === currentMonth.value + 1 ? 1 : "",
            e: common_vendor.o(($event) => switchToMonth(month - 1), month)
          };
        })
      } : {}, {
        l: isMonthView.value
      }, isMonthView.value ? common_vendor.e({
        m: common_vendor.f(weekDays, (day, k0, i0) => {
          return {
            a: common_vendor.t(day),
            b: day
          };
        }),
        n: calendarState.value !== 1
      }, calendarState.value !== 1 ? {
        o: common_vendor.f(calendarDates.value, (date, index, i0) => {
          return common_vendor.e({
            a: common_vendor.f(ScheduleList.value, (d, index2, i1) => {
              return common_vendor.e({
                a: d.createTime[0] == displayYear.value && d.createTime[1] == date.month + 1 && d.createTime[2] == date.day && !showSchedule.value
              }, d.createTime[0] == displayYear.value && d.createTime[1] == date.month + 1 && d.createTime[2] == date.day && !showSchedule.value ? {} : {}, {
                b: index2
              });
            }),
            b: common_vendor.t(date.day),
            c: date.isToday
          }, date.isToday ? {} : {}, {
            d: date.isToday
          }, date.isToday ? {} : {}, {
            e: date.hasNote
          }, date.hasNote ? {} : {}, {
            f: showLunar.value && date.lunar
          }, showLunar.value && date.lunar ? {
            g: common_vendor.t(date.lunar.isFirstDayOfMonth ? date.lunar.month + "月" : date.lunar.day)
          } : {}, {
            h: date.holiday
          }, date.holiday ? {
            i: common_vendor.t(date.holiday)
          } : {}, {
            j: common_vendor.f(limitedData.value, (d, index2, i1) => {
              return common_vendor.e({
                a: d.createTime[0] == displayYear.value && d.createTime[1] == date.month + 1 && d.createTime[2] == date.day && showSchedule.value
              }, d.createTime[0] == displayYear.value && d.createTime[1] == date.month + 1 && d.createTime[2] == date.day && showSchedule.value ? {
                b: common_vendor.t(d.content.length > 2 ? d.content.substring(0, 2) : d.content)
              } : {}, {
                c: index2
              });
            }),
            k: index,
            l: date.month === displayMonth.value ? 1 : "",
            m: date.isToday ? 1 : "",
            n: date.isSelected ? 1 : "",
            o: date.hasNote ? 1 : "",
            p: date.month !== displayMonth.value ? 1 : "",
            q: date.weekDay === 0 || date.weekDay === 6 ? 1 : "",
            r: common_vendor.o(($event) => selectDate(date), index)
          });
        })
      } : {
        p: common_vendor.f(currentWeekDates.value, (date, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(date.day),
            b: date.isToday
          }, date.isToday ? {} : {}, {
            c: date.hasNote
          }, date.hasNote ? {} : {}, {
            d: index,
            e: date.month === displayMonth.value ? 1 : "",
            f: date.isToday ? 1 : "",
            g: date.isSelected ? 1 : "",
            h: date.hasNote ? 1 : "",
            i: date.month !== displayMonth.value ? 1 : "",
            j: date.weekDay === 0 || date.weekDay === 6 ? 1 : "",
            k: common_vendor.o(($event) => selectDate(date), index)
          });
        })
      }, {
        q: `repeat(${displayWeekCount.value}, 1fr)`,
        r: weekGap.value + "px",
        s: gridHeight.value,
        t: calendarState.value === 1
      }, calendarState.value === 1 ? {} : {}, {
        v: common_vendor.s(calendarStyle.value),
        w: common_vendor.o(handleTouchStart),
        x: common_vendor.o(handleTouchMove),
        y: common_vendor.o(handleTouchEnd)
      }) : {}, {
        z: common_vendor.f(ScheduleList.value, (d, index, i0) => {
          return common_vendor.e({
            a: d.createTime[0] == selectYear.value && d.createTime[1] == selectMonth.value && d.createTime[2] == selectDay.value
          }, d.createTime[0] == selectYear.value && d.createTime[1] == selectMonth.value && d.createTime[2] == selectDay.value ? {
            b: d.id,
            c: d.status == 1 ? true : false,
            d: common_vendor.o((e) => handleCheckboxChange(d.id, e.detail.value.includes(d.id)), index),
            e: common_vendor.t(d.content),
            f: d.status == 1 ? "line-through" : "none",
            g: common_vendor.o(($event) => onUpdate(d.id), index),
            h: common_vendor.o(($event) => onDelete(d.id), index),
            i: d.status == 1 ? "gray" : "red",
            j: showHeight.value,
            k: d.status == 1 ? "gray" : "black"
          } : {}, {
            l: index
          });
        }),
        A: common_vendor.t(hintText.value),
        B: showHint.value ? 1 : "",
        C: common_vendor.o(getSchedule),
        D: common_vendor.p({
          selectLocalDate: common_vendor.unref(selectLocalDate)
        }),
        E: common_vendor.o(($event) => showForm.value = $event),
        F: common_vendor.o(getSchedule),
        G: common_vendor.p({
          showForm: showForm.value,
          updateData: updateData.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8a0abc85"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/panel/panel.js.map
