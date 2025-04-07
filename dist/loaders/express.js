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
const global_error_hanlder_1 = __importDefault(require("../utils/global-error-hanlder"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
exports.default = (_a) => __awaiter(void 0, [_a], void 0, function* ({ app, express }) {
    app.use(express.json());
    const allowedOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://abacuss.online",
        "http://www.abacuss.online",
        "https://abacuss.online",
        "https://www.abacuss.online",
        "http://3.110.46.217:8080",
        "https://3.110.46.217:8080",
    ];
    app.use((0, cors_1.default)({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    }));
    app.use((0, cookie_parser_1.default)());
    // app.use(
    //   session({
    //     secret:
    //       "v0HmmKJbHq21Ycq7i3PBlsP4G+lic+2PMwnwZrbnrP0CB/cf/mq2akZutY56+Mc2jn7TCVr8Nsw17SXmv41xow==",
    //     resave: false,
    //     saveUninitialized: false,
    //     cookie: { secure: false },
    //   })
    // );
    // app.use((req, res, next) => {
    //   req.session.state = req.session.state || "defaultState";
    //   next();
    // });
    (0, routes_1.default)({ app, express });
    app.use(global_error_hanlder_1.default);
});
