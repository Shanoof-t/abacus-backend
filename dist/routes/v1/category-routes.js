"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_authentication_middleware_1 = __importDefault(require("../../middlewares/jwt-authentication-middleware"));
const category_controller_1 = require("../../controllers/category-controller");
const categoryRouter = express_1.default.Router();
categoryRouter.use(jwt_authentication_middleware_1.default);
categoryRouter.route("/").post(category_controller_1.addCategory).get(category_controller_1.getAllCategories);
categoryRouter.route("/bulk-delete").post(category_controller_1.categoryBulkDelete);
categoryRouter.route("/:id").delete(category_controller_1.deleteCategory).get(category_controller_1.getCategory).put(category_controller_1.editCategory);
exports.default = categoryRouter;
