"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.disConnectBankAccountByConsentId = exports.getConsentByUserId = exports.updateUserConsent = exports.storeBankTransactions = exports.createConsentUrl = void 0;
const setu = __importStar(require("../utils/setu"));
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const category_helper_1 = __importDefault(require("../helpers/category-helper"));
const bank_events_1 = __importDefault(require("../sockets/events/bank.events"));
const account_helper_1 = __importDefault(require("../helpers/account-helper"));
const consent_repository_1 = __importDefault(require("../repositories/consent-repository"));
const transaction_repository_1 = __importDefault(require("../repositories/transaction-repository"));
const account_repository_1 = __importDefault(require("../repositories/account-repository"));
const category_repository_1 = __importDefault(require("../repositories/category-repository"));
const createConsentUrl = (mobileNumber, setuToken, user) => __awaiter(void 0, void 0, void 0, function* () {
    // fallback for off time
    // const currentTime = new Date().getHours();
    // if (currentTime > 2 && currentTime < 6)
    //   throw new CustomError(
    //     "Consent cannot be created between 2 AM and 6 AM. Please try again later.",
    //     403
    //   );
    if (!user)
        throw new Custom_error_1.default("User is not found!", 404);
    let body = setu.createConsentData(mobileNumber);
    const consent = yield setu.createConsentRequest({ token: setuToken, body });
    yield consent_repository_1.default.deleteManyByUserId(user.sub);
    yield consent_repository_1.default.create({
        consent_id: consent.id,
        user_email: user.email,
        user_id: user.sub,
        is_approved: false,
        connected_accounts: [],
    });
    return consent;
});
exports.createConsentUrl = createConsentUrl;
const storeBankTransactions = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { fiData, consentId } = body;
    const finalTransactions = [];
    const consent = yield consent_repository_1.default.findOneById(consentId);
    if (!consent)
        throw new Custom_error_1.default("Can'find the user in setu transaction service", 500);
    for (let account of fiData) {
        for (let accDetails of account.data) {
            // here i want to store the transations into db
            const accountNumber = accDetails.maskedAccNumber;
            const transactions = accDetails.decryptedFI.account.transactions.transaction;
            for (let transaction of transactions) {
                const parts = transaction.narration.split("/");
                const payee = parts[3];
                const category = parts[4];
                const tData = {
                    user_id: consent.user_id,
                    transaction_payee: payee,
                    category_name: category,
                    account_name: accountNumber,
                    transaction_amount: transaction.amount,
                    transaction_date: transaction.valueDate,
                    transaction_type: transaction.type === "CREDIT" ? "income" : "expense",
                    isBankTransaction: true,
                };
                finalTransactions.push(tData);
            }
        }
    }
    // also do the account
    yield account_helper_1.default.createAccounts({
        transactions: finalTransactions,
        user: {
            sub: consent.user_id,
            email: consent.user_email,
        },
        accountSource: "bank_integration",
    });
    yield category_helper_1.default.createCategories({
        transactions: finalTransactions,
        user: {
            sub: consent.user_id,
            email: consent.user_email,
        },
        isBankCategory: true,
    });
    yield transaction_repository_1.default.insertMany(finalTransactions);
});
exports.storeBankTransactions = storeBankTransactions;
const updateUserConsent = (body) => __awaiter(void 0, void 0, void 0, function* () {
    if (body.success) {
        const connectedAccounts = body.data.detail.accounts.map((acc) => acc.maskedAccNumber);
        const updatedConsent = yield consent_repository_1.default.findOneAndUpdateAfterConnected({
            consent_id: body.consentId,
            connectedAccounts,
            isApproved: body.success,
        });
        // connected
        const userId = updatedConsent === null || updatedConsent === void 0 ? void 0 : updatedConsent.user_id;
        bank_events_1.default.bankAccountConnectedEvent({
            userId,
            data: updatedConsent,
        });
    }
    else if (body.error) {
        // consent have error
        console.log("consent create got a problem:", body.error);
    }
    else {
        yield consent_repository_1.default.findOneAndDelete(body.consentId);
        // consent not approved if want to give notification use socket event here
        console.log("user consent not approved");
    }
});
exports.updateUserConsent = updateUserConsent;
const getConsentByUserId = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        throw new Custom_error_1.default("User id is missing", 404);
    return yield consent_repository_1.default.findOneByUserId(user.sub);
});
exports.getConsentByUserId = getConsentByUserId;
const disConnectBankAccountByConsentId = (consentId, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        throw new Custom_error_1.default("User is missing", 404);
    yield consent_repository_1.default.findOneAndDelete(consentId);
    const existingBothAccounts = yield account_repository_1.default.findOneByUserAndSource({
        userId: user.sub,
        account_source: "both",
    });
    if (existingBothAccounts.length) {
        existingBothAccounts.forEach((account) => __awaiter(void 0, void 0, void 0, function* () {
            const bankTransactions = yield transaction_repository_1.default.findBankTransactionsWithAccount({
                user_id: user.sub,
                account_name: account.account_name,
                isBankTransaction: true,
            });
            const updatedBalance = bankTransactions.reduce((amount, transaction) => {
                return transaction.transaction_type === "expense"
                    ? amount - transaction.transaction_amount
                    : amount + transaction.transaction_amount;
            }, 0);
            yield account_repository_1.default.updateOneByUserId({
                user_id: user.sub,
                account_name: account.account_name,
                account_balance: Math.max(0, updatedBalance),
            });
        }));
    }
    else {
        yield account_repository_1.default.deleteManyBySource({
            user_id: user.sub,
            account_source: "bank_integration",
        });
    }
    yield transaction_repository_1.default.deleteManyByBank(user.sub);
    yield category_repository_1.default.deleteManyByBank(user.sub);
});
exports.disConnectBankAccountByConsentId = disConnectBankAccountByConsentId;
