import { UserService } from "../service/UserService"
import { Request, Response } from "express"
import { checkPassword } from "../utils/hash"
import { Bearer } from 'permit';
import jwtSimple from 'jwt-simple';
import jwt from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';
import { partyRoomService, alcoholService, restaurantService } from "../main"

const permit = new Bearer({
    query: "access_token"
})

export class UserController {
    constructor(private userService: UserService) { }

    userLogin = async (req: Request, res: Response) => {
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
            const user = await this.userService.login(email)
            if (!user) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect email or password" });
                return
            }
            const pass = await checkPassword(password, user.password)
            if (!pass) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect email or password" })
                return;
            }
            const payload = {
                id: user.id,
                email: user.email,
                type: "user"
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

    userRegister = async (req: Request, res: Response) => {
        try {
            const { name, password, email } = req.body
            if (!name || !password || !email) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect name or password" });
                return
            }
            if (typeof name !== "string" || typeof password !== "string" || typeof email !== "string") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of submit form" });
                return
            }
            const available = await this.userService.checkEmailIsAvailable(email)
            if (!available) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Email has been use" })
                return
            }
            await this.userService.userRegister(name, password, email)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    emailVerification = async (req: Request, res: Response) => {
        try {
            const token = req.query.token as string
            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of token" });
                return
            }
            const user = await this.userService.emailVerification(token)
            if (!user) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of token" });
                return
            }
            const newUser = await this.userService.createUser(user.username, user.email, user.password)
            const payload = {
                id: newUser.id,
                email: newUser.email,
                type: "user"
            };
            const newToken = jwtSimple.encode(payload, jwt.jwtSecret);
            res.json({ message: "Success", token: newToken })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getUserNameAndPicture = async (req: Request, res: Response) => {
        try {
            const token = permit.check(req);
            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Token is undefined" });
                return
            }
            const payload: {
                id: number;
                name: string;
                type: string;
            } = jwtSimple.decode(token, jwt.jwtSecret);
            if (typeof payload.id !== "number") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of token" });
                return
            }
            if (!payload.type) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Type of token is undefined" });
                return
            } if (payload.type && payload.type !== "user" && payload.type !== "admin" && payload.type !== "copartner") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Type of token incorrect" });
                return
            }
            const data = await this.userService.getUserNameAndPicture(payload.id, payload.type);
            if (!data) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Name and Picture is undefined" });
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

    addPartyRoomOrder = async (req: Request, res: Response) => {
        try {
            const { partyRoomId, shoppingBagId, numberOfPeople, date, startTime, endTime } = req.body
            if (!partyRoomId && !shoppingBagId && !numberOfPeople && !date && !startTime && !endTime) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect submit format" });
                return
            }
            const havePartyRoom = (await this.userService.getUserShoppingBasketById(shoppingBagId))?.partyRoomOrders.id !== 0
            if (havePartyRoom) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Other PartyRoom is in this shopping basket" });
                return
            }
            await this.userService.addPartyRoomOrder(partyRoomId, shoppingBagId, numberOfPeople, date, startTime, endTime)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    addAlcoholOrder = async (req: Request, res: Response) => {
        try {
            const { alcoholId, shoppingBagId, quantity } = req.body
            if (!alcoholId && !shoppingBagId && !quantity) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect submit format" });
                return
            }
            await this.userService.addAlcoholOrder(alcoholId, shoppingBagId, quantity)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    addFoodOrder = async (req: Request, res: Response) => {
        try {
            const { menuId, shoppingBagId, shippingFeeId, quantity } = req.body
            if (!menuId && !shoppingBagId && !shippingFeeId && !quantity) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect submit format" });
                return
            }
            await this.userService.addFoodOrder(menuId, shoppingBagId, shippingFeeId, quantity)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    createNewShoppingBasket = async (req: Request, res: Response) => {
        try {
            const { name, partyRoom, food, foodPerson, alcohol, alcoholPerson } = req.body
            const token = permit.check(req);
            const payload: {
                id: number
                name: string
                type: string
            } = jwtSimple.decode(token, jwt.jwtSecret);
            const userId = payload.id
            if (!name) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "New Shopping Basket Name is undefined" });
                return
            }
            const item = (partyRoom || food || alcohol)
            if (!item) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Order item is undefined" });
                return
            }
            const partyRoomAllData = (partyRoom?.id && partyRoom?.numberOfPeople && partyRoom?.date && partyRoom?.startTime && partyRoom?.endTime)
            if (partyRoom && partyRoom?.id && !partyRoomAllData) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of partyRoom" });
                return
            }
            if (partyRoom && partyRoom?.id && (isNaN(partyRoom?.id) || isNaN(partyRoom?.numberOfPeople))) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of partyRoom" });
                return
            }
            if (alcohol && !Array.isArray(alcohol)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of alcohol" });
                return
            }
            if (food && !Array.isArray(food)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of food" });
                return
            }
            if (partyRoom && partyRoom?.id) {
                const room = await partyRoomService.getPartyRoomById(partyRoom?.id)
                if (!room) {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "PartyRoom is undefined" });
                    return
                }
            }
            if (food) {
                for (let menu of food) {
                    const food = await restaurantService.getMenuById(menu.id)
                    if (!food) {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Menu undefined" })
                        return
                    }
                }
            }
            if (alcohol) {
                for (let wine of alcohol) {
                    const theAlcohol = await alcoholService.getAlcoholById(wine.id)
                    if (!theAlcohol) {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Alcohol is undefined" });
                        return
                    }
                }
            }
            if (!partyRoom?.id && food) {
                for (const menu of food) {
                    if (!menu.shippingFeeId) {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "ShippingFeeId is undefined" });
                        return
                    }
                }
            }
            const data = await this.userService.createNewShoppingBasket(name, userId, partyRoom, food, foodPerson, alcohol, alcoholPerson)
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getUserShoppingBasket = async (req: Request, res: Response) => {
        try {
            const pageNum = Number(req.query.page)
            if (isNaN(pageNum)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of page" });
                return
            }
            if (pageNum < 1) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect pageNum" })
                return
            }
            const token = permit.check(req);
            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission Denied" });
                return
            }
            const payload: {
                id: number
                email: string
                type: string
            } = jwtSimple.decode(token, jwt.jwtSecret);
            const userId = payload.id
            const data = await this.userService.getUserShoppingBasket(pageNum, userId)
            if (data.shoppingBaskets?.length === 0) {
                res.json({ message: "ShoppingBaskets is undefined", data });
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

    getUserShoppingBasketHistory = async (req: Request, res: Response) => {
        try {
            const pageNum = Number(req.query.page)
            if (isNaN(pageNum)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of page" });
                return
            }
            if (pageNum < 1) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect pageNum" })
                return
            }
            const token = permit.check(req);
            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission Denied" });
                return
            }
            const payload: {
                id: number
                email: string
                type: string
            } = jwtSimple.decode(token, jwt.jwtSecret);
            const userId = payload.id
            const data = await this.userService.getUserShoppingBasketHistory(pageNum, userId)
            if (data.shoppingBaskets?.length === 0) {
                res.json({ message: "ShoppingBaskets is undefined", data });
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

    getUserShoppingBasketById = async (req: Request, res: Response) => {
        try {
            const userId = req["userId"]
            const id = Number(req.params.id)
            const hasShoppingBasket = await this.userService.checkHasShoppingBasket(id)
            if (!hasShoppingBasket) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Shopping bag is undefined" })
                return
            }
            const isOwner = await this.userService.checkIsShoppingBasketOwner(id, userId)
            if (!isOwner) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Is not Owner" })
                return
            }
            if (isNaN(id)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect path type" })
                return
            }
            const data = await this.userService.getUserShoppingBasketById(id)
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    deleteShoppingBasketById = async (req: Request, res: Response) => {
        try {
            const shoppingBasketId = Number(req.params.shoppingBasketId)
            await this.userService.deleteShoppingBasketById(shoppingBasketId)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    deleteOrder = async (req: Request, res: Response) => {
        try {
            const { orderType, orderId } = req.body
            if (orderType !== "food" && orderType !== "alcohol" && orderType !== "partyRoom") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect orderType type" });
                return
            }
            if (isNaN(orderId)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect orderId type" });
                return
            }
            await this.userService.deleteOrder(orderType, orderId)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    updatePartyDate = async (req: Request, res: Response) => {
        try {
            const { date, shoppingBasketId } = req.body
            if (!date) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "date undefined" });
                return
            }
            if (!shoppingBasketId) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "shoppingBasketId undefined" });
                return
            }
            await this.userService.updatePartyDate(date, shoppingBasketId)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    updatePartyStartTime = async (req: Request, res: Response) => {
        try {
            const { startTime, shoppingBasketId } = req.body
            if (!startTime) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "startTime undefined" });
                return
            }
            if (!shoppingBasketId) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "shoppingBasketId undefined" });
                return
            }
            const hasShoppingBasket = await this.userService.checkHasShoppingBasket(shoppingBasketId)
            if (!hasShoppingBasket) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Shopping Basket undefined" });
                return
            }
            const isPay = await this.userService.checkShoppingBasketIsPay(shoppingBasketId)
            if (isPay) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Shopping Basket is Pay" });
                return
            }
            await this.userService.updatePartyStartTime(startTime, shoppingBasketId)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    updatePartyEndTime = async (req: Request, res: Response) => {
        try {
            const { endTime, shoppingBasketId } = req.body
            if (!endTime) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "endTime undefined" });
                return
            }
            if (!shoppingBasketId) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "shoppingBasketId undefined" });
                return
            }
            const isPay = await this.userService.checkShoppingBasketIsPay(shoppingBasketId)
            if (isPay) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Shopping Basket is Pay" });
                return
            }
            await this.userService.updatePartyEndTime(endTime, shoppingBasketId)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getShoppingBasketPaymentById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id)
            const userId = req["userId"]
            if (isNaN(id)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of id" });
                return
            }
            const hasShoppingBasket = await this.userService.checkHasShoppingBasket(id)
            if (!hasShoppingBasket) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Shopping Basket undefined" });
                return
            }
            const isOwner = await this.userService.checkIsShoppingBasketOwner(id, userId)
            if (!isOwner) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Is not Owner" })
                return
            }
            const data = await this.userService.getShoppingBasketPaymentById(id)
            if (!data) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect ShoppingBasket id" });
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

    pay = async (req: Request, res: Response) => {
        try {
            const { contactName, phoneNumber, shoppingBasketId, date, startTime, address, specialRequirement } = req.body
            const userId = req["userId"]
            if (!contactName || !phoneNumber || !shoppingBasketId || !date || !startTime || !address) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect submit type" });
                return
            }
            const hasShoppingBasket = await this.userService.checkHasShoppingBasket(shoppingBasketId)
            if (!hasShoppingBasket) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Shopping Basket undefined" });
                return
            }
            const isOwner = await this.userService.checkIsShoppingBasketOwner(shoppingBasketId, userId)
            if (!isOwner) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Is not Owner" })
                return
            }
            const isPay = await this.userService.checkShoppingBasketIsPay(shoppingBasketId)
            if (isPay) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Shopping Basket Is Pay" });
                return
            }
            const hasOpen = await this.userService.checkPartyRoomHasOpen(shoppingBasketId)
            if (!hasOpen) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Party room is not opening" });
                return
            }
            const hasBooking = await this.userService.checkHasBooking(shoppingBasketId)
            if (hasBooking) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Time has been booking" });
                return
            }
            const data = await this.userService.pay(contactName, phoneNumber, shoppingBasketId, date, startTime, address, specialRequirement, userId)
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    paymentSuccess = async (req: Request, res: Response) => {
        try {
            const token = req.body.data.object.id
            const hasToken = await this.userService.checkHasPaymentToken(token)
            if (!hasToken) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Token" });
                return
            }
            await this.userService.paymentSuccess(token)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    createNewCalculatorOption = async (req: Request, res: Response) => {
        try {
            const { shoppingBasketId, name, price } = req.body
            const data = await this.userService.createNewCalculatorOption(shoppingBasketId, name, price)
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    updateCalculatorOption = async (req: Request, res: Response) => {
        try {
            const { shoppingBasketId, calculatorData } = req.body
            if (!calculatorData) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "CalculatorData is undefined" });
                return
            }
            if (!shoppingBasketId) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "ShoppingBasketId is undefined" });
                return
            }
            await this.userService.updateCalculatorOption(shoppingBasketId, calculatorData)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    deleteCalculatorOption = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.calculatorOptionId)
            const calculatorOption = await this.userService.getCalculatorOptionById(id)
            if (!calculatorOption) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "CalculatorOption is undefined" });
                return
            }
            await this.userService.deleteCalculatorOption(id)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getHistoryOrder = async (req: Request, res: Response) => {
        try {
            const shoppingBasketId = Number(req.query["shopping-basket-id"])
            const userId = req["userId"]
            if (!shoppingBasketId) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "ShoppingBasketId is undefined" });
                return
            }
            const data = await this.userService.getHistoryOrder(shoppingBasketId, userId)
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    addUserRating = async (req: Request, res: Response) => {
        try {
            const { partyRoom, alcohols, foods } = req.body
            const userId = req["userId"]
            await this.userService.addUserRating(partyRoom, alcohols, foods, userId)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getUserFavorite = async (req: Request, res: Response) => {
        try {
            const userId = req["userId"]
            const data = await this.userService.getUserFavorite(userId)
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    createNewUserFavorite = async (req: Request, res: Response) => {
        try {
            const { type, id } = req.body
            if (!type || !id) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of submit form" });
                return
            }
            if (type !== "food" && type !== "alcohol" && type !== "partyRoom") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of type" });
                return
            }
            if (type === "food") {
                const menu = await restaurantService.getMenuById(id)
                if (!menu) {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Menu is undefined" });
                    return
                }
            }
            if (type === "alcohol") {
                const alcohol = await alcoholService.getAlcoholById(id)
                if (!alcohol) {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Alcohol is undefined" });
                    return
                }
            }
            if (type === "partyRoom") {
                const partyRoom = await partyRoomService.getPartyRoomById(id)
                if (!partyRoom) {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "PartyRoom is undefined" });
                    return
                }
            }
            if (isNaN(id)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of id" });
                return
            }
            const token = permit.check(req);
            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission Denied" });
                return
            }
            const payload: {
                id: number
                email: string
                type: string
            } = jwtSimple.decode(token, jwt.jwtSecret);
            const userId = payload.id
            await this.userService.createNewUserFavorite(type, id, userId)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    deleteUserFavorite = async (req: Request, res: Response) => {
        try {
            const { type, id } = req.body
            if (!type || !id) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of submit form" });
                return
            }
            if (type !== "food" && type !== "alcohol" && type !== "partyRoom") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of type" });
                return
            }
            if (type === "food") {
                const menu = await restaurantService.getMenuById(id)
                if (!menu) {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Menu is undefined" });
                    return
                }
            }
            if (type === "alcohol") {
                const alcohol = await alcoholService.getAlcoholById(id)
                if (!alcohol) {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Alcohol is undefined" });
                    return
                }
            }
            if (type === "partyRoom") {
                const partyRoom = await partyRoomService.getPartyRoomById(id)
                if (!partyRoom) {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "PartyRoom is undefined" });
                    return
                }
            }
            if (isNaN(id)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of id" });
                return
            }
            const token = permit.check(req);
            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Permission Denied" });
                return
            }
            const payload: {
                id: number
                email: string
                type: string
            } = jwtSimple.decode(token, jwt.jwtSecret);
            const userId = payload.id
            await this.userService.deleteUserFavorite(type, id, userId)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getShareLine = async (req: Request, res: Response) => {
        try {
            const shoppingBasketId = Number(req.params.shoppingBasketId)
            const data = await this.userService.getShareLine(shoppingBasketId)
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getSharePage = async (req: Request, res: Response) => {
        try {
            const token = req.query.token as string
            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect type of path" });
                return
            }
            const data = await this.userService.getSharePage(token)
            if (!data) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Shopping bag is undefined" });
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

    getUserDate = async (req: Request, res: Response) => {
        try {
            const userId = req["userId"]
            const data = await this.userService.getUserDate(userId)
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    updateProfileDate = async (req: Request, res: Response) => {
        try {
            const { name, password } = req.body
            const userId = req["userId"]
            const adminId = req["adminId"]
            const copartnerId = req["copartnerId"]
            if (!userId && !adminId && !copartnerId) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Login token undefined" });
                return
            }
            if (!name) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "name undefined" });
                return
            }
            if (!password) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "password undefined" });
                return
            }
            const image = (req.file as any)?.key
            await this.userService.updateProfileDate(userId, adminId, copartnerId, name, password, image)
            res.json({ message: "Success" })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }
}