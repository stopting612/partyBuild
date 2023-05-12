import express from "express"
import { newPartyRoomController, restaurantController } from "../main"
import { checkLogin } from "../utils/guards"

export const menuRouter = express.Router()

// Get menu Data
menuRouter.get("/restaurant/cuisine-type", restaurantController.getRestaurantCuisineType)
menuRouter.get("/restaurant/menu", checkLogin, restaurantController.getRestaurantMenu)
menuRouter.get("/restaurant/menu/:id", checkLogin, restaurantController.getMenuById)
menuRouter.get("/restaurant/rating/:menuId/:pageNum", restaurantController.getMenuRating)
menuRouter.get("/restaurant/menu-price", restaurantController.getMenuPrice)
menuRouter.get('/new-party/menus', newPartyRoomController.getUserChoiceMenus)