"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_variables_1 = __importDefault(require("../config/env_variables"));
exports.default = {
    generateToken: (payload) => {
        return jsonwebtoken_1.default.sign(payload, env_variables_1.default.ACCESS_TOKEN_SECRET);
    },
};
