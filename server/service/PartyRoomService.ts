import { Knex } from "knex"

export class PartyRoomService {
    constructor(private knex: Knex) { }

    async getRecommendParty() {
        const partyRoom: {
            id: number
            image: string
            name: string
            introduction: string
            numberOfRating: string
            avgRating: string
            price: string
            district: string
        } = await this.knex("party_rooms")
            .select(
                "party_rooms.id",
                "party_room_images.image",
                "party_rooms.name",
                "party_rooms.introduction",
                "hong_kong_districts.district"
            )
            .leftJoin("party_room_images", "party_rooms.id", "party_room_images.party_room_id")
            .leftJoin("hong_kong_districts", "party_rooms.district_id", "hong_kong_districts.id")
            .first()

        const partyRoomPrice: {
            weekday_price: string,
            weekend_price: string
        }[] = await this.knex("party_rooms")
            .select("party_room_prices.weekday_price", "party_room_prices.weekend_price")
            .where("party_rooms.id", partyRoom.id)
            .leftJoin("party_room_prices", "party_rooms.id", "party_room_prices.party_room_id")

        const price = partyRoomPrice.reduce((accumulator, currentValue) => {
            return Math.min(accumulator, Number(currentValue.weekday_price), Number(currentValue.weekend_price))
        }, Infinity)

        const partyRoomRating = await this.knex<{
            avg: string
        }>("party_room_ratings")
            .avg("rating")
            .where("party_room_id", partyRoom.id)
            .first()
        let avg = ""
        if (partyRoomRating) {
            avg = Number(partyRoomRating["avg"]).toFixed(2).toString()
        } else avg = "0"

        const partyRoomNumberOfRating = await this.knex<{
            numberOfRating: string
        }>("party_room_ratings")
            .count("rating as numberOfRating")
            .where("party_room_id", partyRoom.id)
            .first()
        let numberOfRating = ""
        if (partyRoomNumberOfRating) {
            numberOfRating = partyRoomNumberOfRating["numberOfRating"]
        } else numberOfRating = "0"

        const data = {
            ...partyRoom,
            price: price.toString(),
            avgRating: avg,
            numberOfRating
        }

        return data
    }

