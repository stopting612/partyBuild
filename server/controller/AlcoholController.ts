import { AlcoholService } from "../service/AlcoholService"
import { Request, Response } from "express"
import { StatusCodes } from 'http-status-codes';

export class AlcoholController {
    constructor(private alcoholService: AlcoholService) { }

    getRecommendAlcohol = async (req: Request, res: Response) => {
        try {
            // const id = Number(req.params.id)
            // if (isNaN(id)) {
            //     res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect path type" })
            //     return
            // }
            const data = await this.alcoholService.getRecommendAlcohol()
            if (!data.id) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Alcohol undefined" })
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

    getAlcoholTypes = async (req: Request, res: Response) => {
        try {
            const data = await this.alcoholService.getAlcoholTypes()
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getAlcohols = async (req: Request, res: Response) => {
        try {
            const sortBy = req.query.sort as string
            let typeFilter
            if (req.query.type) {
                try {
                    typeFilter = JSON.parse(req.query.type as string)
                } catch (err) {
                    console.error(err.message)
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of sort" });
                    return
                }
            }
            const pageNum = Number(req.query.page)
            const searchWord = req.query["search-word"] as string
            const userId = req["userId"]

            if (req.query.page && isNaN(pageNum) || pageNum < 1) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of pageNum" });
                return
            }
            if (req.query.type && !Array.isArray(typeFilter)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of sort" });
                return
            }
            if (sortBy && sortBy !== "price" && sortBy !== "avgRating") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of sort" });
                return
            }
            if (typeFilter && typeFilter.length > 0) {
                for (let typeId of typeFilter) {
                    if (isNaN(typeId) || typeId === "") {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of submit form" });
                        return
                    }
                }
            }
            const data = await this.alcoholService.getAlcohols(sortBy, typeFilter, pageNum, searchWord, userId)
            if (data.alcohols.length === 0) {
                res.json({ message: "Alcohols is undefined", data });
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

    getAlcoholById = async (req: Request, res: Response) => {
        try {
            const alcoholId = Number(req.params.id)
            const userId = req["userId"]
            if (isNaN(alcoholId)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect path type" })
                return
            }
            const data = await this.alcoholService.getAlcoholById(alcoholId, userId)
            if (!data) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Alcohol is undefined" });
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

    getAlcoholRating = async (req: Request, res: Response) => {
        try {
            const alcoholId = Number(req.params.alcoholId)
            const pageNum = Number(req.params.pageNum)
            if (!alcoholId || !pageNum) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of submit form" });
                return
            }
            if (isNaN(alcoholId)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect alcoholId type" })
                return
            }
            if (isNaN(pageNum)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect pageNum type" })
                return
            }
            const wine = await this.alcoholService.getAlcoholById(alcoholId)
            if (!wine) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Alcohol is undefined" });
                return
            }
            const data = await this.alcoholService.getAlcoholRating(alcoholId, pageNum)
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

    getAlcoholPrice = async (req: Request, res: Response) => {
        try {
            const alcoholId = Number(req.query.id)
            const quantity = Number(req.query.quantity)
            if (isNaN(quantity) || quantity < 0) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect quantity type" })
                return
            }
            const wine = await this.alcoholService.getAlcoholById(alcoholId)
            if (!wine) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Alcohol is undefined" });
                return
            }
            const data = await this.alcoholService.getAlcoholPrice(alcoholId, quantity)
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