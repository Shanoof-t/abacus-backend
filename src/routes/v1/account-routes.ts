import express from "express";
import { addAccount } from "../../controllers/account-controller";

const accountRouter = express.Router()

accountRouter.post("/",addAccount)

export default accountRouter