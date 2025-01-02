"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleOauth2Client = void 0;
const googleapis_1 = require("googleapis");
const env_variables_1 = __importDefault(require("./env_variables"));
exports.googleOauth2Client = new googleapis_1.google.auth.OAuth2({
    clientId: env_variables_1.default.GOOGLE_CLIENT_ID,
    clientSecret: env_variables_1.default.GOOGLE_CLIENT_SECRET,
    redirectUri: env_variables_1.default.GOOGLE_REDIRECT_URL,
});
