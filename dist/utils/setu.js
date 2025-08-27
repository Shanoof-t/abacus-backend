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
exports.createConsentRequest = exports.createConsentData = exports.fetchSetuToken = void 0;
const axios_1 = __importDefault(require("axios"));
const env_variables_1 = __importDefault(require("../config/env_variables"));
const Custom_error_1 = __importDefault(require("./Custom-error"));
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
    const consentData = JSON.stringify({
        consentDuration: {
            unit: "YEAR",
            value: "100",
        },
        dataLife: {
            unit: "YEAR",
            value: 100,
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
            to: new Date().toISOString(),
        },
        consentMode: "STORE",
        fetchType: "PERIODIC",
        frequency: {
            unit: "DAY",
            value: "10",
        },
        consentTypes: ["TRANSACTIONS", "PROFILE", "SUMMARY"],
        context: [],
        redirectUrl: `${env_variables_1.default.FRONT_END_URL}/settings`,
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
    try {
        const response = yield axios_1.default.request(requestConfig);
        return response.data;
    }
    catch (error) {
        console.log("error in consent creation", error.response.data);
        throw new Custom_error_1.default("Something wrong happened,Please try again later.", 500);
    }
});
exports.createConsentRequest = createConsentRequest;
