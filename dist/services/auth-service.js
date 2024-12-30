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
exports.authenticateUser = exports.createUser = void 0;
const user_helper_1 = __importDefault(require("../helpers/user-helper"));
const Custom_error_1 = __importDefault(require("../utils/Custom-error"));
const security_helper_1 = __importDefault(require("../helpers/security-helper"));
const token_helper_1 = __importDefault(require("../helpers/token-helper"));
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
