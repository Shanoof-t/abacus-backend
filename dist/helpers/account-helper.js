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
const account_repository_1 = __importDefault(require("../repositories/account-repository"));
function updateAccountBalance(_a) {
    return __awaiter(this, arguments, void 0, function* ({ account_name, transaction_amount, user, transaction_type, accountSource = "manual", account, }) {
        const balance = transaction_type === "expense"
            ? Math.max(0, (account === null || account === void 0 ? void 0 : account.account_balance) - transaction_amount)
            : (account === null || account === void 0 ? void 0 : account.account_balance) + transaction_amount;
        const account_source = account.account_source === "bank_integration"
            ? "both"
            : accountSource;
        const data = {
            account_balance: balance,
            account_name,
            account_source,
            user_id: user.sub,
            id: account.id,
        };
        yield account_repository_1.default.updateOneById(data);
    });
}
function createAccounts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ transactions, user, accountSource = "manual", }) {
        if (!(user === null || user === void 0 ? void 0 : user.sub))
            return;
        for (const transaction of transactions) {
            const { account_name, transaction_amount, transaction_type } = transaction;
            const amount = Number(transaction_amount);
            const existingAccount = yield account_repository_1.default.findOneByName({
                account_name,
                user_id: user.sub,
            });
            if (existingAccount) {
                const updatedBalance = transaction_type === "expense"
                    ? Math.max(0, existingAccount.account_balance - amount)
                    : existingAccount.account_balance + amount;
                let source = existingAccount.account_source;
                if (existingAccount.account_source === "manual" &&
                    accountSource === "bank_integration") {
                    source = "both";
                }
                else if (existingAccount.account_source === "bank_integration" &&
                    accountSource === "manual") {
                    source = "both";
                }
                else if (accountSource === "bank_integration") {
                    source = "bank_integration";
                }
                yield updateAccountBalance({
                    account_name,
                    transaction_amount: updatedBalance,
                    transaction_type,
                    user,
                    accountSource: source,
                    account: existingAccount,
                });
            }
            else {
                const initialBalance = transaction_type === "expense" ? 0 : amount;
                yield account_repository_1.default.create({
                    account_balance: initialBalance,
                    account_name,
                    user_id: user.sub,
                    account_source: accountSource,
                });
            }
        }
    });
}
exports.default = {
    updateAccountBalance,
    createAccounts,
};
