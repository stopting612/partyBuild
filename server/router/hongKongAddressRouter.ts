import express from "express"
import { partyRoomController } from "../main"

export const hongKongAddressRouter = express.Router()

hongKongAddressRouter.get('/party-room/districts', partyRoomController.getPartyRoomDistricts)