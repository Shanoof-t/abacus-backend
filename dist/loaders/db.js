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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.query = void 0;
const pg_1 = __importDefault(require("pg"));
const env_variables_1 = __importDefault(require("../config/env_variables"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const poolConfig = {
    host: env_variables_1.default.DB_HOST,
    user: env_variables_1.default.DB_USER,
    password: env_variables_1.default.DB_PASSWORD,
    port: env_variables_1.default.DB_PORT,
    database: env_variables_1.default.DB_NAME,
};
// change types manually
pg_1.default.types.setTypeParser(1700, (val) => new decimal_js_1.default(val).toDecimalPlaces(2).toNumber());
const pool = new pg_1.default.Pool(poolConfig);
pool.on("connect", (client) => {
    // console.log("db client connected,", client);
});
const query = (queryText, params) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = Date.now();
    try {
        const res = yield pool.query(queryText, params);
        const duration = Date.now() - startTime;
        console.log("QUERY EXECUTED:", {
            query: queryText,
            duration,
            rowCount: res.rowCount,
            rows: res.rows,
        });
        return res;
    }
    catch (error) {
        const err = {
            query: queryText,
            error: error.message,
        };
        console.error("QUERY FAILED:", err);
        throw err;
    }
});
exports.query = query;
const getClient = () => {
    return pool.connect();
};
exports.getClient = getClient;
