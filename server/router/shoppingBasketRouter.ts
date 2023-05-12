import express from "express"
import { userController } from "../main"
import { checkLogin, userIsLoggedIn } from "../utils/guards"

export const shoppingBasketRouter = express.Router()


// Get Shopping basket data
shoppingBasketRouter.get('/users/shopping-basket', userIsLoggedIn, userController.getUserShoppingBasket)
shoppingBasketRouter.get('/users/shopping-basket-history', userIsLoggedIn, userController.getUserShoppingBasketHistory)
shoppingBasketRouter.get('/users/shopping-basket/:id', userIsLoggedIn, checkLogin, userController.getUserShoppingBasketById)

// Change Shopping basket
shoppingBasketRouter.post('/users/new-shopping-basket', userIsLoggedIn, userController.createNewShoppingBasket)
shoppingBasketRouter.delete('/users/shopping-basket/:shoppingBasketId', userIsLoggedIn, userController.deleteShoppingBasketById)
shoppingBasketRouter.put('/users/shopping-basket/date', userIsLoggedIn, userController.updatePartyDate)
shoppingBasketRouter.put('/users/shopping-basket/start-time', userIsLoggedIn, userController.updatePartyStartTime)
shoppingBasketRouter.put('/users/shopping-basket/end-time', userIsLoggedIn, userController.updatePartyEndTime)

// Change Order data
shoppingBasketRouter.post('/users/add-party-room-order', userIsLoggedIn, userController.addPartyRoomOrder)
shoppingBasketRouter.post('/users/add-alcohol-order', userIsLoggedIn, userController.addAlcoholOrder)
shoppingBasketRouter.post('/users/add-food-order', userIsLoggedIn, userController.addFoodOrder)
shoppingBasketRouter.delete('/users/order', userIsLoggedIn, userController.deleteOrder)


