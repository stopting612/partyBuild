import { AdminService } from "../service/AdminService"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { checkPassword } from "../utils/hash"
import { Bearer } from 'permit';
import jwtSimple from 'jwt-simple';
import jwt from '../utils/jwt';

const permit = new Bearer({
    query: "access_token"
})

export class AdminController {
    constructor(private adminService: AdminService) { }

    adminLogin = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect email or password" });
                return;
            }
            if (typeof email !== "string" || typeof password !== "string") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of submit form" });
                return
            }
            const admin = await this.adminService.login(email)
            if (!admin) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect email or password" });
                return
            }
            const pass = await checkPassword(password, admin.password)
            if (!pass) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect email or password" })
                return;
            }
            const payload = {
                id: admin.id,
                email: admin.email,
                type: "admin"
            };
            const token = jwtSimple.encode(payload, jwt.jwtSecret);
            res.json({
                message: "Success",
                token
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getAdminDate = async (req: Request, res: Response) => {
        try {
            const adminId = req["adminId"]
            const data = await this.adminService.getAdminDate(adminId)
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getNewCopartner = async (req: Request, res: Response) => {
        try {
            const pageNum = Number(req.query.page)
            if (isNaN(pageNum)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect submit type" })
                return
            }
            if (pageNum < 1) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect pageNum" })
                return
            }
            const data = await this.adminService.getNewCopartner(pageNum)
            if (data.newCopartners.length === 0) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Rating is undefined", data })
                return
            }
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    updateNewCopartnerStates = async (req: Request, res: Response) => {
        try {
            const id = Number(req.body.id)
            const state = req.body.state
            if (isNaN(id)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of id" })
                return
            }
            if (state !== "未處理" && state !== "處理中" && state !== "已完成") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of state" })
                return
            }
            await this.adminService.updateNewCopartnerStates(id, state)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    registerPartyRoom = async (req: Request, res: Response) => {
        try {
            let {
                userEmail,
                storeName,
                address,
                area,
                districtId,
                maxPeople,
                minPeople,
                introduction,
                facilities,
                facilitiesDetail,
                importantMatter,
                contactPerson,
                contactNumber,
                whatsapp,
                email,
            }: {
                userEmail: string
                storeName: string,
                address: string,
                districtId: number,
                area: number,
                maxPeople: number,
                minPeople: number,
                introduction: string,
                facilities: any,
                facilitiesDetail: string,
                importantMatter: string,
                contactPerson: string,
                contactNumber: number,
                whatsapp: number,
                email: string,
            } = req.body
            const image = `http://cdn.partybuildhk.com/${(req.file as any)?.key}`
            const token = permit.check(req);
            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission Denied" });
                return
            }
            if (!userEmail || !storeName || !address || !districtId || !maxPeople || !minPeople || !introduction || !facilities || !facilitiesDetail || !importantMatter || !contactPerson || !contactNumber || !whatsapp || !email) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of submit form" })
                return
            }
            if (isNaN(districtId)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of districtId" })
                return
            }
            if (isNaN(area)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of area" })
                return
            }
            if (isNaN(maxPeople)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of maxPeople" })
                return
            }
            if (isNaN(minPeople)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of minPeople" })
                return
            }
            if (isNaN(contactNumber)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of contactNumber" })
                return
            }
            if (isNaN(whatsapp)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of contactNumber" })
                return
            }

            facilities = JSON.parse(facilities as string)

            const hasUser = await this.adminService.checkHasCopartnerByUserEmail(userEmail)
            if (!hasUser) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Copartner is not Exist" })
                return
            }

            await this.adminService.registerPartyRoom(
                userEmail,
                storeName,
                address,
                districtId,
                area,
                maxPeople,
                minPeople,
                introduction,
                image,
                facilities,
                facilitiesDetail,
                importantMatter,
                contactPerson,
                contactNumber,
                whatsapp,
                email
            )
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    updatePartyRoom = async (req: Request, res: Response) => {
        try {
            let {
                id,
                storeName,
                address,
                area,
                districtId,
                maxPeople,
                minPeople,
                introduction,
                facilities,
                facilitiesDetail,
                importantMatter,
                contactPerson,
                contactNumber,
                whatsapp,
                email,
            }: {
                id: number,
                storeName: string,
                address: string,
                districtId: number,
                area: number,
                maxPeople: number,
                minPeople: number,
                introduction: string,
                facilities: any,
                facilitiesDetail: string,
                importantMatter: string,
                contactPerson: string,
                contactNumber: number,
                whatsapp: number,
                email: string,
            } = req.body
            const image = (req.file as any)?.key
            const token = permit.check(req);
            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission Denied" });
                return
            }
            if (!id || !storeName || !address || !districtId || !area || !maxPeople || !minPeople || !introduction || !facilities || !facilitiesDetail || !importantMatter || !contactPerson || !contactNumber || !whatsapp || !email) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of submit form" })
                return
            }
            if (isNaN(districtId)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of districtId" })
                return
            }
            if (isNaN(area)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of area" })
                return
            }
            if (isNaN(maxPeople)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of maxPeople" })
                return
            }
            if (isNaN(minPeople)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of minPeople" })
                return
            }
            if (isNaN(contactNumber)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of contactNumber" })
                return
            }
            if (isNaN(whatsapp)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of contactNumber" })
                return
            }

            facilities = JSON.parse(facilities as string)
            await this.adminService.updatePartyRoom(
                id,
                storeName,
                address,
                districtId,
                area,
                maxPeople,
                minPeople,
                introduction,
                image,
                facilities,
                facilitiesDetail,
                importantMatter,
                contactPerson,
                contactNumber,
                whatsapp,
                email
            )
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getAllPartyRoom = async (req: Request, res: Response) => {
        try {
            const data = await this.adminService.getAllPartyRoom()
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    adminGetPartyRoomById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id)
            if (isNaN(id)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of id" })
                return
            }
            const data = await this.adminService.adminGetPartyRoomById(id)
            if (!data) {
                res.json({ message: "PartyRoom is undefined", data })
                return
            }
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }
}