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
const category_repository_1 = __importDefault(require("../repositories/category-repository"));
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const createCategory = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        throw new Custom_error_1.default("user is not exist,", 400);
    const existingCategory = yield category_repository_1.default.findOneByName({
        user_id: user.sub,
        category_name: body.category_name,
    });
    if (existingCategory)
        throw new Custom_error_1.default("This name with category is already created.", 400);
    return yield category_repository_1.default.create({
        category_name: body.category_name.replace(/\W/g, ""),
        user_id: user.sub,
    });
});
exports.createCategory = createCategory;
const fetchAllCategoriesByUserId = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        throw new Custom_error_1.default("user is not exist,", 400);
    return yield category_repository_1.default.findByUserId(user === null || user === void 0 ? void 0 : user.sub);
});
exports.fetchAllCategoriesByUserId = fetchAllCategoriesByUserId;
const deleteCategories = (categoryIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield category_repository_1.default.deleteMany(categoryIds);
});
exports.deleteCategories = deleteCategories;
const deleteCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_repository_1.default.findOneById(id);
    if (!category)
        throw new Custom_error_1.default(`Can't find category with this id ${id}`, 400);
    return yield category_repository_1.default.deleteOneById(id);
});
exports.deleteCategoryById = deleteCategoryById;
const fetchCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_repository_1.default.findOneById(id);
    if (!category)
        throw new Custom_error_1.default(`Can't find category with this id ${id}`, 400);
    return category;
});
exports.fetchCategoryById = fetchCategoryById;
const editCategoryById = (body, id, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        throw new Custom_error_1.default("user is not exist,", 400);
    const currentCategory = yield category_repository_1.default.findOneById(id);
    if (!currentCategory)
        throw new Custom_error_1.default("The Category is not existing.", 400);
    const existingCategory = yield category_repository_1.default.findOneByName({
        category_name: body.category_name,
        user_id: user.sub,
    });
    if (existingCategory)
        throw new Custom_error_1.default(`Already an category existin with this name ${body.category_name}`, 400);
    return yield category_repository_1.default.updateOneById({
        category_name: body.category_name,
        id,
    });
});
exports.editCategoryById = editCategoryById;
