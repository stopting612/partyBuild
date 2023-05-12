import express from "express"
import {
    alcoholController,
    newPartyRoomController,
    partyRoomController,
    restaurantController
} from "../main"

export const recommendRouter = express.Router()

recommendRouter.get('/home-recommend', newPartyRoomController.getHomePageRecommend)
recommendRouter.get('/party-room/recommend/:id', partyRoomController.getRecommendParty)
recommendRouter.get("/restaurant/recommend/:id", restaurantController.getRecommendRestaurant)
recommendRouter.get('/alcohol/recommend/:id', alcoholController.getRecommendAlcohol)
