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
const account_model_1 = __importDefault(require("../models/postgres/account-model"));
const model = account_model_1.default;
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.create(data);
});
const findOneByName = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.findOneByName(data);
});
const findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.findByUserId(userId);
});
const findOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.findOneById(id);
});
const findOneByUserAndSource = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.findOneByUserAndSource(data);
});
const deleteMany = (accountIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.deleteMany(accountIds);
});
const deleteManyBySource = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.deleteManyBySource(data);
});
const deleteOneById = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.deleteOneById(accountId);
});
const updateOneById = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.updateOneById(data);
});
const updateOneByUserId = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.updateOneByUserId(data);
});
exports.default = {
    create,
    findOneByName,
    findByUserId,
    deleteMany,
    deleteOneById,
    findOneById,
    updateOneById,
    findOneByUserAndSource,
    updateOneByUserId,
    deleteManyBySource,
};
