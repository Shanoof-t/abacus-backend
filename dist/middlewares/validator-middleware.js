"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (schema) => function (req, res, next) {
    const { error } = schema.safeParse(req.body);
    if (error) {
        next(error);
    }
    else {
        next();
    }
};
