"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_controller_1 = require("../../controllers/account-controller");
const jwt_authentication_middleware_1 = __importDefault(require("../../middlewares/jwt-authentication-middleware"));
const accountRouter = express_1.default.Router();
accountRouter.use(jwt_authentication_middleware_1.default);
accountRouter.route("/").post(account_controller_1.addAccount).get(account_controller_1.getAllAccounts);
accountRouter.post("/bulk-delete", account_controller_1.accountBulkDelete);
accountRouter
    .route("/:id")
    .delete(account_controller_1.deleteAccount)
    .put(account_controller_1.editAccount)
    .get(account_controller_1.getAccount);
exports.default = accountRouter;
