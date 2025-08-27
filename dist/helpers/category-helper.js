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
const category_repository_1 = __importDefault(require("../repositories/category-repository"));
exports.default = {
    createCategories: (_a) => __awaiter(void 0, [_a], void 0, function* ({ transactions, user, isBankCategory = false, }) {
        const user_id = user === null || user === void 0 ? void 0 : user.sub;
        for (const transaction of transactions) {
            const category = transaction.category_name.replace(/\W/g, "");
            const existingCategory = yield category_repository_1.default.findOneByName({
                category_name: category,
                user_id,
            });
            if (!existingCategory) {
                yield category_repository_1.default.create({
                    category_name: category,
                    is_bank_category: isBankCategory,
                    user_id,
                });
            }
        }
    }),
    updateCategories: (_a) => __awaiter(void 0, [_a], void 0, function* ({ transactions, user }) { }),
};
