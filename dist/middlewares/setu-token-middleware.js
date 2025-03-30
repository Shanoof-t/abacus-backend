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
const setu_1 = require("../utils/setu");
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
function authenticateSetuToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = yield (0, setu_1.fetchSetuToken)();
            if (!token) {
                const error = new Custom_error_1.default("Setu token is missing,Access Denied", 400);
                next(error);
            }
            req.setuToken = token;
            next();
        }
        catch (error) {
            console.log("Error in authenticateSetuToken", error);
            next(error);
        }
    });
}
exports.default = authenticateSetuToken;
