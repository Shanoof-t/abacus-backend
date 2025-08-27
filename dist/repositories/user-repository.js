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
const user_model_1 = __importDefault(require("../models/postgres/user-model"));
const model = user_model_1.default;
const findOneWithId = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, isVerified = true) {
    return yield model.findOneWithId(id, isVerified);
});
const findOneWithEmail = (email_1, ...args_1) => __awaiter(void 0, [email_1, ...args_1], void 0, function* (email, isVerified = true) {
    return yield model.findOneWithEmail(email, isVerified);
});
const addUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.addUser(input);
});
const update = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.update(userId);
});
exports.default = { findOneWithEmail, findOneWithId, addUser, update };
