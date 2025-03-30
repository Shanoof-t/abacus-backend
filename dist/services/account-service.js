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
exports.fetchAccountById = exports.editAccountById = exports.deleteAccountById = exports.deleteAccounts = exports.fetchAllAccountsByUserId = exports.createAccount = void 0;
const account_model_1 = require("../models/account-model");
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const mongodb_1 = require("mongodb");
const createAccount = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_name, account_balance } = data;
    const existingAccount = yield account_model_1.Account.findOne({ account_name: account_name });
    if (existingAccount)
        throw new Custom_error_1.default("This name with account is already created.", 400);
    return yield account_model_1.Account.create({
        user_id: user === null || user === void 0 ? void 0 : user.sub,
        account_name: account_name.replace(/\W/g, ""),
        account_balance,
    });
});
exports.createAccount = createAccount;
const fetchAllAccountsByUserId = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield account_model_1.Account.find({ user_id: user === null || user === void 0 ? void 0 : user.sub });
});
exports.fetchAllAccountsByUserId = fetchAllAccountsByUserId;
const deleteAccounts = (accountIds) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = accountIds.map((accountId) => new mongodb_1.ObjectId(accountId));
    yield account_model_1.Account.deleteMany({ _id: { $in: ids } });
});
exports.deleteAccounts = deleteAccounts;
const deleteAccountById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield account_model_1.Account.deleteOne({ _id: id });
});
exports.deleteAccountById = deleteAccountById;
const editAccountById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ body, id, user }) {
    const existingAccount = yield account_model_1.Account.findOne({
        account_name: body.account_name,
    });
    if (existingAccount)
        throw new Custom_error_1.default(`Already an account existin with this name ${body.account_name}`, 400);
    yield account_model_1.Account.updateOne({ user_id: user === null || user === void 0 ? void 0 : user.sub, _id: id }, {
        $set: {
            account_name: body.account_name,
            account_balance: body.account_balance,
        },
    });
});
exports.editAccountById = editAccountById;
const fetchAccountById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield account_model_1.Account.findOne({ _id: id });
});
exports.fetchAccountById = fetchAccountById;
