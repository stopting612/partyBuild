import express from "express"
import { alcoholController, newPartyRoomController } from "../main"
import { checkLogin } from "../utils/guards"

export const alcoholRouter = express.Router()

// Get alcohol Data
alcoholRouter.get('/alcohol/types', alcoholController.getAlcoholTypes)
alcoholRouter.get('/alcohol', checkLogin, alcoholController.getAlcohols)
alcoholRouter.get('/alcohol/price', alcoholController.getAlcoholPrice)
alcoholRouter.get('/alcohol/:id', checkLogin, alcoholController.getAlcoholById)
alcoholRouter.get('/alcohol/rating/:alcoholId/:pageNum', alcoholController.getAlcoholRating)
alcoholRouter.get('/new-party/alcohols', newPartyRoomController.getUserChoiceAlcohols)