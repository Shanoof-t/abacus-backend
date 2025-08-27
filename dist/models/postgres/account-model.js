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
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { account_name, user_id } = data;
    const account_source = (_a = data.account_source) !== null && _a !== void 0 ? _a : "manual";
    const account_balance = (_b = data.account_balance) !== null && _b !== void 0 ? _b : 0;
    const queryText = `INSERT INTO accounts(user_id,account_name,account_balance,account_source) VALUES ($1,$2,$3,$4) RETURNING *`;
    const params = [user_id, account_name, account_balance, account_source];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM accounts WHERE id=$1";
    const params = [id];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findOneByUserAndSource = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_source, userId } = data;
    const queryText = "SELECT * FROM accounts WHERE user_id=$1 AND account_source=$2";
    const params = [userId, account_source];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
});
const findOneByName = (_a) => __awaiter(void 0, [_a], void 0, function* ({ account_name, user_id, }) {
    const queryText = "SELECT * FROM accounts WHERE user_id=$1 AND account_name=$2";
    const params = [user_id, account_name];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM accounts WHERE user_id=$1";
    const params = [userId];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
});
const deleteMany = (accountIds) => __awaiter(void 0, void 0, void 0, function* () {
    const placeHolders = accountIds.map((_, index) => `$${index + 1}`).join(",");
    const queryText = `DELETE FROM accounts WHERE id IN (${placeHolders}) RETURNING *`;
    const res = yield (0, db_1.query)(queryText, accountIds);
    return res.rows;
});
const deleteManyBySource = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_source, user_id } = data;
    const queryText = `DELETE FROM accounts WHERE user_id=$1 AND account_source=$2 RETURNING *`;
    const params = [user_id, account_source];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
});
const deleteOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = `DELETE FROM accounts WHERE id=$1 RETURNING *`;
    const params = [id];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const updateOneById = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_balance, account_name, id, user_id } = data;
    const queryText = `UPDATE accounts SET account_balance=$3,account_name=$4 WHERE id=$1 AND user_id=$2 RETURNING *`;
    const params = [id, user_id, account_balance, account_name];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const updateOneByUserId = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_balance, account_name, user_id } = data;
    const queryText = `UPDATE accounts SET account_balance=$3 WHERE user_id=$1 AND account_balance=$2 RETURNING *`;
    const params = [user_id, account_balance, account_name];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
exports.default = {
    create,
    findOneByName,
    findByUserId,
    deleteMany,
    deleteOneById,
    findOneById,
    updateOneById,
    findOneByUserAndSource,
    updateOneByUserId,
    deleteManyBySource,
};