    async getPartyRooms(
        facilityFilter: number[],
        districtsFilter: number[],
        date: string,
        startTime: string,
        endTime: string,
        sortBy: string | null,
        numberOfPeopleFilter: number,
        pageNum: number,
        searchWord: string,
        userId: number,
    ) {
        let partyRooms: {
            id: number
            image: string
            name: string
            district: string
        }[]
        if (!searchWord) {
            partyRooms = await this.knex("party_rooms")
                .select(
                    "party_room_images.image",
                    "party_rooms.id",
                    "party_rooms.name",
                    "hong_kong_districts.district"
                )
                .leftJoin("party_room_images", "party_rooms.id", "party_room_images.party_room_id")
                .leftJoin("hong_kong_districts", "party_rooms.district_id", "hong_kong_districts.id")
        } else {
            partyRooms = await this.knex("party_rooms")
                .select(
                    "party_room_images.image",
                    "party_rooms.id",
                    "party_rooms.name",
                    "hong_kong_districts.district"
                )
                .leftJoin("party_room_images", "party_rooms.id", "party_room_images.party_room_id")
                .leftJoin("hong_kong_districts", "party_rooms.district_id", "hong_kong_districts.id")
                .where("name", "ilike", `%${searchWord}%`)
        }

        for (let partyRoom of partyRooms) {
            const partyRoomPrice: {
                weekday_price: string,
                weekend_price: string
            }[] = await this.knex("party_rooms")
                .select("party_room_prices.weekday_price", "party_room_prices.weekend_price")
                .where("party_rooms.id", partyRoom.id)
                .leftJoin("party_room_prices", "party_rooms.id", "party_room_prices.party_room_id")

            const price = partyRoomPrice.reduce((accumulator, currentValue) => {
                return Math.min(accumulator, Number(currentValue.weekday_price), Number(currentValue.weekend_price))
            }, Infinity)

            partyRoom["price"] = price.toString()

            const partyRoomRating = await this.knex<{
                avg: string
            }>("party_room_ratings")
                .avg("rating")
                .where("party_room_id", partyRoom.id)
                .first()
            let avg = ""
            if (partyRoomRating) {
                avg = Number(partyRoomRating["avg"]).toFixed(2).toString()
            } else avg = "0"

            partyRoom["avgRating"] = avg

            const partyRoomNumberOfRating = await this.knex<{
                numberOfRating: string
            }>("party_room_ratings")
                .count("rating as numberOfRating")
                .where("party_room_id", partyRoom.id)
                .first()
            let numberOfRating = ""
            if (partyRoomNumberOfRating) {
                numberOfRating = partyRoomNumberOfRating["numberOfRating"]
            } else numberOfRating = "0"

            partyRoom["numberOfRating"] = numberOfRating

            if (userId) {
                const hasFavorite = await this.knex("user_favorite_party_rooms").where("user_id", userId).andWhere("party_room_id", partyRoom.id).first()
                if (hasFavorite) {
                    partyRoom["isFavorite"] = true
                } else partyRoom["isFavorite"] = false
            } else {
                partyRoom["isFavorite"] = false
            }
        }

        if (sortBy === "price") {
            partyRooms.sort((a, b) => {
                if (Number(a[sortBy]) > Number(b[sortBy])) {
                    return 1;
                }
                if (Number(a[sortBy]) < Number(b[sortBy])) {
                    return -1;
                }
                return 0;
            })
        }

        if (sortBy === "avgRating") {
            partyRooms.sort((a, b) => {
                if (Number(a[sortBy]) > Number(b[sortBy])) {
                    return -1;
                }
                if (Number(a[sortBy]) < Number(b[sortBy])) {
                    return 1;
                }
                return 0;
            })
        }

        if (facilityFilter && facilityFilter.length > 0) {
            const filteredPartyRooms: {
                id: number
            }[] = await this.knex("party_rooms")
                .select("party_rooms.id")
                .leftJoin("party_room_facilities", "party_room_facilities.party_room_id", "party_rooms.id")
                .whereIn("party_room_facilities.types_id", facilityFilter)

            partyRooms = (partyRooms.filter(partyRoom => {
                let pass = false
                filteredPartyRooms.forEach(room => {
                    (room.id === partyRoom.id) && (pass = true)
                })
                return pass
            }))
        }

        if (districtsFilter && districtsFilter.length > 0) {
            const filteredPartyRooms: {
                id: number
            }[] = await this.knex("party_rooms")
                .select("party_rooms.id")
                .leftJoin("hong_kong_districts", "party_rooms.district_id", "hong_kong_districts.id")
                .whereIn("hong_kong_districts.id", districtsFilter)

            partyRooms = (partyRooms.filter(partyRoom => {
                let pass = false
                filteredPartyRooms.forEach(room => {
                    (room.id === partyRoom.id) && (pass = true)
                })
                return pass
            }))
        }



        if (date && startTime && endTime) {
            const partyStartTime = new Date(date);
            const partyEndTime = new Date(date);

            const sTime = Number(startTime.split(":")[0])
            const eTime = Number(endTime.split(":")[0])
            partyStartTime.setUTCHours(sTime - 8)
            partyEndTime.setUTCHours(eTime - 8)
            if (sTime > eTime) {
                partyEndTime.setDate(partyEndTime.getDate() + 1)
            }

            const filteredPartyRooms: {
                id: number
            }[] = await this.knex("party_room_open_hours")
                .select({ id: "party_room_open_hours.party_room_id" })
                .where("party_room_open_hours.open_time", "<=", partyStartTime)
                .andWhere("party_room_open_hours.close_time", ">=", partyEndTime)

            partyRooms = (partyRooms.filter(partyRoom => {
                let pass = false
                filteredPartyRooms.forEach(room => {
                    (room.id === partyRoom.id) && (pass = true)
                })
                return pass
            }))
        }

        const count = partyRooms.length

        if (pageNum) {
            const limit = 10
            const startNum = limit * (pageNum - 1)
            partyRooms = partyRooms.slice(startNum, startNum + limit)
        }

        return {
            count,
            partyRooms
        }
    }

