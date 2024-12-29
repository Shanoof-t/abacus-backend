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
const db_1 = __importDefault(require("./db"));
const express_1 = __importDefault(require("./express"));
require("colors");
exports.default = (_a) => __awaiter(void 0, [_a], void 0, function* ({ app, express }) {
    var _b;
    const db = yield (0, db_1.default)();
    console.log(`monogodb connected:${db.host}`.cyan.underline);
    console.log(`Connected to the database : ${(_b = db.db) === null || _b === void 0 ? void 0 : _b.databaseName}`.green.bold);
    (0, express_1.default)({ app, express });
});
