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
const format_cron_expression_1 = __importDefault(require("../utils/format-cron-expression"));
const node_cron_1 = __importDefault(require("node-cron"));
const bank_helper_1 = __importDefault(require("./bank-helper"));
exports.default = {
    handleCompletedOrPartialSession: (_a) => __awaiter(void 0, [_a], void 0, function* ({ accessToken, consent, fi, }) {
        // store transactions
        const now = new Date();
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + 1);
        const cronExp = (0, format_cron_expression_1.default)({ nextDate });
        console.log("cronExp", cronExp);
        node_cron_1.default.schedule(cronExp, scheduleSetuNextSession);
        function scheduleSetuNextSession() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("scheduleSetuNextSession triggered");
                const now = new Date();
                const from = new Date(now);
                from.setDate(now.getDate() - 1);
                const nextDataRange = {
                    from: from.toISOString(),
                    to: now.toISOString(),
                };
                yield bank_helper_1.default.handleActiveConsent({
                    accessToken,
                    consent,
                    dataRange: nextDataRange,
                });
            });
        }
        // async function scheduleNextSession() {
        //   const now = new Date();
        //   const from = new Date(now);
        //   from.setDate(now.getDate() - 1);
        //   const nextDataRange = {
        //     from: from.toISOString(),
        //     to: now.toISOString(),
        //   };
        //   const sessionRes = await setu.createSession({
        //     accessToken,
        //     consentId: consent.id,
        //     dataRange: nextDataRange,
        //   });
        // }
        return { fi, consentStatus: consent.status };
    }),
    handlePending: (_a) => __awaiter(void 0, [_a], void 0, function* ({ accessToken, consent, fi }) {
        console.log("HANDLE PENDING SESSION");
    }),
    handleExpired: (_a) => __awaiter(void 0, [_a], void 0, function* ({ accessToken, consent, fi }) {
        console.log("HANDLE EXPIRED SESSION");
    }),
    handleFailed: (_a) => __awaiter(void 0, [_a], void 0, function* ({ accessToken, consent, fi }) {
        console.log("HANDLE FAILED SESSION");
    }),
};
