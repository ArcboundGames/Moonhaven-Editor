"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNullish = exports.isNotNullish = void 0;
function isNotNullish(value) {
    return value !== undefined && value !== null;
}
exports.isNotNullish = isNotNullish;
function isNullish(value) {
    return value === undefined || value === null;
}
exports.isNullish = isNullish;
