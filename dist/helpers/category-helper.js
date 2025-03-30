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
const category_model_1 = require("../models/category-model");
exports.default = {
    createCategories: (_a) => __awaiter(void 0, [_a], void 0, function* ({ transactions, user }) {
        const user_id = user === null || user === void 0 ? void 0 : user.sub;
        for (const transaction of transactions) {
            const category = transaction.category_name.replace(/\W/g, "");
            const amount = Math.abs(parseFloat(transaction.transaction_amount));
            const existingCategory = yield category_model_1.Category.findOne({
                category_name: category,
            });
            if (existingCategory) {
                yield category_model_1.Category.updateOne({ category_name: category }, {
                    $inc: {
                        category_amount: amount,
                    },
                });
            }
            if (!existingCategory) {
                yield category_model_1.Category.create({
                    user_id,
                    category_name: category,
                    category_amount: amount,
                });
            }
        }
    }),
};
