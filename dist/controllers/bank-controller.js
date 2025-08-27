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
exports.disConnectBankAccount = exports.getUserConsent = exports.setuNotifications = exports.createSetuConsent = void 0;
const bank_service_1 = require("../services/bank-service");
const error_handlers_1 = require("../utils/error-handlers");
exports.createSetuConsent = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNo } = req.params;
    const setuToken = req.setuToken;
    const user = req.user;
    const response = yield (0, bank_service_1.createConsentUrl)(mobileNo, setuToken, user);
    // return res.redirect(response.url)
    res.status(200).json({
        status: "success",
        message: "Consent created Successfully.",
        data: response,
    });
}));
exports.setuNotifications = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    console.log("bank notification:", body);
    switch (body.type) {
        case "CONSENT_STATUS_UPDATE":
            yield (0, bank_service_1.updateUserConsent)(body);
            break;
        case "FI_DATA_READY":
            yield (0, bank_service_1.storeBankTransactions)(body);
            break;
        default:
            console.log("Some thing happed in the setu notification");
            console.log("set notification:", body);
            break;
    }
    res
        .status(200)
        .json({ status: "success", message: "got notification successfully" });
}));
exports.getUserConsent = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const data = yield (0, bank_service_1.getConsentByUserId)(user);
    res
        .status(200)
        .json({ status: "success", message: "consent fetch successfull", data });
}));
exports.disConnectBankAccount = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { consentId } = req.params;
    const { user } = req;
    yield (0, bank_service_1.disConnectBankAccountByConsentId)(consentId, user);
    res
        .status(203)
        .json({ status: "success", message: "Successfully disconnected" });
}));
