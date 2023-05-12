import { RestaurantService } from "../service/RestaurantService"
import { Request, Response } from "express"
import { StatusCodes } from 'http-status-codes';

export class RestaurantController {
    constructor(private restaurantService: RestaurantService) { }

    getRecommendRestaurant = async (req: Request, res: Response) => {
        try {
            // const restaurantId = Number(req.params.id)
            // if (isNaN(restaurantId)) {
            //     res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of path" })
            //     return;
            // }
            const data = await this.restaurantService.getRecommendRestaurant()
            if (!data) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Menu undefined" })
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

    getRestaurantCuisineType = async (req: Request, res: Response) => {
        try {
            const data = await this.restaurantService.getRestaurantCuisineType()
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getRestaurantMenu = async (req: Request, res: Response) => {
        try {
            const sortBy = req.query.sort as string
            const numberOfPeople = Number(req.query["people-number"])
            const pageNum = Number(req.query.page)
            const userId = req["userId"]
            if (req.query.page && isNaN(pageNum) || pageNum < 1) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of pageNum" });
                return
            }
            const searchWord = req.query["search-word"] as string
            let cuisineFilter
            if (req.query.cuisine) {
                try {
                    cuisineFilter = JSON.parse(req.query.cuisine as string)
                } catch (err) {
                    console.error(err.message)
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of cuisine" });
                    return
                }
            }
            if (req.query.cuisine && !Array.isArray(cuisineFilter)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of cuisine" });
                return
            }
            if (sortBy !== undefined && sortBy !== "price" && sortBy !== "avgRating") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of sortBy" });
                return
            }
            if (req.query["people-number"] && isNaN(numberOfPeople)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect submit type of NumberOfPeople" })
                return
            }
            if (cuisineFilter && cuisineFilter.length > 0) {
                for (let cuisineId of cuisineFilter) {
                    if (isNaN(cuisineId) || cuisineId === "") {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of submit form" });
                        return
                    }
                }
            }
            const data = await this.restaurantService.getRestaurantMenu(sortBy, numberOfPeople, cuisineFilter, pageNum, searchWord, userId)
            if (data.menus.length === 0) {
                res.json({ message: "Menus is undefined", data });
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

    getMenuById = async (req: Request, res: Response) => {
        try {
            const menuId = Number(req.params.id)
            const userId = req["userId"]
            if (isNaN(menuId)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect path type" })
                return
            }
            const data = await this.restaurantService.getMenuById(menuId, userId)
            if (!data) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Menu is undefined" })
                return
            }
            res.json({ message: "Success", data })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getMenuRating = async (req: Request, res: Response) => {
        try {
            const menuId = Number(req.params.menuId)
            const pageNum = Number(req.params.pageNum)
            if (!menuId || !pageNum || isNaN(Number(menuId)) || isNaN(Number(pageNum))) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect submit type" })
                return
            }
            if (Number(pageNum) < 1) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect pageNum" })
                return
            }
            const data = await this.restaurantService.getMenuRating(menuId, pageNum)
            if (data.ratings.length === 0) {
                res.json({ message: "Rating is undefined", data })
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

    getMenuPrice = async (req: Request, res: Response) => {
        try {
            const menuId = Number(req.query.id)
            const quantity = Number(req.query.quantity)
            const shippingFeeId = Number(req.query["shipping_fee_id"])
            if (!menuId || quantity < 0 || !shippingFeeId) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect submit type" })
                return
            }
            if (isNaN(menuId) || isNaN(quantity) || isNaN(shippingFeeId)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect submit type" })
                return
            }
            const menu = await this.restaurantService.getMenuById(menuId)
            if (!menu) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Menu is undefined" })
                return
            }
            const data = await this.restaurantService.getMenuPrice(menuId, quantity, shippingFeeId)
            if (data.shippingFee === undefined) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "ShippingFee is undefined", data })
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