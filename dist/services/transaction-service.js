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
exports.createTransactions = exports.editTransactionById = exports.fetchTransactionById = exports.deleteTransactionById = exports.deleteTransactions = exports.fetchAllTransactions = exports.createTransaction = void 0;
const transaction_model_1 = require("../models/transaction-model");
const mongodb_1 = require("mongodb");
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const category_model_1 = require("../models/category-model");
const category_helper_1 = __importDefault(require("../helpers/category-helper"));
const transaction_helper_1 = __importDefault(require("../helpers/transaction-helper"));
const createTransaction = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_name, category_name, transaction_amount, transaction_date, transaction_payee, transaction_note, is_recurring, recurring_frequency, transaction_type, } = body;
    const transaction = yield transaction_model_1.Transaction.create({
        user_id: user === null || user === void 0 ? void 0 : user.sub,
        transaction_date,
        account_name,
        transaction_amount: parseFloat(transaction_amount),
        category_name,
        transaction_payee,
        transaction_type,
        transaction_note,
    });
    if (is_recurring) {
        yield transaction_helper_1.default.handleRecurring({
            category_name,
            is_recurring,
            transaction,
            transaction_amount,
            transaction_type,
            user,
            recurring_frequency,
            transaction_date,
        });
    }
    // update category amount based on transaction
    yield category_model_1.Category.updateOne({ category_name }, { $inc: { category_amount: Math.abs(parseFloat(transaction_amount)) } });
    // update budget
    if (transaction.transaction_type === "expense") {
        const alert = yield transaction_helper_1.default.handleBudgetUpdateAndCreateAlerts({
            category_name,
            transaction_amount,
            user,
        });
        if (alert) {
            return { alert, transaction };
        }
    }
    return { transaction };
});
exports.createTransaction = createTransaction;
const fetchAllTransactions = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find({ user_id: user === null || user === void 0 ? void 0 : user.sub });
    return transactions;
});
exports.fetchAllTransactions = fetchAllTransactions;
const deleteTransactions = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = body.map((id) => new mongodb_1.ObjectId(id));
    yield transaction_model_1.Transaction.deleteMany({ _id: { $in: ids } });
});
exports.deleteTransactions = deleteTransactions;
const deleteTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedResult = yield transaction_model_1.Transaction.deleteOne({ _id: id });
    if (deletedResult.deletedCount === 0)
        throw new Custom_error_1.default("Can't delete transaction,", 400);
});
exports.deleteTransactionById = deleteTransactionById;
const fetchTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_model_1.Transaction.findOne({ _id: id });
    if (!transaction)
        throw new Custom_error_1.default("Can't find transaction.", 400);
    return transaction;
});
exports.fetchTransactionById = fetchTransactionById;
const editTransactionById = (body, user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction_type = parseFloat(body.transaction_amount) > 0 ? "income" : "expense";
    yield transaction_model_1.Transaction.updateOne({ _id: id }, {
        $set: {
            account_name: body.account_name,
            category_name: body.category_name,
            transaction_amount: parseFloat(body.transaction_amount),
            transaction_date: body.transaction_date,
            transaction_payee: body.transaction_payee,
            transaction_note: body.transaction_note,
            transaction_type,
        },
    });
});
exports.editTransactionById = editTransactionById;
const createTransactions = (_a) => __awaiter(void 0, [_a], void 0, function* ({ body, user, }) {
    const user_id = user === null || user === void 0 ? void 0 : user.sub;
    const adjustedTransactions = body.map((transaction) => {
        const transaction_type = parseFloat(transaction.transaction_amount) > 0 ? "income" : "expense";
        return Object.assign(Object.assign({}, transaction), { user_id,
            transaction_type, transaction_amount: parseFloat(transaction.transaction_amount) });
    });
    // check category
    yield category_helper_1.default.createCategories({ transactions: body, user });
    yield transaction_model_1.Transaction.insertMany(adjustedTransactions);
});
exports.createTransactions = createTransactions;
