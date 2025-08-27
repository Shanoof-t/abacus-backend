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
    const { id, otp, created_at, expires_at } = data;
    const queryText = "INSERT INTO one_time_password(user_id,otp,created_at,expires_at) VALUES ($1,$2,$3,$4) RETURNING *";
    const params = [id, otp, created_at, expires_at];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findOne = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM one_time_password WHERE user_id=$1 ORDER BY expires_at DESC";
    const params = [userId];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const deleteOne = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "DELETE FROM one_time_password WHERE user_id=$1 RETURNING *";
    const params = [userId];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
exports.default = { create, findOne, deleteOne };
