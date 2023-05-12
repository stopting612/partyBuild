import { Bearer } from 'permit';
import jwtSimple from 'jwt-simple';
import express from 'express';
import jwt from './jwt';
import { userService, adminService, copartnerService } from '../main';
import { StatusCodes } from 'http-status-codes';


const permit = new Bearer({
    query: "access_token"
})

export async function userIsLoggedIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction) {
    try {
        const token = permit.check(req);
        if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission Denied" });
        }
        if (token === "null") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Haven't Login" });
        }
        const payload: {
            id: number
            email: string
            type: string
        } = jwtSimple.decode(token, jwt.jwtSecret);
        if (payload.type !== "user") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Account type is not user" });
        }
        const user = await userService.getUserEmailById(payload.id);
        if (user && user.id === payload.id && user.email === payload.email) {
            return next();
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission Denied" });
        }
    } catch (err) {
        console.error(err.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error" });
    }
}

export async function checkLogin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction) {
    try {
        const token = permit.check(req);
        if (token && token !== "null") {
            const payload: {
                id: number
                email: string
                type: string
            } = jwtSimple.decode(token, jwt.jwtSecret);
            if (payload.type === "user") {
                req["userId"] = payload.id
            }
            if (payload.type === "admin") {
                req["adminId"] = payload.id
            }
            if (payload.type === "copartner") {
                req["copartnerId"] = payload.id
            }
        }
        next()
    } catch (err) {
        console.error(err.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error" });
        return
    }
}

export async function adminIsLoggedIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction) {
    try {
        const token = permit.check(req);
        if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission Denied" });
        }
        const payload: {
            id: number
            email: string
            type: string
        } = jwtSimple.decode(token, jwt.jwtSecret);
        if (payload.type !== "admin") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Account type is not admin" });
        }
        const adminId = payload.id
        const admin = await adminService.getAdminEmailById(adminId);
        if (admin && admin.id === payload.id && admin.email === payload.email) {
            req['adminID'] = adminId
            return next();
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission Denied" });
        }
    } catch (err) {
        console.error(err.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error" });
    }
}

export async function copartnerIsLoggedIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction) {
    try {
        const token = permit.check(req);
        if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission Denied" });
        }
        const payload: {
            id: number
            email: string
            type: string
        } = jwtSimple.decode(token, jwt.jwtSecret);
        if (payload.type !== "copartner") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Account type is not copartner" });
        }
        const copartnerId = payload.id
        const copartner = await copartnerService.getCopartnerEmailById(copartnerId);
        if (copartner && copartner.id === payload.id && copartner.email === payload.email) {
            req['copartnerId'] = copartnerId
            return next();
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission Denied" });
        }
    } catch (err) {
        console.error(err.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error" });
    }
}