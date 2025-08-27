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
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const account_repository_1 = __importDefault(require("../repositories/account-repository"));
const createAccount = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_name, account_balance } = data;
    if (!user)
        throw new Custom_error_1.default("user is not exist,", 400);
    const existingAccount = yield account_repository_1.default.findOneByName({
        account_name,
        user_id: user === null || user === void 0 ? void 0 : user.sub,
    });
    if (existingAccount)
        throw new Custom_error_1.default("This name with account is already created.", 400);
    const accData = {
        account_balance,
        account_name,
        user_id: user === null || user === void 0 ? void 0 : user.sub,
    };
    return yield account_repository_1.default.create(accData);
});
exports.createAccount = createAccount;
const fetchAllAccountsByUserId = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        throw new Custom_error_1.default("User not exist.", 404);
    return yield account_repository_1.default.findByUserId(user === null || user === void 0 ? void 0 : user.sub);
});
exports.fetchAllAccountsByUserId = fetchAllAccountsByUserId;
const deleteAccounts = (accountIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield account_repository_1.default.deleteMany(accountIds);
});
exports.deleteAccounts = deleteAccounts;
const deleteAccountById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingAccount = yield account_repository_1.default.findOneById(id);
    if (!existingAccount)
        throw new Custom_error_1.default("The account you are trying to delete does not exist.", 404);
    return yield account_repository_1.default.deleteOneById(id);
});
exports.deleteAccountById = deleteAccountById;
const editAccountById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ body, id, user }) {
    const { account_name, account_balance } = body;
    if (!user)
        throw new Custom_error_1.default("user is not exist,", 400);
    const existingAccountWithId = yield account_repository_1.default.findOneById(id);
    if (!existingAccountWithId)
        throw new Custom_error_1.default("The account you are trying to edit does not exist.", 404);
    if (existingAccountWithId.account_name !== account_name) {
        const existingAccount = yield account_repository_1.default.findOneByName({
            account_name,
            user_id: user === null || user === void 0 ? void 0 : user.sub,
        });
        if (existingAccount)
            throw new Custom_error_1.default(`An account with the name "${account_name}" already exists.`, 409);
    }
    const data = {
        id,
        account_balance,
        account_name,
        user_id: user === null || user === void 0 ? void 0 : user.sub,
    };
    return yield account_repository_1.default.updateOneById(data);
});
exports.editAccountById = editAccountById;
const fetchAccountById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield account_repository_1.default.findOneById(id);
    if (!account)
        throw new Custom_error_1.default("The account you are trying to get does not exist.", 404);
    return account;
});
exports.fetchAccountById = fetchAccountById;
