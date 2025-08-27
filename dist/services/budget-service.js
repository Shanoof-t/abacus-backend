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
exports.fetchBudgetByCategoryName = exports.updateBudgetByName = exports.deleteBudgetByName = exports.fetchBudgetById = exports.fetchAllBudgets = exports.createBudget = void 0;
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const budget_helper_1 = __importDefault(require("../helpers/budget-helper"));
const transaction_repository_1 = __importDefault(require("../repositories/transaction-repository"));
const budget_repository_1 = __importDefault(require("../repositories/budget-repository"));
const category_repository_1 = __importDefault(require("../repositories/category-repository"));
const utils_1 = require("../utils/utils");
const createBudget = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        throw new Custom_error_1.default("User is existing.", 404);
    const exisingBudget = yield budget_repository_1.default.findOneByName({
        category_name: body.category_name,
        user_id: user.sub,
    });
    if (exisingBudget)
        throw new Custom_error_1.default("This category with a budget is already existing", 400);
    const currentCategory = yield category_repository_1.default.findOneByName({
        user_id: user.sub,
        category_name: body.category_name,
    });
    if (!currentCategory)
        throw new Custom_error_1.default(`Can't find Category with this name ${body.category_name}`, 404);
    const budgetLimit = body.amount_limit;
    const transactions = yield transaction_repository_1.default.findByCategoryAndType({
        user_id: user.sub,
        category_name: body.category_name,
        transaction_type: "expense",
    });
    const totalSpentAmount = transactions.reduce((acc, value) => acc + value.transaction_amount, 0);
    const budgetData = {
        user_id: user === null || user === void 0 ? void 0 : user.sub,
        budget_name: body.budget_name,
        budget_start_date: body.budget_start_date,
        budget_end_date: body.budget_end_date,
        category_name: body.category_name,
        amount_limit: Number(body.amount_limit),
        budget_note: body.budget_note,
        notification_status: body.notification_status,
        alert_threshold: body.alert_threshold,
        total_spent: totalSpentAmount,
        progress: (0, utils_1.calculateBudgetProgress)({ budgetLimit, totalSpentAmount }),
    };
    const budget = yield budget_repository_1.default.create(budgetData);
    return budget;
});
exports.createBudget = createBudget;
const fetchAllBudgets = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        throw new Custom_error_1.default("user is not exist,", 400);
    const budgets = yield budget_repository_1.default.findByUserId(user.sub);
    return budgets;
});
exports.fetchAllBudgets = fetchAllBudgets;
const fetchBudgetById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, id }) {
    const budget = yield budget_repository_1.default.findOneById(id);
    if (!budget)
        throw new Custom_error_1.default("Can't find budget with this id", 400);
    return budget;
});
exports.fetchBudgetById = fetchBudgetById;
const deleteBudgetByName = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, id, }) {
    const budget = yield budget_repository_1.default.deleteOneById(id);
    if (!budget)
        throw new Custom_error_1.default("The budget you're trying to delete doesn't exist.", 400);
    return budget;
});
exports.deleteBudgetByName = deleteBudgetByName;
const updateBudgetByName = (_a) => __awaiter(void 0, [_a], void 0, function* ({ body, user, id, }) {
    if (!user)
        throw new Custom_error_1.default("User is existing.", 404);
    const currentBudget = yield budget_repository_1.default.findOneById(id);
    if (!currentBudget)
        throw new Custom_error_1.default("The budget you're trying to update doesn't exist.", 400);
    const currentCategory = yield category_repository_1.default.findOneByName({
        user_id: user.sub,
        category_name: body.category_name,
    });
    if (!currentCategory)
        throw new Custom_error_1.default(`Can't find Category with this name ${body.category_name}`, 404);
    if ((currentBudget === null || currentBudget === void 0 ? void 0 : currentBudget.category_name) !== body.category_name) {
        const exisingBudget = yield budget_helper_1.default.findOneBudgetWithCategory({
            user_id: user === null || user === void 0 ? void 0 : user.sub,
            category_name: body.category_name,
        });
        if (exisingBudget)
            throw new Custom_error_1.default("This category with a budget is already existing", 400);
    }
    const budgetLimit = body.amount_limit;
    const transactions = yield transaction_repository_1.default.findByCategoryAndType({
        user_id: user.sub,
        category_name: body.category_name,
        transaction_type: "expense",
    });
    const totalSpentAmount = transactions.reduce((acc, value) => acc + value.transaction_amount, 0);
    const total_spent = Math.abs(totalSpentAmount);
    const updatedData = {
        user_id: user.sub,
        id,
        budget_name: body.budget_name,
        category_name: body.category_name,
        amount_limit: Number(body.amount_limit),
        budget_start_date: body.budget_start_date,
        budget_end_date: body.budget_end_date,
        budget_note: body.budget_note,
        total_spent,
        progress: (0, utils_1.calculateBudgetProgress)({ budgetLimit, totalSpentAmount }),
    };
    return yield budget_repository_1.default.update(updatedData);
});
exports.updateBudgetByName = updateBudgetByName;
const fetchBudgetByCategoryName = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, category, }) {
    if (!user)
        throw new Custom_error_1.default("User is existing.", 404);
    const budget = yield budget_repository_1.default.findOneByName({
        category_name: category,
        user_id: user.sub,
    });
    // if (!budget)
    //   throw new CustomError(
    //     `You dont have budget with this category ${category},Please create one.`,
    //     400
    //   );
    return budget;
});
exports.fetchBudgetByCategoryName = fetchBudgetByCategoryName;
