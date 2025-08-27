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
    const { user_id, message, title, is_server_notification, future_payload } = data;
    const queryText = "INSERT INTO notifications (user_id,message,title,is_server_notification,future_payload) VALUES ($1,$2,$3,$4,$5) RETURNING *";
    const params = [
        user_id,
        message,
        title,
        is_server_notification,
        future_payload,
    ];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM notifications WHERE user_id=$1";
    const params = [userId];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM notifications WHERE id=$1";
    const params = [id];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const updateMarkAsRead = (id_1, _a) => __awaiter(void 0, [id_1, _a], void 0, function* (id, { is_read }) {
    const queryText = "UPDATE notifications SET is_read=$2 WHERE id=$1 RETURNING *";
    const params = [id, is_read];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "DELETE FROM notifications WHERE id=$1 RETURNING *";
    const params = [id];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
exports.default = { findByUserId, findById, updateMarkAsRead, deleteById, create };
