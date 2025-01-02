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
const user_model_1 = require("../models/user-model");
const security_helper_1 = __importDefault(require("./security-helper"));
exports.default = {
    getUser: (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, _id }) {
        if (email) {
            return yield user_model_1.User.findOne({ email });
        }
        else if (_id) {
            return yield user_model_1.User.findOne({ _id });
        }
    }),
    addUser: (user) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = user;
        const hashedPassword = yield security_helper_1.default.hashPassword({ password });
        return yield user_model_1.User.create({ email, password: hashedPassword });
    }),
};
