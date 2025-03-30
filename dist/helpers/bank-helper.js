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
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const setu = __importStar(require("../utils/setu"));
const setu_session_helper_1 = __importDefault(require("./setu-session-helper"));
exports.default = {
    handleActiveConsent: (_a) => __awaiter(void 0, [_a], void 0, function* ({ accessToken, consent, dataRange, }) {
        console.log("handleActiveConsent triggered");
        /**
         * create session for fi
         */
        console.log("accessToken", accessToken);
        console.log("dataRange", dataRange);
        console.log("consent", consent);
        const sessionRes = yield setu.createSession({
            accessToken,
            consentId: consent.id,
            dataRange,
        });
        console.log("sessionRes", sessionRes);
        /**
         * make get req for session, and wait for the req until it tores status as "COMPLETED" or "PARTIAL"
         */
        const fi = yield setu.pollSessionStatus({
            accessToken,
            sessionId: sessionRes.id,
        });
        // use switch pending section instead of polling
        if (!fi)
            throw new Custom_error_1.default("Can't find completed session", 500);
        console.log("fi>>>>>", fi);
        switch (fi.status) {
            case "COMPLETED":
                return yield setu_session_helper_1.default.handleCompletedOrPartialSession({
                    accessToken,
                    consent,
                    fi,
                });
            case "PARTIAL":
                return yield setu_session_helper_1.default.handleCompletedOrPartialSession({
                    accessToken,
                    consent,
                    fi,
                });
            case "PENDING":
                return yield setu_session_helper_1.default.handlePending({
                    accessToken,
                    consent,
                    fi,
                });
            case "EXPIRED":
                return yield setu_session_helper_1.default.handleExpired({
                    accessToken,
                    consent,
                    fi,
                });
            case "FAILED":
                return yield setu_session_helper_1.default.handleFailed({
                    accessToken,
                    consent,
                    fi,
                });
            default:
                throw new Custom_error_1.default("Can't find completed session", 500);
        }
        // if (fi.status === "COMPLETED" || fi.status === "PARTIAL") {
        //   const now = new Date();
        //   const nextDate = new Date(now);
        //   nextDate.setDate(now.getDate() + 1);
        //   const cronExp = formatCronExpression({ nextDate });
        //   console.log("cronExp", cronExp);
        //   cron.schedule(cronExp, scheduleNextSession);
        //   async function scheduleNextSession() {
        //     const now = new Date();
        //     const from = new Date(now);
        //     from.setDate(now.getDate() - 1);
        //     const nextDataRange = {
        //       from: from.toISOString(),
        //       to: now.toISOString(),
        //     };
        //     const sessionRes = await setu.createSession({
        //       accessToken,
        //       consentId: consent.id,
        //       dataRange: nextDataRange,
        //     });
        //   }
        //   return { fi, consentStatus: consent.status };
        // } else {
        //   throw new CustomError("Can't find completed session", 500);
        // }
    }),
    handlePendingConsent: ({ accessToken, consent, }) => {
        console.log("Handle Pending Consent");
        return { consentStatus: consent.status };
    },
    handleRejectedConsent: ({ accessToken, consent, }) => {
        console.log("Handle Rejected Consent");
        return { consentStatus: consent.status };
    },
    handleRevokedConsent: ({ accessToken, consent, }) => {
        console.log("Handle Revoked Consent");
        return { consentStatus: consent.status };
    },
    handlePausedConsent: ({ accessToken, consent, }) => {
        console.log("Handle paused Consent");
        return { consentStatus: consent.status };
    },
    handleExpiredConsent: ({ accessToken, consent, }) => {
        console.log("Handle expired Consent");
        return { consentStatus: consent.status };
    },
};
