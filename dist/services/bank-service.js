"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.fetchTransactionsByConsentId = exports.createConsentUrl = void 0;
const setu = __importStar(require("../utils/setu"));
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const bank_helper_1 = __importDefault(require("../helpers/bank-helper"));
const createConsentUrl = (mobileNumber, setuToken) => __awaiter(void 0, void 0, void 0, function* () {
    let body = setu.createConsentData(mobileNumber);
    return yield setu.createConsentRequest({ token: setuToken, body });
});
exports.createConsentUrl = createConsentUrl;
const fetchTransactionsByConsentId = (id, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const consent = yield setu.getConsentById({ id, accessToken });
    if (!consent)
        throw new Custom_error_1.default("Can't find consent", 400);
    // may be i want to store this for future use
    const dataRange = {
        from: "1900-01-01T00:00:00Z",
        to: new Date().toISOString(),
    };
    switch (consent.status) {
        case "ACTIVE":
            return yield bank_helper_1.default.handleActiveConsent({
                accessToken,
                consent,
                dataRange,
            });
        case "PENDING":
            return yield bank_helper_1.default.handlePendingConsent({ accessToken, consent });
        case "REJECTED":
            return yield bank_helper_1.default.handleRejectedConsent({ accessToken, consent });
        case "REVOKED":
            return yield bank_helper_1.default.handleRevokedConsent({ accessToken, consent });
        case "PAUSED":
            return yield bank_helper_1.default.handlePausedConsent({ accessToken, consent });
        case "EXPIRED":
            return yield bank_helper_1.default.handleExpiredConsent({ accessToken, consent });
        default:
            throw new Custom_error_1.default("Something wrong happened", 500);
    }
});
exports.fetchTransactionsByConsentId = fetchTransactionsByConsentId;
// async function handleActiveConsent() {
//   /**
//    * create session for fi
//    */
//   const dataRange = {
//     from: "1900-01-01T00:00:00Z",
//     to: new Date().toISOString(),
//   };
//   const sessionRes = await setu.createSession({
//     accessToken,
//     consentId: response.id,
//     dataRange,
//   });
//   /**
//    * make get req for session, and wait for the req until it tores status as "COMPLETED" or "PARTIAL"
//    */
//   const fi = await setu.pollSessionStatus({
//     accessToken,
//     sessionId: sessionRes.id,
//   });
//   if (!fi) throw new CustomError("Can't find completed session", 500);
//   if (fi.status === "COMPLETED" || fi.status === "PARTIAL") {
//     const now = new Date();
//     const nextDate = new Date(now);
//     nextDate.setDate(now.getDate() + 1);
//     const cronExp = formatCronExpression({ nextDate });
//     console.log("cronExp", cronExp);
//     cron.schedule(cronExp, scheduleNextSession);
//     async function scheduleNextSession() {
//       const now = new Date();
//       const from = new Date(now);
//       from.setDate(now.getDate() - 1);
//       const nextDataRange = {
//         from: from.toISOString(),
//         to: now.toISOString(),
//       };
//       const sessionRes = await setu.createSession({
//         accessToken,
//         consentId: response.id,
//         dataRange: nextDataRange,
//       });
//     }
//     return { fi, consentStatus: response.status };
//   } else {
//     /**
//      * handle error if the session didt completed
//      * it will retry after 1 day
//      */
//     throw new CustomError("Can't find completed session", 500);
//   }
// }
