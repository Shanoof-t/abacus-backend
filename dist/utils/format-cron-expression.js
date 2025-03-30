"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
function formatCronExpression({ nextDate }) {
    const month = (0, date_fns_1.format)(nextDate, "M");
    const day = (0, date_fns_1.format)(nextDate, "d");
    const minute = (0, date_fns_1.format)(nextDate, "m");
    const hour = (0, date_fns_1.format)(nextDate, "H");
    const scheduledTime = `${hour}:${minute} on ${day}-${month}-${new Date(nextDate).getFullYear()}`;
    console.log(`Scheduled time: ${scheduledTime}`);
    console.log(`Actual expression: ${minute} ${hour} ${day} ${month} *`);
    const currMin = (0, date_fns_1.format)(new Date(), "m");
    const currHou = (0, date_fns_1.format)(new Date(), "H");
    const parsed = Number(currMin) + 2;
    const mock = `${parsed.toString()} ${currHou} 29 3 *`;
    console.log("Mock expression:", mock);
    return mock;
    // return `${minute} ${hour} ${day} ${month} *`;
}
exports.default = formatCronExpression;
