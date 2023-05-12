import express from "express"
import { adminController, newPartyRoomController, partyRoomController, upload } from "../main"
import { adminIsLoggedIn, checkLogin } from "../utils/guards"

export const partyRoomRouter = express.Router()

// Get party room data
partyRoomRouter.get('/party-room/facility-type', partyRoomController.getPartyRoomFacilityType)
partyRoomRouter.get('/party-room', checkLogin, partyRoomController.getPartyRooms)
partyRoomRouter.get('/party-room/:id', checkLogin, partyRoomController.getPartyRoomsById)
partyRoomRouter.get('/party-room/price', partyRoomController.getPartyRoomPrice)
partyRoomRouter.get('/party-room/rating/:partyRoomId/:pageNum', partyRoomController.getPartyRoomRating)
partyRoomRouter.get('/new-party/party-room', newPartyRoomController.getUserChoicePartyRoom)

// Change party room data
partyRoomRouter.post('/admin/party-room', adminIsLoggedIn, upload.single("image"), adminController.registerPartyRoom)
partyRoomRouter.get('/admin/party-room', adminIsLoggedIn, adminController.getAllPartyRoom)
partyRoomRouter.get('/admin/party-room/:id', adminIsLoggedIn, adminController.adminGetPartyRoomById)
partyRoomRouter.put('/admin/party-room', adminIsLoggedIn, upload.single("image"), adminController.updatePartyRoom)

