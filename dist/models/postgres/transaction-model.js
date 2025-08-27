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
const db_1 = require("../../loaders/db");
const create = (transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_name, category_name, transaction_amount, transaction_date, transaction_payee, transaction_type, user_id, transaction_note, is_recurring, next_date, recurring_frequency, is_bank_transaction, } = transaction;
    const queryText = "INSERT INTO transactions(user_id,transaction_date,account_name,transaction_amount,category_name,transaction_payee,transaction_type,transaction_note,is_recurring,recurring_frequency,next_date,is_bank_transaction) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *";
    const params = [
        user_id,
        transaction_date,
        account_name,
        transaction_amount,
        category_name,
        transaction_payee,
        transaction_type,
        transaction_note,
        is_recurring,
        recurring_frequency,
        next_date,
        is_bank_transaction,
    ];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM transactions WHERE user_id=$1";
    const params = [userId];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
});
const findOneById = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM transactions WHERE id=$1";
    const params = [transactionId];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const deleteMany = (userIds) => __awaiter(void 0, void 0, void 0, function* () {
    const placeHolders = userIds.map((_, index) => `$${index + 1}`).join(",");
    const queryText = `DELETE FROM transactions WHERE id IN (${placeHolders}) RETURNING *`;
    const res = yield (0, db_1.query)(queryText, userIds);
    return res.rows;
});
const deleteManyByBank = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = `DELETE FROM transactions WHERE user_id=$1 AND is_bank_transaction=true  RETURNING *`;
    const res = yield (0, db_1.query)(queryText, [userId]);
    return res.rows;
});
const deleteOneById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "DELETE FROM transactions WHERE id=$1 RETURNING *";
    const params = [userId];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const updateOneById = (transaction, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_name, category_name, transaction_amount, transaction_date, transaction_payee, transaction_note, transaction_type, } = transaction;
    const queryText = "UPDATE transactions SET account_name=$2,category_name=$3,transaction_amount=$4,transaction_date=$5,transaction_payee=$6,transaction_note=$7,transaction_type=$8 WHERE id=$1 RETURNING *";
    const params = [
        id,
        account_name,
        category_name,
        transaction_amount,
        transaction_date,
        transaction_payee,
        transaction_note,
        transaction_type,
    ];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const insertMany = (transactions) => __awaiter(void 0, void 0, void 0, function* () {
    const placeHolders = transactions
        .map((_, index) => {
        let start = index * 8 + 1;
        return `($${start},$${start + 1},$${start + 2},$${start + 3},$${start + 4},$${start + 5},$${start + 6},$${start + 7})`;
    })
        .join(",");
    const queryText = `INSERT INTO transactions(user_id,transaction_date,account_name,transaction_amount,category_name,transaction_payee,transaction_type,transaction_note) VALUES ${placeHolders} RETURNING *`;
    const params = transactions.flatMap((transaction) => [
        transaction.user_id,
        transaction.transaction_date,
        transaction.account_name,
        transaction.transaction_amount,
        transaction.category_name,
        transaction.transaction_payee,
        transaction.transaction_type,
        transaction.transaction_note,
    ]);
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
});
const findByType = (details) => __awaiter(void 0, void 0, void 0, function* () {
    const { transaction_type, user_id } = details;
    const queryText = "SELECT * FROM transactions WHERE user_id=$1 AND transaction_type=$2";
    const params = [user_id, transaction_type];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
});
const findBankTransactionsWithAccount = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_name, isBankTransaction, user_id } = data;
    const queryText = "SELECT * FROM transactions WHERE user_id=$1 AND account_name=$2 AND is_bank_transaction=$3";
    const params = [user_id, account_name, isBankTransaction];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
});
const findByCategoryAndType = (details) => __awaiter(void 0, void 0, void 0, function* () {
    const { category_name, transaction_type, user_id } = details;
    const queryText = "SELECT * FROM transactions WHERE user_id=$1 AND category_name=$2 AND transaction_type=$3";
    const params = [user_id, category_name, transaction_type];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
});
const findIncome = (matchData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, fromDate, toDate, transaction_type, account_name } = matchData;
    let queryText = `
    SELECT COALESCE(SUM(transaction_amount), 0) AS income
    FROM transactions
    WHERE user_id = $1
      AND transaction_type = $2
      AND transaction_date BETWEEN $3 AND $4
  `;
    const params = [user_id, transaction_type, fromDate, toDate];
    if (account_name) {
        queryText += ` AND account_name = $5`;
        params.push(account_name);
    }
    queryText += ` GROUP BY transaction_type`;
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findExpense = (matchData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, fromDate, toDate, transaction_type, account_name } = matchData;
    let queryText = `
    SELECT COALESCE(SUM(transaction_amount), 0) AS expense
    FROM transactions
    WHERE user_id = $1
      AND transaction_type = $2
      AND transaction_date BETWEEN $3 AND $4
  `;
    const params = [user_id, transaction_type, fromDate, toDate];
    if (account_name) {
        queryText += ` AND account_name = $5`;
        params.push(account_name);
    }
    queryText += ` GROUP BY transaction_type`;
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findPreviousPeriodIncome = (matchData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, transaction_type, previouseMonth, currentMonth, account_name, } = matchData;
    let queryText = `
    SELECT COALESCE(SUM(transaction_amount), 0) AS income
    FROM transactions
    WHERE user_id = $1
      AND transaction_type = $2
      AND transaction_date BETWEEN $3 AND $4
  `;
    const params = [
        user_id,
        transaction_type,
        previouseMonth,
        currentMonth,
    ];
    if (account_name) {
        queryText += ` AND account_name = $5`;
        params.push(account_name);
    }
    queryText += ` GROUP BY transaction_type`;
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findPreviousPeriodExpense = (matchData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, transaction_type, previouseMonth, currentMonth, account_name, } = matchData;
    let queryText = `
    SELECT COALESCE(SUM(transaction_amount), 0) AS expense
    FROM transactions
    WHERE user_id = $1
      AND transaction_type = $2
      AND transaction_date BETWEEN $3 AND $4
  `;
    const params = [
        user_id,
        transaction_type,
        previouseMonth,
        currentMonth,
    ];
    if (account_name) {
        queryText += ` AND account_name = $5`;
        params.push(account_name);
    }
    queryText += ` GROUP BY transaction_type`;
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findTransactionSummary = (matchData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, fromDate, toDate, account_name } = matchData;
    let queryText = `
    SELECT 
      transaction_date,
      SUM(CASE WHEN transaction_type = 'income' THEN transaction_amount ELSE 0 END) AS income,
      SUM(CASE WHEN transaction_type = 'expense' THEN transaction_amount ELSE 0 END) AS expense
    FROM transactions
    WHERE user_id = $1
      AND transaction_date BETWEEN $2 AND $3
  `;
    const params = [user_id, fromDate, toDate];
    if (account_name) {
        queryText += ` AND account_name = $4`;
        params.push(account_name);
    }
    queryText += ` GROUP BY transaction_date ORDER BY transaction_date`;
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
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
