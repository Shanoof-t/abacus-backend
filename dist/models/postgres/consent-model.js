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
    const { user_id, consent_id, user_email } = data;
    const queryText = "INSERT INTO consent (consent_id,user_id,user_email) VALUES ($1,$2,$3) RETURNING *";
    const params = [consent_id, user_id, user_email];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM consent WHERE id=$1";
    const params = [id];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findOneByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM consent WHERE user_id=$1";
    const params = [userId];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findOneAndUpdateAfterConnected = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { connectedAccounts, consent_id, isApproved } = data;
    const queryText = "UPDATE consent SET connected_accounts=$2,is_approved=$3 WHERE id=$1 RETURNING *";
    const params = [consent_id, connectedAccounts, isApproved];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findOneAndDelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "DELETE FROM consent WHERE id=$1 RETURNING *";
    const params = [id];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const deleteManyByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "DELETE FROM consent WHERE user_id=$1 RETURNING *";
    const params = [userId];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
});
exports.default = {
    create,
    findOneAndDelete,
    findOneAndUpdateAfterConnected,
    findOneById,
    deleteManyByUserId,
    findOneByUserId
};
