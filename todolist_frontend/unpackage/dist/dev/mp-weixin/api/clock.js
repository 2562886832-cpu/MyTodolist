"use strict";
const utils_request = require("../utils/request.js");
function apiAddFocusRecord(data = {}) {
  return utils_request.request({
    url: `/focus-record/`,
    method: "POST",
    data
  });
}
exports.apiAddFocusRecord = apiAddFocusRecord;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/clock.js.map
