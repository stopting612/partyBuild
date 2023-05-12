import { NewPartyRoomService } from "../service/NewPartyRoomService"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export class NewPartyRoomController {
    constructor(private newPartyRoomService: NewPartyRoomService) { }

    getHomePageRecommend = async (req: Request, res: Response) => {
        try {
            const data = await this.newPartyRoomService.getHomePageRecommend()
            res.json({
                message: "Success",
                data
            })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getUserChoicePartyRoom = async (req: Request, res: Response) => {
        try {
            const numberOfPeopleFilter = Number(req.query["people-number"])
            const date = req.query.date as string
            const startTime = req.query.start as string
            const endTime = req.query.end as string
            let facilityFilter
            if (req.query.facility) {
                try {
                    facilityFilter = JSON.parse(req.query.facility as string)
                } catch (err) {
                    console.error(err.message)
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of facility" })
                    return
                }
            }
            if (req.query.facility && !Array.isArray(facilityFilter)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of facility" })
                return
            }
            let districtsFilter
            if (req.query.districts) {
                try {
                    districtsFilter = JSON.parse(req.query.districts as string)
                } catch (err) {
                    console.error(err.message)
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of districts" })
                    return
                }
            }
            if (req.query.districts && !Array.isArray(districtsFilter)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of districts" })
                return
            }
            if (facilityFilter && facilityFilter.length > 0) {
                for (let facilityId of facilityFilter) {
                    if (isNaN(facilityId)) {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of submit form" });
                        return
                    }
                }
            }
            if (districtsFilter && districtsFilter.length > 0) {
                for (let districtId of districtsFilter) {
                    if (isNaN(districtId)) {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of submit form" });
                        return
                    }
                }
            }
            if (numberOfPeopleFilter && isNaN(numberOfPeopleFilter)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of submit form" });
                return
            }
            const data = await this.newPartyRoomService.getUserChoicePartyRoom(numberOfPeopleFilter, date, startTime, endTime, facilityFilter, districtsFilter)
            if (data.partyRooms.length === 0) {
                res.json({ message: "PartyRoom is undefined", data });
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

    getUserChoiceMenus = async (req: Request, res: Response) => {
        try {
            const numberOfPeople = Number(req.query["people-number"])
            let cuisineFilter
            if (req.query.cuisine) {
                try {
                    cuisineFilter = JSON.parse(req.query.cuisine as string)
                } catch (err) {
                    console.error(err.message)
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Incorrect submit type of cuisine" })
                }
            }
            if (numberOfPeople && isNaN(numberOfPeople)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect submit type of NumberOfPeople" })
                return
            }
            if (cuisineFilter && !Array.isArray(cuisineFilter)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of cuisineFilter" });
                return
            }
            if (cuisineFilter && cuisineFilter.length > 0) {
                for (let cuisineId of cuisineFilter) {
                    if (isNaN(cuisineId) || cuisineId === "") {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of cuisineFilter" });
                        return
                    }
                }
            }
            const data = await this.newPartyRoomService.getUserChoiceMenus(numberOfPeople, cuisineFilter)
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

    getUserChoiceAlcohols = async (req: Request, res: Response) => {
        try {
            let typeFilter
            if (req.query.type) {
                typeFilter = JSON.parse(req.query.type as string)
            }
            if (typeFilter && typeFilter.length > 0) {
                for (let typeId of typeFilter) {
                    if (isNaN(typeId) || typeId === "") {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of submit form" });
                        return
                    }
                }
            }
            const data = await this.newPartyRoomService.getUserChoiceAlcohols(typeFilter)
            if (!data) {
                res.json({ message: "Alcohol is undefined", data });
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