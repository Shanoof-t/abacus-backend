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
Object.defineProperty(exports, "__esModule", { value: true });
exports.editCategory = exports.getCategory = exports.deleteCategory = exports.categoryBulkDelete = exports.getAllCategories = exports.addCategory = void 0;
const category_service_1 = require("../services/category-service");
const error_handlers_1 = require("../utils/error-handlers");
exports.addCategory = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req;
    yield (0, category_service_1.createCategory)(body, user);
    res
        .status(201)
        .json({ status: "success", message: "Category created successfully" });
}));
exports.getAllCategories = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const categories = yield (0, category_service_1.fetchAllCategoriesByUserId)(user);
    res.status(200).json({
        status: "success",
        message: "Successfully fetched all categories.",
        data: categories,
    });
}));
exports.categoryBulkDelete = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    yield (0, category_service_1.deleteCategories)(body);
    res
        .status(200)
        .json({ status: "success", message: "Categories delete successfull." });
}));
exports.deleteCategory = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, category_service_1.deleteCategoryById)(id);
    res
        .status(200)
        .json({ status: "success", message: "Category deleted successfully." });
}));
exports.getCategory = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield (0, category_service_1.fetchCategoryById)(id);
    res.status(200).json({
        status: "success",
        message: "Category fetch successfull.",
        data: category,
    });
}));
exports.editCategory = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    yield (0, category_service_1.editCategoryById)(body, id);
    res.status(200).json({
        status: "success",
        message: "Category edited successfully.",
    });
}));
