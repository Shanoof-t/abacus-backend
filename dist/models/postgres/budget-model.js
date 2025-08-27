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
    const { amount_limit, budget_end_date, budget_name, budget_start_date, category_name, notification_status, progress, user_id, alert_threshold, budget_note, total_spent, } = data;
    const queryText = "INSERT INTO budgets (user_id,budget_name,category_name,amount_limit,budget_start_date,budget_end_date,notification_status,budget_note,alert_threshold,total_spent,progress) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *";
    const params = [
        user_id,
        budget_name,
        category_name,
        amount_limit,
        budget_start_date,
        budget_end_date,
        notification_status,
        budget_note,
        alert_threshold,
        total_spent,
        progress,
    ];
    const res = yield (0, db_1.query)(queryText, params);
    console.log("data:", res.rows[0]);
    return res.rows[0];
});
const findOneByName = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user_id, category_name, }) {
    const queryText = "SELECT * FROM budgets WHERE user_id=$1 AND category_name=$2";
    const params = [user_id, category_name];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM budgets WHERE user_id=$1";
    const params = [userId];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
});
const findOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM budgets WHERE id=$1";
    const params = [id];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const deleteOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "DELETE FROM budgets WHERE id=$1 RETURNING *";
    const params = [id];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const update = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount_limit, budget_end_date, budget_name, budget_start_date, category_name, notification_status, progress, user_id, alert_threshold, budget_note, total_spent, id, } = data;
    const queryText = "UPDATE budgets SET budget_name=$3,category_name=$4,amount_limit=$5,budget_start_date=$6,budget_end_date=$7,budget_note=$8,total_spent=$9,progress=$10 WHERE id=$1 AND user_id=$2 RETURNING *";
    const params = [
        id,
        user_id,
        budget_name,
        category_name,
        amount_limit,
        budget_start_date,
        budget_end_date,
        budget_note,
        total_spent,
        progress,
    ];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const updateProgress = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("data in model:", data);
    const { category_name, progress, total_spent, user_id } = data;
    const queryText = "UPDATE budgets SET total_spent=$3,progress=$4 WHERE user_id=$1 AND category_name=$2 RETURNING *";
    const params = [user_id, category_name, total_spent, progress];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
exports.default = {
    create,
    findOneByName,
    findByUserId,
    findOneById,
    deleteOneById,
    update,
    updateProgress,
};
