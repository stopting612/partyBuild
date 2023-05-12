import express from "express"
import { adminController } from "../main"
import { adminIsLoggedIn, checkLogin } from "../utils/guards"

export const adminRouter = express.Router()

// Login
adminRouter.post('/admin/login', adminController.adminLogin)

// Profile
adminRouter.get("/admin/profile", adminIsLoggedIn, checkLogin, adminController.getAdminDate)
