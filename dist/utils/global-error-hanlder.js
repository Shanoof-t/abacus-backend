"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (error, req, res, next) => {
    res.status(400).json(error);
};
