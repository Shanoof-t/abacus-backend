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
const category_model_1 = __importDefault(require("../models/postgres/category-model"));
const model = category_model_1.default;
const findOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findOneById(id);
});
const findOneByName = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findOneByName(data);
});
const findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findByUserId(userId);
});
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return model.create(data);
});
const deleteMany = (categoryIds) => __awaiter(void 0, void 0, void 0, function* () {
    return model.deleteMany(categoryIds);
});
const deleteOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return model.deleteOneById(id);
});
const updateOneById = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return model.updateOneById(data);
});
const deleteManyByBank = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return model.deleteManyByBank(userId);
});
exports.default = {
    findOneById,
    findOneByName,
    create,
    findByUserId,
    deleteMany,
    deleteOneById,
    updateOneById,
    deleteManyByBank
};
