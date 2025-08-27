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
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const security_helper_1 = __importDefault(require("../helpers/security-helper"));
const token_helper_1 = __importDefault(require("../helpers/token-helper"));
const auth_helper_1 = __importDefault(require("../helpers/auth-helper"));
const google_oauth2_1 = require("../config/google_oauth2");
const brevo_1 = __importDefault(require("../utils/brevo"));
const nodemailer_1 = require("../config/nodemailer");
const user_repository_1 = __importDefault(require("../repositories/user-repository"));
const otp_repository_1 = __importDefault(require("../repositories/otp-repository"));
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = user;
    const existingUser = yield user_repository_1.default.findOneWithEmail(email);
    if (existingUser && existingUser.is_verified === true) {
        throw new Custom_error_1.default(`You already registered with this email`, 400);
    }
    else if (existingUser) {
        return existingUser;
    }
    const password = yield security_helper_1.default.hashPassword({
        password: user.password,
    });
    return yield user_repository_1.default.addUser({
        email: user.email,
        user_name: user.user_name,
        password,
    });
});
exports.createUser = createUser;
const authenticateUser = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginData;
    const user = yield user_repository_1.default.findOneWithEmail(email);
    if (!user)
        throw new Custom_error_1.default("Your email is incorrect", 404);
    if (!user.password && user.is_google) {
        throw new Custom_error_1.default("You are sign up with google,try google sign in.", 500);
    }
    else if (!user.password) {
        throw new Custom_error_1.default("Can't find the password,", 500);
    }
    const isPasswordCorrect = yield security_helper_1.default.VerifyPassword({
        password,
        existingPassword: user.password,
    });
    if (!isPasswordCorrect)
        throw new Custom_error_1.default("Check your password again", 401);
    const payload = { sub: user.id, email: user.email };
    const accessToken = token_helper_1.default.generateToken(payload);
    return { accessToken, user };
});
exports.authenticateUser = authenticateUser;
const createOTP = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, email, user_name, user_id, }) {
    const otp = auth_helper_1.default.generateOTP();
    const hashedOTP = yield security_helper_1.default.hashOTP({ otp });
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 60 * 1000);
    const otpInfo = yield auth_helper_1.default.createOneTimePassword({
        id,
        otp: hashedOTP,
        email,
        user_id,
        created_at: createdAt,
        expires_at: expiresAt,
    });
    if (process.env.NODE_ENV === "development") {
        const option = (0, nodemailer_1.mailOption)({ email, otp });
        const result = yield nodemailer_1.transporter.sendMail(option);
        console.log("✅ Email sent:", result.response);
    }
    else {
        yield (0, brevo_1.default)({ otp, toEmail: email, userName: user_name });
    }
    return otpInfo;
});
exports.createOTP = createOTP;
const verifyUserOTP = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, userId } = body;
    const userOTPRecord = yield otp_repository_1.default.findOne(userId);
    if (!userOTPRecord) {
        throw new Custom_error_1.default("Account record doesn't exist or has been verified already.Please sign up or sign in.", 400);
    }
    else {
        const { expires_at, otp: hashedOTP } = userOTPRecord;
        if (!expires_at) {
            throw new Custom_error_1.default("expiresAt is not defined", 500);
        }
        const expires = new Date(expires_at.getTime());
        const now = new Date();
        if (expires < now) {
            yield otp_repository_1.default.deleteOne(userId);
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
                const user = yield user_repository_1.default.update(userId);
                yield otp_repository_1.default.deleteOne(userId);
                const payload = { sub: user.id, email: user.email };
                const accessToken = token_helper_1.default.generateToken(payload);
                return { user, accessToken };
            }
        }
    }
});
exports.verifyUserOTP = verifyUserOTP;
const userOTPReSend = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = body;
    const user = yield user_repository_1.default.findOneWithId(userId, false);
    if (!user)
        throw new Custom_error_1.default("user not founded", 404);
    const { email, id, user_name } = user;
    yield (0, exports.createOTP)({ email, id, user_id: id, user_name });
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
    const { email, sub, picture, name } = yield auth_helper_1.default.getUserDataFromGoogle(user.access_token);
    const userfromdb = yield user_repository_1.default.findOneWithEmail(email);
    if (userfromdb &&
        email === userfromdb.email &&
        userfromdb.is_google === false) {
        throw new Custom_error_1.default(`You already signup with this ${email},please signin.`, 400);
    }
    let userData = userfromdb;
    if (!userfromdb) {
        const user = yield user_repository_1.default.addUser({
            user_name: name,
            email: email,
            google_id: sub,
            picture: picture,
            is_google: true,
            is_verified: true,
            password: "",
        });
        userData = user;
    }
    if (!userData)
        throw new Custom_error_1.default(`Can't find user with this email ${email},please signup.`, 404);
    const payload = { sub: userData.id, email: userData.email };
    const accessToken = token_helper_1.default.generateToken(payload);
    return { accessToken, userData };
});
exports.googleOAuthCallback = googleOAuthCallback;
