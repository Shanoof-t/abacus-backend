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
exports.getAccount = exports.editAccount = exports.deleteAccount = exports.accountBulkDelete = exports.getAllAccounts = exports.addAccount = void 0;
const account_service_1 = require("../services/account-service");
const error_handlers_1 = require("../utils/error-handlers");
exports.addAccount = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req;
    yield (0, account_service_1.createAccount)(body, user);
    res
        .status(201)
        .json({ status: "success", message: "Account created successfully" });
}));
exports.getAllAccounts = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const accounts = yield (0, account_service_1.fetchAllAccountsByUserId)(user);
    res
        .status(200)
        .json({ status: "success", message: "Success", data: accounts });
}));
exports.accountBulkDelete = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    yield (0, account_service_1.deleteAccounts)(body);
    res
        .status(200)
        .json({ status: "success", message: "Accounts delete successfull." });
}));
exports.deleteAccount = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, account_service_1.deleteAccountById)(id);
    res
        .status(200)
        .json({ status: "success", message: "Account deleted successfully." });
}));
exports.editAccount = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    const { user } = req;
    yield (0, account_service_1.editAccountById)({ body, id, user });
    res
        .status(200)
        .json({ status: "success", message: "Account successfully edited." });
}));
exports.getAccount = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = yield (0, account_service_1.fetchAccountById)(id);
    res
        .status(200)
        .json({ status: "success", message: "Account fetch successfull.", data });
}));
