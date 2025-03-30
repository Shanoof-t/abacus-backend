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
exports.createSession = exports.getConsentById = exports.createConsentRequest = exports.createConsentData = exports.fetchSetuToken = void 0;
exports.pollSessionStatus = pollSessionStatus;
const axios_1 = __importDefault(require("axios"));
const env_variables_1 = __importDefault(require("../config/env_variables"));
const fetchSetuToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const tokenReqConfig = {
        method: "post",
        url: "https://orgservice-prod.setu.co/v1/users/login",
        headers: {
            client: "bridge",
        },
        data: {
            clientID: env_variables_1.default.SETU_CLIENT_ID,
            grant_type: "client_credentials",
            secret: env_variables_1.default.SETU_CLIENT_SECRET,
        },
    };
    const response = yield axios_1.default.request(tokenReqConfig);
    return response.data.access_token;
});
exports.fetchSetuToken = fetchSetuToken;
const createConsentData = (mobileNumber) => {
    // const consentData = JSON.stringify({
    //   consentDateRange: {
    //     startDate: "1900-01-01T00:00:00Z",
    //     endDate: new Date().toISOString(),
    //   },
    //   purpose: {
    //     code: "101",
    //     text: "To get transaction history for calculation",
    //     refUri: "https://api.rebit.org.in/aa/purpose/101.xml",
    //     category: {
    //       type: "Wealth management service",
    //     },
    //   },
    //   vua: `${mobileNumber}@onemoney`,
    //   dataRange: {
    //     from: "1900-01-01T00:00:00Z",
    //     to: new Date().toISOString(),
    //   },
    //   consentMode: "STORE",
    //   consentTypes: ["TRANSACTIONS"],
    //   fetchType: "PERIODIC",
    //   context: [],
    //   redirectUrl: "http://localhost:3000/settings",
    // });
    const now = new Date();
    const consentEndDate = new Date(now);
    consentEndDate.setFullYear(now.getFullYear() + 1);
    const consentData = JSON.stringify({
        consentDuration: {
            unit: "YEAR",
            value: "1",
        },
        purpose: {
            code: "101",
            text: "To get transaction history for calculation",
            refUri: "https://api.rebit.org.in/aa/purpose/101.xml",
            category: {
                type: "Wealth management service",
            },
        },
        vua: `${mobileNumber}@onemoney`,
        dataRange: {
            from: "1900-01-01T00:00:00Z",
            to: consentEndDate.toISOString(),
        },
        consentMode: "STORE",
        fetchType: "PERIODIC",
        frequency: {
            unit: "DAY",
            value: "1",
        },
        consentTypes: ["TRANSACTIONS", "PROFILE", "SUMMARY"],
        context: [],
        redirectUrl: "http://localhost:3000/settings",
    });
    return consentData;
};
exports.createConsentData = createConsentData;
const createConsentRequest = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, body, }) {
    var requestConfig = {
        method: "post",
        url: env_variables_1.default.SETU_BASE_URL + "/consents",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + token,
            "x-product-instance-id": env_variables_1.default.SETU_PRODUCT_ID,
        },
        data: body,
    };
    const response = yield axios_1.default.request(requestConfig);
    return response.data;
});
exports.createConsentRequest = createConsentRequest;
const getConsentById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, accessToken, }) {
    const config = {
        method: "get",
        url: `${env_variables_1.default.SETU_BASE_URL}/consents/${id}`,
        headers: {
            "x-product-instance-id": env_variables_1.default.SETU_PRODUCT_ID,
            Authorization: `Bearer ${accessToken}`,
        },
    };
    const response = yield axios_1.default.request(config);
    return response.data;
});
exports.getConsentById = getConsentById;
const createSession = (_a) => __awaiter(void 0, [_a], void 0, function* ({ consentId, accessToken, dataRange, }) {
    const body = {
        consentId,
        dataRange,
        format: "json",
    };
    console.log("body", body);
    const config = {
        method: "post",
        url: env_variables_1.default.SETU_BASE_URL + "/sessions",
        headers: {
            "x-product-instance-id": env_variables_1.default.SETU_PRODUCT_ID,
            Authorization: `Bearer ${accessToken}`,
        },
        data: body,
    };
    // create session
    const response = yield axios_1.default.request(config);
    console.log("session", response.data);
    return response.data;
});
exports.createSession = createSession;
function pollSessionStatus(_a) {
    return __awaiter(this, arguments, void 0, function* ({ accessToken, sessionId, }) {
        for (let i = 1; i <= 10; i++) {
            const sessionConfig = {
                method: "get",
                url: `${env_variables_1.default.SETU_BASE_URL}/sessions/${sessionId}`,
                headers: {
                    "x-product-instance-id": env_variables_1.default.SETU_PRODUCT_ID,
                    Authorization: `Bearer ${accessToken}`,
                },
            };
            const summary = yield axios_1.default.request(sessionConfig);
            console.log("summary", summary.data);
            if (summary.data.status === "PARTIAL" ||
                summary.data.status === "COMPLETED") {
                return summary.data;
            }
        }
    });
}
