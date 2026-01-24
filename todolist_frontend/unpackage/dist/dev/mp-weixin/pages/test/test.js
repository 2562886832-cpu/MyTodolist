"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  _easycom_qiun_data_charts2();
}
const _easycom_qiun_data_charts = () => "../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
if (!Math) {
  _easycom_qiun_data_charts();
}
const _sfc_main = {
  __name: "test",
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
        fontSize: 12,
        labelCount: 12
      },
      yAxis: {
        data: [{ min: 0 }],
        gridType: "dash",
        dashLength: 4,
        axisLine: false,
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
        fontSize: 12,
        labelCount: 7,
        // 显示所有7个标签
        itemCount: 7
        // 确保显示全部7个标签
      },
      yAxis: {
        data: [{ min: 0 }],
        gridType: "dash",
        dashLength: 4,
        axisLine: false,
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
        fontSize: 12,
        labelCount: 12
      },
      yAxis: {
        data: [{ min: 0 }],
        gridType: "dash",
        dashLength: 4,
        axisLine: false,
        splitLine: {
          lineType: "dash",
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
        fontSize: 12,
        labelCount: 7,
        // 显示所有7个标签
        itemCount: 7
        // 确保显示全部7个标签
      },
      yAxis: {
        data: [{ min: 0 }],
        gridType: "dash",
        dashLength: 4,
        axisLine: false,
        splitLine: {
          lineType: "dash",
          dashLength: 4,
          lineColor: "#E8E8E8"
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
    const generateColumnWeekData = () => {
      const recentDates = generateRecent7Days();
      const salesData = [];
      let total = 0;
      let max = 0;
      for (let i = 0; i < 7; i++) {
        let baseValue = 30;
        if (i === 3 || i === 4)
          baseValue = 50;
        else if (i === 6)
          baseValue = 45;
        const sales = baseValue + Math.random() * 25;
        const value = parseFloat(sales.toFixed(1));
        salesData.push(value);
        total += value;
        if (value > max)
          max = value;
      }
      columnData.value = {
        categories: recentDates,
        series: [{
          name: "销售额",
          data: salesData,
          color: "#1890FF"
        }]
      };
      columnTotal.value = total;
      columnAvg.value = total / 7;
      columnMax.value = max;
    };
    const generateColumnMonthData = () => {
      const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
      const salesData = [];
      let total = 0;
      let max = 0;
      for (let i = 0; i < 12; i++) {
        let seasonalFactor = 1;
        if (i < 2)
          seasonalFactor = 0.8;
        else if (i < 6)
          seasonalFactor = 1;
        else if (i < 9)
          seasonalFactor = 1.2;
        else
          seasonalFactor = 1.4;
        const sales = (Math.random() * 50 + 40) * seasonalFactor;
        const value = parseFloat(sales.toFixed(2));
        salesData.push(value);
        total += value;
        if (value > max)
          max = value;
      }
      columnData.value = {
        categories: months,
        series: [{
          name: "销售额",
          data: salesData,
          color: "#1890FF"
        }]
      };
      columnTotal.value = total;
      columnAvg.value = total / 12;
      columnMax.value = max;
    };
    const generateLineWeekData = () => {
      const recentDates = generateRecent7Days();
      const userData = [];
      let total = 0;
      let max = 0;
      let baseUsers = 500;
      for (let i = 0; i < 7; i++) {
        const growth = Math.random() * 60 + 20;
        const users = Math.round(baseUsers + growth);
        userData.push(users);
        total += users;
        if (users > max)
          max = users;
        baseUsers = users;
      }
      lineData.value = {
        categories: recentDates,
        series: [{
          name: "用户数",
          data: userData,
          color: "#52C41A"
        }]
      };
      lineTotal.value = total;
      lineAvg.value = total / 7;
      lineMax.value = max;
    };
    const generateLineMonthData = () => {
      const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
      const userData = [];
      let total = 0;
      let max = 0;
      let baseUsers = 800;
      for (let i = 0; i < 12; i++) {
        const growth = Math.random() * 100 + 50;
        const users = Math.round(baseUsers + growth);
        userData.push(users);
        total += users;
        if (users > max)
          max = users;
        baseUsers = users;
      }
      lineData.value = {
        categories: months,
        series: [{
          name: "用户数",
          data: userData,
          color: "#52C41A"
        }]
      };
      lineTotal.value = total;
      lineAvg.value = total / 12;
      lineMax.value = max;
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
        columnScrollLeft.value = 0;
      } else {
        generateColumnMonthData();
        await common_vendor.nextTick$1();
        columnScrollLeft.value = 1e4;
      }
    };
    const changeLineTimeRange = async (range) => {
      lineTimeRange.value = range;
      if (range === "week") {
        generateLineWeekData();
        lineScrollLeft.value = 0;
      } else {
        generateLineMonthData();
        await common_vendor.nextTick$1();
        lineScrollLeft.value = 1e4;
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
        o: columnData.value.categories && columnData.value.categories.length > 0
      }, columnData.value.categories && columnData.value.categories.length > 0 ? {
        p: common_vendor.f(columnData.value.categories, (label, index, i0) => {
          return {
            a: common_vendor.t(label),
            b: index
          };
        }),
        q: `${100 / columnData.value.categories.length}%`
      } : {}, {
        r: lineTimeRange.value === "week" ? 1 : "",
        s: common_vendor.o(($event) => changeLineTimeRange("week")),
        t: lineTimeRange.value === "month" ? 1 : "",
        v: common_vendor.o(($event) => changeLineTimeRange("month")),
        w: common_vendor.t(lineTimeRange.value === "week" ? "7日" : "12月"),
        x: common_vendor.t(lineTotal.value),
        y: common_vendor.t(lineAvg.value.toFixed(0)),
        z: common_vendor.t(lineMax.value),
        A: lineTimeRange.value === "month"
      }, lineTimeRange.value === "month" ? {
        B: common_vendor.p({
          type: "line",
          chartData: lineData.value,
          opts: lineOpts.value,
          canvasId: "lineChart",
          canvas2d: true
        }),
        C: lineChartWidth.value,
        D: lineScrollLeft.value,
        E: common_vendor.o(onLineScroll)
      } : {
        F: common_vendor.p({
          type: "line",
          chartData: lineData.value,
          opts: lineWeekOpts.value,
          canvasId: "lineWeekChart",
          canvas2d: true
        })
      }, {
        G: lineData.value.categories && lineData.value.categories.length > 0
      }, lineData.value.categories && lineData.value.categories.length > 0 ? {
        H: common_vendor.f(lineData.value.categories, (label, index, i0) => {
          return {
            a: common_vendor.t(label),
            b: index
          };
        }),
        I: `${100 / lineData.value.categories.length}%`
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-727d09f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/test/test.js.map
