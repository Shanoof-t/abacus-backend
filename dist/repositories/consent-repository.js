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
const consent_model_1 = __importDefault(require("../models/postgres/consent-model"));
const model = consent_model_1.default;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return model.create(data);
});
const findOneAndDelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findOneAndDelete(id);
});
const findOneAndUpdateAfterConnected = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findOneAndUpdateAfterConnected(data);
});
const findOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findOneById(id);
});
const findOneByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findOneByUserId(userId);
});
const deleteManyByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return model.deleteManyByUserId(userId);
});
exports.default = {
    create,
    findOneAndDelete,
    findOneAndUpdateAfterConnected,
    findOneById,
    deleteManyByUserId,
    findOneByUserId
};
