"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_variables_1 = __importDefault(require("../config/env_variables"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const { ACCESS_TOKEN_SECRET } = env_variables_1.default;
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.token;
        if (!token) {
            const error = new Custom_error_1.default("Access Denied", 400);
            next(error);
        }
        try {
            const user = (yield jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET));
            if (!user) {
                const error = new Custom_error_1.default("Access Denied", 400);
                next(error);
            }
            req.user = user;
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.default = authenticateToken;
