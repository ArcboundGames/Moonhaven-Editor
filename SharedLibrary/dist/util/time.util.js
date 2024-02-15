"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTimeOfDay = exports.getTimeOfDay = exports.getTimeOfDay12Hour = void 0;
var constants_1 = require("../constants");
function getTimeOfDay12Hour(time) {
    // eslint-disable-next-line prefer-const
    var _a = getTimeOfDay(time), hours = _a.hours, minutes = _a.minutes;
    var ampm = 'am';
    if (hours >= constants_1.HOURS_IN_HALF_DAY) {
        hours %= constants_1.HOURS_IN_HALF_DAY;
        ampm = 'pm';
    }
    return { hours: hours, minutes: minutes, ampm: ampm };
}
exports.getTimeOfDay12Hour = getTimeOfDay12Hour;
function getTimeOfDay(time) {
    var hours = Math.floor(time / constants_1.LENGTH_OF_HOUR);
    var minutes = Math.floor((time - hours * constants_1.LENGTH_OF_HOUR) / constants_1.LENGTH_OF_MINUTE);
    if (hours >= constants_1.HOURS_IN_DAY) {
        hours %= constants_1.HOURS_IN_DAY;
    }
    return { hours: hours, minutes: minutes };
}
exports.getTimeOfDay = getTimeOfDay;
function formatTimeOfDay(time) {
    var _a = getTimeOfDay12Hour(time), hours = _a.hours, minutes = _a.minutes, ampm = _a.ampm;
    var hoursStr = hours >= 10 ? "".concat(hours) : "0".concat(hours);
    if (hours == 0) {
        hoursStr = '12';
    }
    var minutesStr = minutes >= 10 ? "".concat(minutes) : "0".concat(minutes);
    return "".concat(hoursStr, ":").concat(minutesStr, " ").concat(ampm);
}
exports.formatTimeOfDay = formatTimeOfDay;
