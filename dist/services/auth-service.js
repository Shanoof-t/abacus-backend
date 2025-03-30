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
exports.googleOAuthCallback = exports.googleOAuthRequest = exports.userOTPReSend = exports.verifyUserOTP = exports.createOTP = exports.authenticateUser = exports.createUser = void 0;
const user_helper_1 = __importDefault(require("../helpers/user-helper"));
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const security_helper_1 = __importDefault(require("../helpers/security-helper"));
const token_helper_1 = __importDefault(require("../helpers/token-helper"));
const auth_helper_1 = __importDefault(require("../helpers/auth-helper"));
const nodemailer_1 = require("../config/nodemailer");
const otp_verification_model_1 = require("../models/otp-verification-model");
const user_model_1 = require("../models/user-model");
const google_oauth2_1 = require("../config/google_oauth2");
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = user;
    const existingUser = yield user_helper_1.default.getUser({ email });
    if (existingUser)
        throw new Custom_error_1.default(`You already registered with this email`, 400);
    return yield user_helper_1.default.addUser(user);
});
exports.createUser = createUser;
const authenticateUser = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginData;
    const user = yield user_helper_1.default.getUser({ email });
    if (!user)
        throw new Custom_error_1.default("Your email is incorrect", 404);
    if (!user.password)
        throw new Custom_error_1.default("Can't find the existing password", 500);
    const isPasswordCorrect = yield security_helper_1.default.VerifyPassword({
        password,
        existingPassword: user.password,
    });
    if (!isPasswordCorrect)
        throw new Custom_error_1.default("Check your password again", 401);
    const payload = { sub: user._id, email: user.email };
    const accessToken = token_helper_1.default.generateToken(payload);
    return { accessToken, user };
});
exports.authenticateUser = authenticateUser;
const createOTP = (_a) => __awaiter(void 0, [_a], void 0, function* ({ _id, email }) {
    const otp = auth_helper_1.default.generateOTP();
    const hashedOTP = yield security_helper_1.default.hashOTP({ otp });
    const otpInfo = yield auth_helper_1.default.createOneTimePassword({
        _id,
        hashedOTP,
        email,
    });
    const mailOptions = (0, nodemailer_1.mailOption)({ email, otp });
    yield nodemailer_1.transporter.sendMail(mailOptions);
    return otpInfo;
});
exports.createOTP = createOTP;
const verifyUserOTP = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, userId } = body;
    const userOTPRecord = yield otp_verification_model_1.OneTimePassword.findOne({ userId });
    if (!userOTPRecord) {
        throw new Custom_error_1.default("Account record doesn't exist or has been verified already.Please sign up or sign in.", 400);
    }
    else {
        const { expiresAt, otp: hashedOTP } = userOTPRecord;
        if (!expiresAt) {
            throw new Custom_error_1.default("expiresAt is not defined", 500);
        }
        if (expiresAt.getTime() < Date.now()) {
            yield otp_verification_model_1.OneTimePassword.deleteOne({ userId });
            throw new Custom_error_1.default("OTP has expired.Please try again.", 400);
        }
        else {
            if (!hashedOTP) {
                throw new Custom_error_1.default("Invalid OTP record. Please try again.", 500);
            }
            const validOTP = yield security_helper_1.default.verifyOTP({ otp, hashedOTP });
            if (!validOTP) {
                throw new Custom_error_1.default("Invalid OTP.Please check again.", 400);
            }
            else {
                yield user_model_1.User.updateOne({ _id: userId }, { isVerified: true });
                yield otp_verification_model_1.OneTimePassword.deleteOne({ userId });
            }
        }
    }
});
exports.verifyUserOTP = verifyUserOTP;
const userOTPReSend = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = body;
    const user = yield user_helper_1.default.getUser({ _id: userId });
    if (!user)
        throw new Custom_error_1.default("user not founded", 404);
    const { email, _id } = user;
    yield (0, exports.createOTP)({ email, _id });
});
exports.userOTPReSend = userOTPReSend;
const googleOAuthRequest = () => __awaiter(void 0, void 0, void 0, function* () {
    const scopes = [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
    ];
    return google_oauth2_1.googleOauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        prompt: "consent",
    });
});
exports.googleOAuthRequest = googleOAuthRequest;
const googleOAuthCallback = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield google_oauth2_1.googleOauth2Client.getToken(code);
    yield google_oauth2_1.googleOauth2Client.setCredentials(response.tokens);
    const user = google_oauth2_1.googleOauth2Client.credentials;
    const { email, sub, picture } = yield auth_helper_1.default.getUserDataFromGoogle(user.access_token);
    const userfromdb = yield user_helper_1.default.getUser({ email: email });
    if (userfromdb && email === userfromdb.email) {
        throw new Custom_error_1.default(`You already signup with this ${email},please signin.`, 400);
    }
    const userData = yield user_model_1.User.create({
        email: email,
        googleId: sub,
        picture: picture,
        isGoogle: true,
        isVerified: true,
    });
    const payload = { sub: userData._id, email: userData.email };
    const accessToken = token_helper_1.default.generateToken(payload);
    return { accessToken, userData };
});
exports.googleOAuthCallback = googleOAuthCallback;
