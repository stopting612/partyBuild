import express from 'express'
import {
    userController,
    upload
} from './main'
import { adminRouter } from './router/adminRouter'
import { alcoholRouter } from './router/alcoholRouter'
import { copartnerRouter } from './router/copartnerRouter'
import { hongKongAddressRouter } from './router/hongKongAddressRouter'
import { menuRouter } from './router/menuRouter'
import { partyRoomRouter } from './router/partyRoomRouter'
import { recommendRouter } from './router/recommendRouter'
import { shoppingBasketRouter } from './router/shoppingBasketRouter'
import { userRouter } from './router/userRouter'
import { checkLogin } from "./utils/guards"

export const router = express.Router()

router.use(recommendRouter)
router.use(userRouter)
router.use(copartnerRouter)
router.use(adminRouter)
router.use(hongKongAddressRouter)
router.use(partyRoomRouter)
router.use(menuRouter)
router.use(alcoholRouter)
router.use(shoppingBasketRouter)

// 分拆
router.put("/profile", upload.single("image"), checkLogin, userController.updateProfileDate)