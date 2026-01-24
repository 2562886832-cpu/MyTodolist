"use strict";
const common_vendor = require("../../common/vendor.js");
const api_data = require("../../api/data.js");
if (!Array) {
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  _easycom_qiun_data_charts2();
}
const _easycom_qiun_data_charts = () => "../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
if (!Math) {
  _easycom_qiun_data_charts();
}
const _sfc_main = {
  __name: "data",
  setup(__props) {
    const columnTimeRange = common_vendor.ref("week");
    const lineTimeRange = common_vendor.ref("week");
    const columnScrollLeft = common_vendor.ref(0);
    const lineScrollLeft = common_vendor.ref(0);
    const columnData = common_vendor.ref({
      categories: [],
      series: []
    });
    const lineData = common_vendor.ref({
      categories: [],
      series: []
    });
    const columnTotal = common_vendor.ref(0);
    const columnAvg = common_vendor.ref(0);
    const columnMax = common_vendor.ref(0);
    const lineTotal = common_vendor.ref(0);
    const lineAvg = common_vendor.ref(0);
    const lineMax = common_vendor.ref(0);
    const columnChartWidth = common_vendor.computed(() => {
      return "1440rpx";
    });
    const lineChartWidth = common_vendor.computed(() => {
      return "1440rpx";
    });
    const columnOpts = common_vendor.ref({
      color: ["#1890FF"],
      padding: [20, 20, 10, 20],
      enableScroll: false,
      legend: {
        show: false
      },
      xAxis: {
        disableGrid: false,
        axisLine: false,
        axisLineColor: "#E8E8E8",
        fontColor: "#666",
        fontSize: 8
        // itemCount: 12,  // 确保显示全部12个数据点
        //    labelCount: 12
      },
      yAxis: {
        data: [{ min: 0 }],
        gridType: "solid",
        dashLength: 4,
        axisLine: true,
        splitLine: {
          lineType: "dash",
          dashLength: 4,
          lineColor: "#E8E8E8"
        },
        format: (val) => {
          return val % 10 === 0 ? val : "";
        }
      },
      extra: {
        column: {
          type: "group",
          width: 25,
          categoryGap: 20,
          barBorderRadius: 4,
          linearType: "custom"
        }
      },
      animation: true
    });
    const columnWeekOpts = common_vendor.ref({
      color: ["#1890FF"],
      padding: [20, 20, 10, 20],
      enableScroll: false,
      legend: {
        show: false
      },
      xAxis: {
        disableGrid: false,
        axisLine: false,
        axisLineColor: "#E8E8E8",
        fontColor: "#666",
        fontSize: 8
        // labelCount: 7, // 显示所有7个标签
        // itemCount: 7   // 确保显示全部7个标签
      },
      yAxis: {
        data: [{ min: 0 }],
        gridType: "solid",
        dashLength: 4,
        splitNumber: 1,
        axisLine: {
          show: false
        },
        splitLine: {
          lineType: "solid",
          dashLength: 4,
          lineColor: "#E8E8E8"
        },
        format: (val) => {
          return val % 10 === 0 ? val : "";
        }
      },
      extra: {
        column: {
          type: "group",
          width: 30,
          // 稍微窄一点，确保7个柱子都能完整显示
          categoryGap: 12,
          barBorderRadius: 4,
          linearType: "custom"
        }
      },
      animation: true
    });
    const lineOpts = common_vendor.ref({
      color: ["#52C41A"],
      padding: [20, 20, 10, 20],
      enableScroll: false,
      legend: {
        show: false
      },
      xAxis: {
        disableGrid: false,
        axisLine: false,
        axisLineColor: "#E8E8E8",
        fontColor: "#666",
        fontSize: 8
        // labelCount: 12
      },
      yAxis: {
        data: [{ min: 0 }],
        gridType: "solid",
        dashLength: 4,
        axisLine: false,
        splitLine: {
          lineType: "solid",
          dashLength: 4,
          lineColor: "#E8E8E8"
        },
        format: (val) => {
          return val % 200 === 0 ? val : "";
        }
      },
      extra: {
        line: {
          type: "curve",
          width: 3,
          activeType: "point",
          pointShape: "circle",
          pointSize: 6
        }
      },
      animation: true
    });
    const lineWeekOpts = common_vendor.ref({
      color: ["#52C41A"],
      padding: [20, 20, 10, 20],
      enableScroll: false,
      legend: {
        show: false
      },
      xAxis: {
        disableGrid: false,
        axisLine: false,
        axisLineColor: "#E8E8E8",
        fontColor: "#666",
        fontSize: 8
        // labelCount: 7, // 显示所有7个标签
        // itemCount: 7   // 确保显示全部7个标签
      },
      yAxis: {
        data: [{ min: 0 }],
        gridType: "solid",
        axisLine: true,
        axisLineColor: "#E8E8E8",
        axisLineType: "solid",
        axisLineWidth: 1,
        splitLine: {
          show: false
          // 关闭y轴的横向网格线
        },
        format: (val) => {
          return val % 100 === 0 ? val : "";
        }
      },
      extra: {
        line: {
          type: "curve",
          width: 3,
          activeType: "point",
          pointShape: "circle",
          pointSize: 6
        }
      },
      animation: true
    });
    const generateRecent7Days = () => {
      const dates = [];
      const today = /* @__PURE__ */ new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        dates.push(`${month}-${day}`);
      }
      return dates;
    };
    const CloumnChartsWeek = async () => {
      let res = await api_data.apiCloumnChartsWeek({ status: 1, userId: 1 });
      return res.data;
    };
    const generateColumnWeekData = async () => {
      try {
        const res = await CloumnChartsWeek();
        common_vendor.index.__f__("log", "at pages/data/data.vue:424", "API返回数据:", res);
        const apiData = res;
        const recentDates = generateRecent7Days();
        const salesData = [];
        let total = 0;
        let max = 0;
        for (let i = 0; i < apiData.length; i++) {
          const item = apiData[i];
          const value = item.count;
          salesData.push(value);
          total += value;
          if (value > max) {
            max = value;
          }
          common_vendor.index.__f__("log", "at pages/data/data.vue:451", `日期 ${recentDates[i]}: count = ${item.count}, dateTime = ${item.dateTime}`);
        }
        columnData.value = {
          categories: recentDates,
          series: [{
            name: "完成量",
            data: salesData,
            color: "#1890FF"
          }]
        };
        common_vendor.index.__f__("log", "at pages/data/data.vue:464", "柱状图数据:", columnData.value);
        columnTotal.value = total;
        columnAvg.value = total / apiData.length;
        columnMax.value = max;
        columnWeekOpts.value.yAxis.data[0].max = max;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/data/data.vue:473", "获取柱状图数据失败:", error);
      }
    };
    const CloumnChartsYear = async () => {
      let res = await api_data.apiCloumnChartsYear({ status: 1, userId: 1 });
      return res.data;
    };
    const generateColumnMonthData = async () => {
      try {
        const res = await CloumnChartsYear();
        const apiData = res;
        common_vendor.index.__f__("log", "at pages/data/data.vue:491", res);
        const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        const salesData = [];
        let total = 0;
        let max = 0;
        for (let i = 0; i < apiData.length && i < 12; i++) {
          const item = apiData[i];
          const value = item.count;
          salesData.push(value);
          total += value;
          if (value > max) {
            max = value;
          }
          common_vendor.index.__f__("log", "at pages/data/data.vue:516", `月份 ${months[i]}: count = ${item.count}, dateTime = ${item.dateTime}`);
        }
        if (salesData.length < 12) {
          for (let i = salesData.length; i < 12; i++) {
            salesData.push(0);
          }
        }
        columnData.value = {
          categories: months,
          series: [{
            name: "完成量",
            data: salesData,
            color: "#1890FF"
          }]
        };
        common_vendor.index.__f__("log", "at pages/data/data.vue:536", "月柱状图数据:", columnData.value);
        columnTotal.value = total;
        columnAvg.value = total / 12;
        columnMax.value = max;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/data/data.vue:544", "获取月数据失败:", error);
      }
    };
    const LineChartsWeek = async () => {
      let res = await api_data.apiLineChartsWeek({ userId: 1 });
      return res.data;
    };
    const generateLineWeekData = async () => {
      try {
        const res = await LineChartsWeek();
        const apiData = res;
        const recentDates = generateRecent7Days();
        const userData = [];
        let total = 0;
        let max = 0;
        for (let i = 0; i < apiData.length; i++) {
          const item = apiData[i];
          const value = item.count;
          userData.push(value);
          total += value;
          if (value > max) {
            max = value;
          }
        }
        lineData.value = {
          categories: recentDates,
          series: [{
            name: "时长",
            data: userData,
            color: "#52C41A"
          }]
        };
        lineTotal.value = total;
        lineAvg.value = total / apiData.length;
        lineMax.value = max;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/data/data.vue:607", "获取折线图数据失败:", error);
      }
    };
    const LineChartsYear = async () => {
      let res = await api_data.apiLineChartsYear({ userId: 1 });
      return res.data;
    };
    const generateLineMonthData = async () => {
      try {
        const res = await LineChartsYear();
        const apiData = res;
        const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        const userData = [];
        let total = 0;
        let max = 0;
        for (let i = 0; i < apiData.length && i < 12; i++) {
          const item = apiData[i];
          const value = item.count;
          userData.push(value);
          total += value;
          if (value > max) {
            max = value;
          }
        }
        if (userData.length < 12) {
          for (let i = userData.length; i < 12; i++) {
            userData.push(0);
          }
        }
        lineData.value = {
          categories: months,
          series: [{
            name: "时长",
            data: userData,
            color: "#52C41A"
          }]
        };
        lineTotal.value = total;
        lineAvg.value = total / 12;
        lineMax.value = max;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/data/data.vue:674", "获取月度折线图数据失败:", error);
      }
    };
    const onColumnScroll = (e) => {
      columnScrollLeft.value = e.detail.scrollLeft;
    };
    const onLineScroll = (e) => {
      lineScrollLeft.value = e.detail.scrollLeft;
    };
    const changeColumnTimeRange = async (range) => {
      columnTimeRange.value = range;
      if (range === "week") {
        generateColumnWeekData();
        columnData.value.categories = [];
        columnData.value.series = [];
        columnScrollLeft.value = 0;
      } else {
        generateColumnMonthData();
        columnData.value.categories = [];
        columnData.value.series = [];
        await common_vendor.nextTick$1();
      }
    };
    const changeLineTimeRange = async (range) => {
      lineTimeRange.value = range;
      if (range === "week") {
        generateLineWeekData();
        lineData.value.categories = [];
        lineData.value.series = [];
        lineScrollLeft.value = 0;
      } else {
        generateLineMonthData();
        lineData.value.categories = [];
        lineData.value.series = [];
        await common_vendor.nextTick$1();
      }
    };
    common_vendor.onMounted(() => {
      generateColumnWeekData();
      generateLineWeekData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: columnTimeRange.value === "week" ? 1 : "",
        b: common_vendor.o(($event) => changeColumnTimeRange("week")),
        c: columnTimeRange.value === "month" ? 1 : "",
        d: common_vendor.o(($event) => changeColumnTimeRange("month")),
        e: common_vendor.t(columnTimeRange.value === "week" ? "7日" : "12月"),
        f: common_vendor.t(columnTotal.value.toFixed(columnTimeRange.value === "week" ? 1 : 2)),
        g: common_vendor.t(columnAvg.value.toFixed(columnTimeRange.value === "week" ? 1 : 2)),
        h: common_vendor.t(columnMax.value.toFixed(columnTimeRange.value === "week" ? 1 : 2)),
        i: columnTimeRange.value === "month"
      }, columnTimeRange.value === "month" ? {
        j: common_vendor.p({
          type: "column",
          chartData: columnData.value,
          opts: columnOpts.value,
          canvasId: "columnChart",
          canvas2d: true
        }),
        k: columnChartWidth.value,
        l: columnScrollLeft.value,
        m: common_vendor.o(onColumnScroll)
      } : {
        n: common_vendor.p({
          type: "column",
          chartData: columnData.value,
          opts: columnWeekOpts.value,
          canvasId: "columnWeekChart",
          canvas2d: true
        })
      }, {
        o: lineTimeRange.value === "week" ? 1 : "",
        p: common_vendor.o(($event) => changeLineTimeRange("week")),
        q: lineTimeRange.value === "month" ? 1 : "",
        r: common_vendor.o(($event) => changeLineTimeRange("month")),
        s: common_vendor.t(lineTimeRange.value === "week" ? "7日" : "一年"),
        t: common_vendor.t(lineTotal.value),
        v: common_vendor.t(lineAvg.value.toFixed(0)),
        w: common_vendor.t(lineMax.value),
        x: lineTimeRange.value === "month"
      }, lineTimeRange.value === "month" ? {
        y: common_vendor.p({
          type: "line",
          chartData: lineData.value,
          opts: lineOpts.value,
          canvasId: "lineChart",
          canvas2d: true
        }),
        z: lineChartWidth.value,
        A: lineScrollLeft.value,
        B: common_vendor.o(onLineScroll)
      } : {
        C: common_vendor.p({
          type: "line",
          chartData: lineData.value,
          opts: lineWeekOpts.value,
          canvasId: "lineWeekChart",
          canvas2d: true
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-98b81aa6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/data/data.js.map
