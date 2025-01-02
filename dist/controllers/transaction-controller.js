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
exports.addTransaction = void 0;
const transaction_service_1 = require("../services/transaction-service");
const error_handlers_1 = require("../utils/error-handlers");
// type Decoded = { sub?: Types.ObjectId; email?: string };
// interface CustomRequest extends Request {
//     user?: Decoded;
//   }
exports.addTransaction = (0, error_handlers_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    //   console.log(req.user)
    const transaction = yield (0, transaction_service_1.createTransaction)(body);
    res
        .status(200)
        .json({
        status: "success",
        message: "Transaction is successfull.",
        data: transaction,
    });
}));
