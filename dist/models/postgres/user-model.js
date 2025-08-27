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
const findOneWithId = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, isVerified = true) {
    const res = yield (0, db_1.query)("SELECT * FROM users WHERE id=$1 AND is_verified=$2", [id, isVerified]);
    return res.rows[0];
});
const findOneWithEmail = (email_1, ...args_1) => __awaiter(void 0, [email_1, ...args_1], void 0, function* (email, isVerified = true) {
    const res = yield (0, db_1.query)("SELECT * FROM users WHERE email=$1 AND is_verified=$2", [email, isVerified]);
    return res.rows[0];
});
const addUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, user_name, picture, google_id, is_google, is_verified, } = input;
    const queryText = `
  INSERT INTO users (email, user_name, password, google_id, is_google, is_verified, picture)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *
`;
    const params = [
        email,
        user_name,
        password,
        google_id !== null && google_id !== void 0 ? google_id : null,
        is_google !== null && is_google !== void 0 ? is_google : false,
        is_verified !== null && is_verified !== void 0 ? is_verified : false,
        picture !== null && picture !== void 0 ? picture : null,
    ];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const update = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "UPDATE users SET is_verified=true WHERE id=$1 returning *";
    const params = [userId];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
exports.default = { findOneWithEmail, findOneWithId, addUser, update };
