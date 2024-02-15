"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toRecord(array, getKey) {
    return array.reduce(function (record, entry) {
        var key = getKey(entry);
        if (key === undefined) {
            return record;
        }
        record[key] = entry;
        return record;
    }, {});
}
exports.default = toRecord;
