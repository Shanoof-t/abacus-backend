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
const transaction_model_1 = __importDefault(require("../models/postgres/transaction-model"));
const model = transaction_model_1.default;
const create = (transaction) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.create(transaction);
});
const findById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.findById(userId);
});
const findOneById = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.findOneById(transactionId);
});
const deleteOneById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.deleteOneById(userId);
});
const deleteMany = (userIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.deleteMany(userIds);
});
const deleteManyByBank = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.deleteManyByBank(userId);
});
const updateOneById = (transactionId, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.updateOneById(transaction, transactionId);
});
const insertMany = (transactions) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.insertMany(transactions);
});
const findByType = (details) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.findByType(details);
});
const findByCategoryAndType = (details) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model.findByCategoryAndType(details);
});
const findIncome = (matchData) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findIncome(matchData);
});
const findExpense = (matchData) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findExpense(matchData);
});
const findPreviousPeriodIncome = (matchData) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findPreviousPeriodIncome(matchData);
});
const findPreviousPeriodExpense = (matchData) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findPreviousPeriodExpense(matchData);
});
const findTransactionSummary = (matchData) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findTransactionSummary(matchData);
});
const findBankTransactionsWithAccount = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return model.findBankTransactionsWithAccount(data);
});
exports.default = {
    create,
    findById,
    deleteMany,
    deleteOneById,
    findOneById,
    updateOneById,
    insertMany,
    findByType,
    findByCategoryAndType,
    findIncome,
    findExpense,
    findPreviousPeriodIncome,
    findPreviousPeriodExpense,
    findTransactionSummary,
    findBankTransactionsWithAccount,
    deleteManyByBank,
};
