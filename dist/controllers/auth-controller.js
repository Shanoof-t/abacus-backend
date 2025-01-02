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
exports.googleOAuthcallback = exports.googleOAuth = exports.resendOTP = exports.verifyOTP = exports.signIn = exports.signUp = void 0;
const auth_service_1 = require("../services/auth-service");
const error_handlers_1 = require("../utils/error-handlers");
exports.signUp = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { email, _id } = yield (0, auth_service_1.createUser)(body);
    const otpInfo = yield (0, auth_service_1.createOTP)({ email, _id });
    res.status(200).json({
        status: "pending",
        message: "Verification otp email send",
        data: {
            userId: _id,
            email: email,
            otpInfo,
        },
    });
}));
exports.signIn = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { accessToken, user: { _id, email }, } = yield (0, auth_service_1.authenticateUser)(body);
    res.cookie("token", accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });
    res.status(200).json({
        status: "success",
        message: "Successfully logged In.",
        data: { _id, email },
    });
}));
exports.verifyOTP = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    yield (0, auth_service_1.verifyUserOTP)(body);
    res.status(200).json({
        status: "success",
        message: "OTP vefication is success",
    });
}));
exports.resendOTP = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    yield (0, auth_service_1.userOTPReSend)(body);
    res.status(200).json({
        status: "success",
        message: "Retry otp is success",
    });
}));
exports.googleOAuth = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorizationUrl = yield (0, auth_service_1.googleOAuthRequest)();
    res.status(200).json({
        status: "success",
        message: "google auth request is successfull",
        data: { redirectUrl: authorizationUrl },
    });
}));
exports.googleOAuthcallback = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    const data = yield (0, auth_service_1.googleOAuthCallback)(code);
    res.cookie("token", data.accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });
    res.status(200).json({
        status: "success",
        message: "google authentication is Successfull",
        data,
    });
}));