    async getPartyRoomById(id: number, userId?: number) {
        const partyRoom: {
            id: number
            image: string
            phoneNumber: string
            name: string
            area: string
            maxNumberOfPeople: number
            minNumberOfPeople: number
            address: string
            introduction: string
            district: string
            remark: string
            facilitiesDetails: string
            importantMatter: string
            minNumberOfConsumers: string
            priceOfOvertime: string
            isFavorite: boolean
        } = await this.knex("party_rooms")
            .select(
                "party_rooms.id",
                "party_room_images.image",
                { phoneNumber: "party_rooms.phone_number" },
                "party_rooms.name",
                "party_rooms.area",
                { maxNumberOfPeople: "party_rooms.max_number_of_people" },
                { minNumberOfPeople: "party_rooms.min_number_of_people" },
                "party_rooms.address",
                "party_rooms.introduction",
                "party_rooms.remark",
                { facilitiesDetails: "party_rooms.facilities_detail" },
                { importantMatter: "party_rooms.important_matter" },
                { minNumberOfConsumers: "party_rooms.min_number_of_consumers" },
                { priceOfOvertime: "party_rooms.price_of_overtime" },
                "hong_kong_districts.district"
            )
            .where("party_rooms.id", id)
            .leftJoin("party_room_images", "party_rooms.id", "party_room_images.party_room_id")
            .leftJoin("hong_kong_districts", "party_rooms.district_id", "hong_kong_districts.id")
            .first()

        if (!partyRoom) {
            return
        }
        const facilitiesDetails = partyRoom?.facilitiesDetails?.split("\n")
        const importantMatter = partyRoom?.importantMatter?.split("\n")
        let remark: string[]
        if (partyRoom?.remark) {
            remark = partyRoom?.remark.split("\n")
        } else remark = []

        const partyRoomPrice: {
            startTime: string
            endTime: string
            weekdayPrice: string
            weekendPrice: string
        }[] = await this.knex("party_room_prices")
            .select(
                { startTime: "start_time" },
                { endTime: "end_time" },
                { weekdayPrice: "weekday_price" },
                { weekendPrice: "weekend_price" }
            )
            .where({ party_room_id: id })

        const price = partyRoomPrice

        const partyRoomFacilities: {
            id: number
            name: string,
        }[] = await this.knex("party_room_facility_types")
            .select(
                "party_room_facility_types.id",
                { name: "party_room_facility_types.type" }
            )
            .leftJoin("party_room_facilities", "party_room_facilities.types_id", "party_room_facility_types.id")
            .where("party_room_facilities.party_room_id", id)
            .groupBy("party_room_facility_types.type")
            .groupBy("party_room_facility_types.id")

        const partyRoomFacilityTypes: {
            id: number
            name: string,
        }[] = await this.knex("party_room_facility_types")
            .select(
                "party_room_facility_types.id",
                { name: "party_room_facility_types.type" }
            )
        const facilities = partyRoomFacilityTypes.map(type => {
            type["isAvailable"] = false
            partyRoomFacilities.forEach(facility => {
                (facility.id === type.id) && (type["isAvailable"] = true)
            })
            return type
        })
        let isFavorite
        if (userId) {
            const hasFavorite = await this.knex("user_favorite_party_rooms").where("user_id", userId).andWhere("party_room_id", id).first()
            if (hasFavorite) {
                isFavorite = true
            } else isFavorite = false
        } else {
            isFavorite = false
        }

        const data = {
            ...partyRoom,
            facilitiesDetails,
            importantMatter,
            remark,
            price,
            facilities,
            isFavorite
        }

        return { partyRoom: data }
    }

    async getPartyRoomFacilityType() {
        const facilityTypes = await this.knex("party_room_facility_types")
            .select(
                "party_room_facility_types.id",
                "party_room_facility_types.type"
            )
        return { facilityTypes }
    }

    async getPartyRoomDistricts() {
        const districts = await this.knex("hong_kong_districts")
            .select(
                "id",
                { name: "district" }
            )
        return { districts }
    }

