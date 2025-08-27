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
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const category_helper_1 = __importDefault(require("../helpers/category-helper"));
const transaction_helper_1 = __importDefault(require("../helpers/transaction-helper"));
const account_helper_1 = __importDefault(require("../helpers/account-helper"));
const transaction_repository_1 = __importDefault(require("../repositories/transaction-repository"));
const account_repository_1 = __importDefault(require("../repositories/account-repository"));
const category_repository_1 = __importDefault(require("../repositories/category-repository"));
const createTransaction = (body, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user) {
        throw new Custom_error_1.default("user is not exist,", 400);
    }
    const { account_name, category_name, transaction_amount, transaction_date, transaction_payee, transaction_note, is_recurring, recurring_frequency, transaction_type, } = body;
    const currentAccount = yield account_repository_1.default.findOneByName({
        account_name,
        user_id: user === null || user === void 0 ? void 0 : user.sub,
    });
    if (!currentAccount)
        throw new Custom_error_1.default(`Can't find Account with this name ${account_name}`, 404);
    const currentCategory = yield category_repository_1.default.findOneByName({
        user_id: user.sub,
        category_name,
    });
    if (!currentCategory)
        throw new Custom_error_1.default(`Can't find Category with this name ${category_name}`, 404);
    let transaction;
    if (is_recurring) {
        const next_date = transaction_helper_1.default.calculateNextRecurringDate({
            recurring_frequency,
            transaction_date,
        });
        transaction = yield transaction_repository_1.default.create({
            user_id: user.sub,
            transaction_date,
            account_name,
            transaction_amount,
            category_name,
            transaction_payee,
            transaction_type,
            transaction_note,
            is_bank_transaction: false,
            is_estimated: true,
            is_recurring,
            next_date,
            recurring_frequency,
        });
        yield transaction_helper_1.default.handleRecurring({
            transaction,
            user,
        });
    }
    else {
        transaction = yield transaction_repository_1.default.create({
            user_id: user.sub,
            transaction_date,
            account_name,
            transaction_amount,
            category_name,
            transaction_payee,
            transaction_type,
            transaction_note,
            is_bank_transaction: false,
            is_estimated: true,
            is_recurring,
        });
    }
    yield account_helper_1.default.updateAccountBalance({
        account_name,
        transaction_amount: Number(transaction_amount),
        transaction_type,
        user,
        account: currentAccount,
    });
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
    if (!user)
        throw new Custom_error_1.default("user is not exist,", 400);
    const transactions = yield transaction_repository_1.default.findById(user.sub);
    return transactions;
});
exports.fetchAllTransactions = fetchAllTransactions;
const deleteTransactions = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_repository_1.default.deleteMany(body);
    return transactions;
});
exports.deleteTransactions = deleteTransactions;
const deleteTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_repository_1.default.deleteOneById(id);
    if (!transaction)
        throw new Custom_error_1.default("Can't delete transaction.", 400);
    return transaction;
});
exports.deleteTransactionById = deleteTransactionById;
const fetchTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_repository_1.default.findOneById(id);
    if (!transaction)
        throw new Custom_error_1.default("Can't find transaction.", 400);
    return transaction;
});
exports.fetchTransactionById = fetchTransactionById;
const editTransactionById = (body, id, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        throw new Custom_error_1.default("user is not exist,", 400);
    const currentTransaction = yield transaction_repository_1.default.findOneById(id);
    if (!currentTransaction)
        throw new Custom_error_1.default("Can't find transaction.", 400);
    const currentAccount = yield account_repository_1.default.findOneByName({
        account_name: body.account_name,
        user_id: user === null || user === void 0 ? void 0 : user.sub,
    });
    if (!currentAccount)
        throw new Custom_error_1.default(`Can't find Account with this name ${body.account_name}`, 404);
    const currentCategory = yield category_repository_1.default.findOneByName({
        user_id: user.sub,
        category_name: body.category_name,
    });
    if (!currentCategory)
        throw new Custom_error_1.default(`Can't find Category with this name ${body.category_name}`, 404);
    const transaction_type = body.transaction_amount > 0 ? "income" : "expense";
    const updatedTransaction = {
        account_name: body.account_name,
        category_name: body.category_name,
        transaction_amount: body.transaction_amount,
        transaction_date: body.transaction_date,
        transaction_payee: body.transaction_payee,
        transaction_type,
        user_id: user.sub,
        transaction_note: body.transaction_note,
        recurring_frequency: body.recurring_frequency,
        is_recurring: body.is_recurring,
    };
    const transaction = yield transaction_repository_1.default.updateOneById(id, updatedTransaction);
    return transaction;
});
exports.editTransactionById = editTransactionById;
const createTransactions = (_a) => __awaiter(void 0, [_a], void 0, function* ({ body, user, }) {
    if (!user)
        throw new Custom_error_1.default("user is not exist,", 400);
    const user_id = user.sub;
    const adjustedTransactions = body.map((transaction) => {
        const transaction_type = transaction.transaction_amount > 0 ? "income" : "expense";
        return Object.assign(Object.assign({}, transaction), { user_id,
            transaction_type, transaction_amount: transaction.transaction_amount });
    });
    // also create the account
    yield account_helper_1.default.createAccounts({
        transactions: body,
        user,
    });
    // check category
    yield category_helper_1.default.createCategories({ transactions: body, user });
    const transactions = yield transaction_repository_1.default.insertMany(adjustedTransactions);
    return transactions;
});
exports.createTransactions = createTransactions;
