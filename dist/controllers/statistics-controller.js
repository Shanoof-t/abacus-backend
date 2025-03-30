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
exports.serialFinincialSummary = exports.financialSummary = void 0;
const statistics_service_1 = require("../services/statistics-service");
const error_handlers_1 = require("../utils/error-handlers");
exports.financialSummary = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = req;
    const stati = yield (0, statistics_service_1.createSummary)(user, body);
    res.status(200).json({
        status: "success",
        message: "Successfully fetched money statistics",
        data: stati,
    });
}));
exports.serialFinincialSummary = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = req;
    const history = yield (0, statistics_service_1.fetchFinancialHistory)({ user, body });
    res.status(200).json({
        status: "success",
        message: "history fetch success",
        data: history,
    });
}));
