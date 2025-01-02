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
exports.createTransaction = void 0;
const transaction_model_1 = require("../models/transaction-model");
const createTransaction = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, account, amount, category, payee, transaction_type, frequency, is_recurring, notes, } = body;
    // if(is_recurring){
    //   const next_date = 
    // }
    const transaction = yield transaction_model_1.Transaction.create({
        user_id: "fla;jf;",
        date,
        account,
        amount,
        category,
        payee,
        transaction_type,
        notes,
        is_estimated: true,
        is_recurring,
        recurring: { frequency },
    });
    return transaction;
});
exports.createTransaction = createTransaction;
