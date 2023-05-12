import { PartyRoomService } from "../service/PartyRoomService"
import { Request, Response } from "express"
import { StatusCodes } from 'http-status-codes';

export class PartyRoomController {
    constructor(private partyRoomService: PartyRoomService) { }

    getRecommendParty = async (req: Request, res: Response) => {
        try {
            // const id = 1
            // if (isNaN(id)) {
            //     res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect path type" })
            //     return
            // }
            const data = await this.partyRoomService.getRecommendParty()
            if (data.price === 'Infinity') {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Party room undefined" })
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

    getPartyRooms = async (req: Request, res: Response) => {
        try {
            const sortBy = req.query.sort as string
            let facilityFilter
            if (req.query.facility) {
                facilityFilter = JSON.parse(req.query.facility as string)
            }
            let districtsFilter
            if (req.query.districts) {
                districtsFilter = JSON.parse(req.query.districts as string)
            }
            const numberOfPeopleFilter = Number(req.query["people-quantity"])
            const date = req.query.date as string
            const startTime = req.query.start as string
            const endTime = req.query.end as string
            const pageNum = Number(req.query.page)
            const searchWord = req.query["search-word"] as string
            const userId = req["userId"]
            if (req.query.page && isNaN(pageNum) || pageNum < 1) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of pageNum" });
                return
            }
            if (sortBy && sortBy !== "price" && sortBy !== "avgRating") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of sortBy" });
                return
            }
            if (facilityFilter && facilityFilter.length > 0) {
                for (let facilityId of facilityFilter) {
                    if (isNaN(facilityId) || facilityId === "") {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of submit form" });
                        return
                    }
                }
            }
            if (districtsFilter && districtsFilter.length > 0) {
                for (let districtId of districtsFilter) {
                    if (isNaN(districtId) || districtId === "") {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of submit form" });
                        return
                    }
                }
            }
            if (numberOfPeopleFilter && isNaN(numberOfPeopleFilter)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect Type of submit form" });
                return
            }
            const data = await this.partyRoomService.getPartyRooms(
                facilityFilter,
                districtsFilter,
                date,
                startTime,
                endTime,
                sortBy,
                numberOfPeopleFilter,
                pageNum,
                searchWord,
                userId
            )
            if (data.partyRooms.length === 0) {
                res.json({ message: "PartyRooms is undefined", data });
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

    getPartyRoomsById = async (req: Request, res: Response) => {
        try {
            const partyRoomId = Number(req.params.id)
            const userId = req["userId"]
            if (isNaN(partyRoomId)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect path type" })
                return
            }
            const data = await this.partyRoomService.getPartyRoomById(partyRoomId, userId)
            if (!data) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Party room is undefined" })
                return
            }
            res.json({ message: "Success", data })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getPartyRoomFacilityType = async (req: Request, res: Response) => {
        try {
            const data = await this.partyRoomService.getPartyRoomFacilityType()
            res.json({ message: "Success", data })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getPartyRoomDistricts = async (req: Request, res: Response) => {
        try {
            const data = await this.partyRoomService.getPartyRoomDistricts()
            res.json({ message: "Success", data })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getPartyRoomRating = async (req: Request, res: Response) => {
        try {
            const partyRoomId = Number(req.params.partyRoomId)
            const pageNum = Number(req.params.pageNum)
            if (isNaN(partyRoomId) || isNaN(pageNum)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect submit type" })
                return
            }
            if (pageNum < 1) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect pageNum" })
                return
            }
            const data = await this.partyRoomService.getPartyRoomRating(partyRoomId, pageNum)
            if (data.ratings.length === 0) {
                res.json({ message: "Rating is undefined", data })
                return
            }
            res.json({ message: "Success", data })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }

    getPartyRoomPrice = async (req: Request, res: Response) => {
        try {
            const partyRoomId = Number(req.query.id)
            const date = req.query.date as string
            const startTime = req.query.start as string
            const endTime = req.query.end as string
            const numberOfPeople = Number(req.query.numberOfPeople)
            if (!partyRoomId || !date || !startTime || !endTime || !numberOfPeople) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect submit type" })
                return
            }
            if (isNaN(partyRoomId)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Incorrect id type" })
                return
            }
            const partyRoom = await this.partyRoomService.getPartyRoomById(partyRoomId)
            if (!partyRoom) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Party room is undefined" })
                return
            }
            const data = await this.partyRoomService.getPartyRoomPrice(partyRoomId, date, startTime, endTime, numberOfPeople)
            res.json({ message: "Success", data })
        } catch (err) {
            console.error(err.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
        }
    }
}
