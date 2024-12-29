"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorHandler = void 0;
const asyncErrorHandler = function (func) {
    return function (req, res, next) {
        func(req, res, next).catch((err) => next(err));
    };
};
exports.asyncErrorHandler = asyncErrorHandler;