    async getPartyRoomRating(partyRoomId: number, pageNum: number) {
        const limit = 10
        const ratings: {
            id: number
            username: string
            rating: string
            ratingDate: Date
            comment: string
        }[] = await this.knex("party_room_ratings")
            .select(
                "party_room_ratings.id",
                "users.name",
                "party_room_ratings.rating",
                { ratingDate: "party_room_ratings.created_at" },
                "party_room_ratings.comment"
            )
            .leftJoin("users", "party_room_ratings.user_id", "users.id")
            .where("party_room_ratings.party_room_id", partyRoomId)
            .limit(limit)
            .offset((limit * (pageNum - 1)))

        const partyRoomNumberOfRating = await this.knex<{
            numberOfRating: string
        }>("party_room_ratings")
            .count("rating as numberOfRating")
            .where("party_room_id", partyRoomId)
            .first()
        let numberOfRating = ""
        if (partyRoomNumberOfRating) {
            numberOfRating = partyRoomNumberOfRating["numberOfRating"]
        } else numberOfRating = "0"

        const partyRoomRating = await this.knex<{
            avg: string
        }>("party_room_ratings")
            .avg("rating")
            .where("party_room_id", partyRoomId)
            .first()
        let avg = ""
        if (partyRoomRating) {
            avg = Number(partyRoomRating["avg"]).toFixed(2).toString()
        } else avg = "0"

        return {
            avgRating: avg,
            numberOfRating: numberOfRating,
            ratings
        }
    }

    async getPartyRoomPrice(partyRoomId: number, date: string, startTime: string, endTime: string, numberOfPeople: number) {
        const week = (new Date(date)).getDay()
        const weekend = [5, 6, 0]
        let isWeekend = false
        for (let day of weekend) {
            (day === week) && (isWeekend = true)
        }
        const prices: {
            weekdayPrice: string,
            weekendPrice: string,
            partyRoomStartTime: string,
            partyRoomEndTime: string
        }[] = await this.knex("party_room_prices")
            .select(
                { weekdayPrice: "weekday_price" },
                { weekendPrice: "weekend_price" },
                { partyRoomStartTime: "start_time" },
                { partyRoomEndTime: "end_time" }
            )
            .where("party_room_id", partyRoomId)
        const startHour = Number(startTime.slice(0, 2))
        let endHour = Number(endTime.slice(0, 2))
        if (endHour === 0) {
            endHour = 24
        }
        let numOfHour
        if (startHour <= endHour) {
            numOfHour = endHour - startHour
        } else {
            numOfHour = endHour + (24 - startHour)
        }
        let overTime
        if (numOfHour <= 4) {
            overTime = 0
        } else {
            overTime = numOfHour - 4
        }

        const filterPrice = prices.map(price => {
            const partyRoomStartHour = Number(price.partyRoomStartTime.slice(0, 2))
            let partyRoomEndHour = Number(price.partyRoomEndTime.slice(0, 2))
            if (partyRoomEndHour === 0) {
                partyRoomEndHour = 24
            }
            if (startHour < endHour) {
                if (startHour >= partyRoomStartHour && startHour < partyRoomEndHour) {
                    if (isWeekend) {
                        return Number(price.weekendPrice)
                    } else return Number(price.weekdayPrice)
                }

                if (endHour <= partyRoomEndHour && endHour > partyRoomStartHour) {
                    if (isWeekend) {
                        return Number(price.weekendPrice)
                    } else return Number(price.weekdayPrice)
                }

                if (startHour <= partyRoomStartHour && endHour >= partyRoomEndHour) {
                    if (isWeekend) {
                        return Number(price.weekendPrice)
                    } else return Number(price.weekdayPrice)
                }
            }
            if (startHour > endHour) {
                if (startHour < partyRoomEndHour || partyRoomEndHour === 24) {
                    if (isWeekend) {
                        return Number(price.weekendPrice)
                    } else return Number(price.weekdayPrice)
                }
                if (endHour > partyRoomStartHour) {
                    if (isWeekend) {
                        return Number(price.weekendPrice)
                    } else return Number(price.weekdayPrice)
                }
            }

            return 0
        })


        const maxPrice = filterPrice.reduce((a, b) => Math.max(a, b)) * 4
        const priceOfOvertimePreHour = Number((await this.knex("party_rooms").select("price_of_overtime").where("id", partyRoomId).first()).price_of_overtime)
        const overTimePrice = priceOfOvertimePreHour * overTime
        const totalPricePerPeople = maxPrice + overTimePrice
        const totalPrice = totalPricePerPeople * numberOfPeople

        return { price: totalPrice }
    }
}