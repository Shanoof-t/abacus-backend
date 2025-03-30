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
exports.createBulkTransactions = exports.editTransaction = exports.getTransaction = exports.deleteTransaction = exports.deleteBulkTransactions = exports.getAllTransactions = exports.addTransaction = void 0;
const transaction_service_1 = require("../services/transaction-service");
const error_handlers_1 = require("../utils/error-handlers");
exports.addTransaction = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req;
    const { alert, transaction } = yield (0, transaction_service_1.createTransaction)(body, user);
    res.status(200).json({
        status: "success",
        message: "Transaction is successful.",
        data: transaction,
        alert,
    });
}));
exports.getAllTransactions = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const transactions = yield (0, transaction_service_1.fetchAllTransactions)(user);
    res
        .status(200)
        .json({ status: "success", message: "Success", data: transactions });
}));
exports.deleteBulkTransactions = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    yield (0, transaction_service_1.deleteTransactions)(body);
    res
        .status(200)
        .json({ status: "success", message: "Transactions deletion successfull." });
}));
exports.deleteTransaction = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, transaction_service_1.deleteTransactionById)(id);
    res
        .status(200)
        .json({ status: "success", message: "Transaction deleted successfully." });
}));
exports.getTransaction = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const transaction = yield (0, transaction_service_1.fetchTransactionById)(id);
    res.status(200).json({
        status: "success",
        message: "Successfully fetched transaction",
        data: transaction,
    });
}));
exports.editTransaction = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req;
    const { id } = req.params;
    yield (0, transaction_service_1.editTransactionById)(body, user, id);
    res
        .status(200)
        .json({ status: "success", message: "Transaction updated." });
}));
exports.createBulkTransactions = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = req;
    yield (0, transaction_service_1.createTransactions)({ body, user });
    res.status(200).json({
        status: "success",
        message: "transactions created successfully",
    });
}));
