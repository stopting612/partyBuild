import express from "express"
import { adminController, copartnerController, upload } from "../main"
import { adminIsLoggedIn, checkLogin, copartnerIsLoggedIn } from "../utils/guards"

export const copartnerRouter = express.Router()

// Create and Update Copartner
copartnerRouter.get('/admin/new-copartner', adminIsLoggedIn, adminController.getNewCopartner)
copartnerRouter.put('/admin/new-copartner', adminIsLoggedIn, adminController.updateNewCopartnerStates)
copartnerRouter.post('/copartner', adminIsLoggedIn, copartnerController.createCopartner)

// Profile
copartnerRouter.get("/copartner/profile", copartnerIsLoggedIn, checkLogin, copartnerController.getCopartnerDate)

// Login
copartnerRouter.post('/copartner/login', copartnerController.copartnerLogin)

// Get Order
copartnerRouter.get('/copartner/stores', copartnerIsLoggedIn, copartnerController.getCorpartnerStores)
copartnerRouter.get('/copartner/today-orders', copartnerIsLoggedIn, copartnerController.getCorpartnerStoresTodayOrder)
copartnerRouter.get('/copartner/orders', copartnerIsLoggedIn, copartnerController.getCorpartnerStoresOrder)
copartnerRouter.get('/copartner/order/:id', copartnerIsLoggedIn, copartnerController.getCopartnerOrderById)

// Confirm Order
copartnerRouter.get('/copartner/detail-orders/:page', copartnerIsLoggedIn, copartnerController.getCopartnerStoreDetailOrder)
copartnerRouter.put('/copartner/order-states-confirm/:id', copartnerController.confirmCopartnerOrderStates)
copartnerRouter.put('/copartner/order-states-cancel/:id', copartnerController.cancelCopartnerOrderStates)

// Change Party Room Open Time
copartnerRouter.get('/copartner/party-rooms', copartnerIsLoggedIn, copartnerController.getCorpartnerPartyRoom)
copartnerRouter.get('/copartner/party-room-open-time/:id', copartnerIsLoggedIn, copartnerController.getCorpartnerPartyRoomOpenTime)
copartnerRouter.post('/copartner/party-room-open-time', copartnerIsLoggedIn, copartnerController.postPartyRoomOpenTime)
copartnerRouter.put('/copartner/party-room-open-time', copartnerIsLoggedIn, copartnerController.updatePartyRoomOpenTime)
copartnerRouter.delete('/copartner/party-room-open-time/:id', copartnerController.deletePartyRoomOpenTimeById)

// Update Party Room Data
copartnerRouter.get('/copartner/store-data/:id', copartnerIsLoggedIn, copartnerController.getStoreDataById)
copartnerRouter.put('/copartner/store-data', copartnerIsLoggedIn, upload.single("image"), copartnerController.updateStoreData)

// Add New Copartner Contact
copartnerRouter.post('/copartner/new-copartners', copartnerController.addNewCopartners)
