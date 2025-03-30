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
exports.editCategoryById = exports.fetchCategoryById = exports.deleteCategoryById = exports.deleteCategories = exports.fetchAllCategoriesByUserId = exports.createCategory = void 0;
const category_model_1 = require("../models/category-model");
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const mongodb_1 = require("mongodb");
const createCategory = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCategory = yield category_model_1.Category.findOne({
        user_id: user === null || user === void 0 ? void 0 : user.sub,
        category_name: body.category_name,
    });
    if (existingCategory)
        throw new Custom_error_1.default("This name with category is already created.", 400);
    yield category_model_1.Category.create({
        user_id: user === null || user === void 0 ? void 0 : user.sub,
        category_name: body.category_name.replace(/\W/g, ""),
    });
});
exports.createCategory = createCategory;
const fetchAllCategoriesByUserId = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield category_model_1.Category.find({ user_id: user === null || user === void 0 ? void 0 : user.sub });
});
exports.fetchAllCategoriesByUserId = fetchAllCategoriesByUserId;
const deleteCategories = (categoryIds) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = categoryIds.map((id) => new mongodb_1.ObjectId(id));
    yield category_model_1.Category.deleteMany({ _id: { $in: ids } });
});
exports.deleteCategories = deleteCategories;
const deleteCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield category_model_1.Category.deleteOne({ _id: id });
});
exports.deleteCategoryById = deleteCategoryById;
const fetchCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findOne({ _id: id });
    if (!category)
        throw new Custom_error_1.default(`Can't find category with this id ${id}`, 400);
    return category;
});
exports.fetchCategoryById = fetchCategoryById;
const editCategoryById = (body, id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCategory = yield category_model_1.Category.findOne({
        category_name: body.category_name,
    });
    if (existingCategory)
        throw new Custom_error_1.default(`Already an category existin with this name ${body.category_name}`, 400);
    yield category_model_1.Category.updateOne({ _id: id }, { $set: { category_name: body.category_name } });
});
exports.editCategoryById = editCategoryById;
