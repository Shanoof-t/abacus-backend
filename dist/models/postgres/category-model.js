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
const findOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM categories WHERE id=$1";
    const params = [id];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findOneByName = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, category_name } = data;
    const queryText = "SELECT * FROM categories WHERE user_id=$1 AND category_name=$2";
    const params = [user_id, category_name];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { user_id, category_name } = data;
    const is_bank_category = (_a = data.is_bank_category) !== null && _a !== void 0 ? _a : false;
    const queryText = "INSERT INTO categories (user_id,category_name,is_bank_category) VALUES ($1,$2,$3) RETURNING *";
    const params = [user_id, category_name, is_bank_category];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = "SELECT * FROM categories WHERE user_id=$1";
    const params = [userId];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows;
});
const deleteMany = (categoryIds) => __awaiter(void 0, void 0, void 0, function* () {
    const placeHolders = categoryIds.map((_, index) => `$${index + 1}`).join(",");
    const queryText = `DELETE FROM categories WHERE id IN (${placeHolders}) RETURNING *`;
    const res = yield (0, db_1.query)(queryText, categoryIds);
    return res.rows;
});
const deleteManyByBank = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = `DELETE FROM categories WHERE user_id=$1 AND is_bank_category=true RETURNING *`;
    const res = yield (0, db_1.query)(queryText, [userId]);
    return res.rows;
});
const deleteOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryText = `DELETE FROM categories WHERE id=$1 RETURNING *`;
    const params = [id];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
const updateOneById = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { category_name, id } = data;
    const queryText = `UPDATE categories SET category_name=$2 WHERE id=$1 RETURNING *`;
    const params = [id, category_name];
    const res = yield (0, db_1.query)(queryText, params);
    return res.rows[0];
});
exports.default = {
    findOneById,
    findOneByName,
    create,
    findByUserId,
    deleteMany,
    deleteOneById,
    updateOneById,
    deleteManyByBank
};
