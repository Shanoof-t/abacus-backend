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
exports.logoutUser = exports.googleOAuthcallback = exports.googleOAuth = exports.resendOTP = exports.verifyOTP = exports.signIn = exports.signUp = void 0;
const auth_service_1 = require("../services/auth-service");
const error_handlers_1 = require("../utils/error-handlers");
const env_variables_1 = __importDefault(require("../config/env_variables"));
exports.signUp = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { email, id, user_name } = yield (0, auth_service_1.createUser)(body);
    const otpInfo = yield (0, auth_service_1.createOTP)({
        email,
        id,
        user_name,
    });
    res.status(200).json({
        status: "pending",
        message: "Verification OTP has been sent to your email.",
        data: {
            userId: id,
            email: email,
            userName: user_name,
            otpInfo,
        },
    });
}));
exports.signIn = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { accessToken, user: { id, email, user_name }, } = yield (0, auth_service_1.authenticateUser)(body);
    if (process.env.NODE_ENV === "development") {
        res.cookie("token", accessToken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });
    }
    else {
        res.cookie("token", accessToken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: ".abacuss.online",
            path: "/",
        });
    }
    res.status(200).json({
        status: "success",
        message: "Successfully logged In.",
        data: { id, email, user_name },
        token: accessToken,
    });
}));
exports.verifyOTP = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { user, accessToken } = yield (0, auth_service_1.verifyUserOTP)(body);
    const { email, user_name, id } = user;
    res.status(200).json({
        status: "success",
        message: "OTP vefication is success",
        data: { id, email, user_name },
        token: accessToken,
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
    res.redirect(authorizationUrl);
}));
exports.googleOAuthcallback = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    const data = yield (0, auth_service_1.googleOAuthCallback)(code);
    if (process.env.NODE_ENV === "development") {
        res.cookie("token", data.accessToken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });
    }
    else {
        res.cookie("token", data.accessToken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: ".abacuss.online",
            path: "/",
        });
    }
    const redirectUrl = `${env_variables_1.default.FRONT_END_URL}?name=${data.userData.user_name}`;
    res.redirect(redirectUrl);
}));
exports.logoutUser = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === "development") {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });
    }
    else {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: ".abacuss.online",
            path: "/",
        });
    }
    res
        .status(200)
        .json({ status: "success", message: "Logged out successfully" });
}));
