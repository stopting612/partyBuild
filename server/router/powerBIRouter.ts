import express from "express"
import { copartnerController } from "../main"
import { copartnerIsLoggedIn } from "../utils/guards"

export const powerBIRouter = express.Router()

// Get PowerBI Report
powerBIRouter.get('/copartner/powerbi', copartnerIsLoggedIn, copartnerController.getPowerBIToken)
