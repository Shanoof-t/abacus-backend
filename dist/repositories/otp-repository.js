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
const otp_model_1 = __importDefault(require("../models/postgres/otp-model"));
const model = otp_model_1.default;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.create(data);
});
const findOne = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.findOne(userId);
});
const deleteOne = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.deleteOne(userId);
});
exports.default = { create, findOne, deleteOne };
