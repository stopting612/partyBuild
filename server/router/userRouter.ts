import express from "express"
import { userController } from "../main"
import { checkLogin, userIsLoggedIn } from "../utils/guards"

export const userRouter = express.Router()

// profile
userRouter.get("/users/profile", userIsLoggedIn, checkLogin, userController.getUserDate)
userRouter.get('/users/name-picture', userController.getUserNameAndPicture)

// login/register
userRouter.post('/users/login', userController.userLogin)
userRouter.post('/users/register', userController.userRegister)
userRouter.get('/users/email-verification', userController.emailVerification)

// payment
userRouter.get('/users/shopping-basket-payment/:id', userIsLoggedIn, checkLogin, userController.getShoppingBasketPaymentById)
userRouter.post('/users/create-payment', userIsLoggedIn, checkLogin, userController.pay)
userRouter.post('/payment', userController.paymentSuccess) 

// calculator
userRouter.post('/users/calculator-option', userIsLoggedIn, userController.createNewCalculatorOption) 
userRouter.put('/users/calculator', userIsLoggedIn, userController.updateCalculatorOption)
userRouter.delete('/users/calculator-option/:calculatorOptionId', userIsLoggedIn, userController.deleteCalculatorOption)

// rating
userRouter.get('/users/history-order', userIsLoggedIn, checkLogin, userController.getHistoryOrder)
userRouter.post('/users/rating', userIsLoggedIn, checkLogin, userController.addUserRating)

// like
userRouter.get("/users/favorite", userIsLoggedIn, checkLogin, userController.getUserFavorite)
userRouter.post("/users/favorite", userIsLoggedIn, userController.createNewUserFavorite)
userRouter.delete("/users/favorite", userIsLoggedIn, userController.deleteUserFavorite)

// share party link
userRouter.get("/users/share-link/:shoppingBasketId", userIsLoggedIn, userController.getShareLine)
userRouter.get("/users/sharing", userController.getSharePage)