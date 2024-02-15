"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPivot = void 0;
var constants_1 = require("../constants");
var math_util_1 = require("./math.util");
function getPivot(width, height, offset) {
    var _a, _b;
    return {
        x: (0, math_util_1.clamp)(constants_1.SPRITE_PIVOT_X * width + ((_a = offset.x) !== null && _a !== void 0 ? _a : 0), 0, width),
        y: (0, math_util_1.clamp)(constants_1.SPRITE_PIVOT_Y * height + constants_1.SPRITE_PIVOT_OFFSET_Y_IN_PIXELS + ((_b = offset.y) !== null && _b !== void 0 ? _b : 0), 0, height)
    };
}
exports.getPivot = getPivot;
