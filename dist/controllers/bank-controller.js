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
exports.fetchTransactions = exports.createSetuConsent = void 0;
const bank_service_1 = require("../services/bank-service");
const error_handlers_1 = require("../utils/error-handlers");
exports.createSetuConsent = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNo } = req.params;
    const setuToken = req.setuToken;
    const response = yield (0, bank_service_1.createConsentUrl)(mobileNo, setuToken);
    res.status(200).json({
        status: "success",
        message: "Consent created Successfully.",
        data: response,
    });
}));
exports.fetchTransactions = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const setuToken = req.setuToken;
    const data = yield (0, bank_service_1.fetchTransactionsByConsentId)(id, setuToken);
    res.status(200).json({
        status: "success",
        message: "consent get success",
        data,
    });
}));
