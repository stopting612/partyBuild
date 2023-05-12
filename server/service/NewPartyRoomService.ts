import { Knex } from "knex"

export class NewPartyRoomService {
    constructor(private knex: Knex) { }

    async getHomePageRecommend() {
        let partyRooms: Array<{
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            price: string
            district: string
        }> = await this.knex("party_rooms")
            .select(
                "party_room_images.image",
                "party_rooms.id",
                "party_rooms.name",
                "hong_kong_districts.district"
            )
            .leftJoin("party_room_images", "party_rooms.id", "party_room_images.party_room_id")
            .leftJoin("hong_kong_districts", "party_rooms.district_id", "hong_kong_districts.id")

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

        }

        partyRooms.sort((a, b) => {
            if (a["avgRating"] > b["avgRating"]) {
                return -1;
            }
            if (a["avgRating"] < b["avgRating"]) {
                return 1;
            }
            return 0;
        })

        partyRooms = partyRooms.slice(0, 2)

        const menus: {
            id: number
            image: string
            name: string
            price: string
            shippingFree: boolean
            numberOfRating: string
            avgRating: string
        }[] = await this.knex("menus")
            .select(
                "id",
                "image",
                "name",
                "price"
            )

        for (let menu of menus) {
            const restaurantRatings = await this.knex<{
                avg: string
            }>("restaurant_ratings")
                .avg("rating")
                .where("menus_id", menu.id)
                .first()
            let avg = ""
            if (restaurantRatings) {
                avg = Number(restaurantRatings["avg"]).toFixed(2).toString()
            } else avg = "0"
            menu["avgRating"] = avg


            const restaurantNumberOfRating = await this.knex<{
                numberOfRating: string
            }>("restaurant_ratings")
                .count("rating as numberOfRating")
                .where("menus_id", menu.id)
                .first()
            let numberOfRating = ""
            if (restaurantNumberOfRating) {
                numberOfRating = restaurantNumberOfRating["numberOfRating"]
            } else numberOfRating = "0"
            menu["numberOfRating"] = numberOfRating

            const shippingFee: {
                price: string
            }[] = await this.knex("restaurant_shipping_fee")
                .select("price")
                .where("menus_id", menu.id)

            if (shippingFee.reduce((a, b) => a + Number(b.price), 0) === 0) {
                menu["shippingFree"] = true
            } else menu["shippingFree"] = false

        }

        menus.sort((a, b) => {
            if (a["avgRating"] > b["avgRating"]) {
                return -1;
            }
            if (a["avgRating"] < b["avgRating"]) {
                return 1;
            }
            return 0;
        })

        const menu = menus[0]

        const alcohols: {
            id: number
            image: string
            name: string
            numberOfRating: string
            pack: string
            averagePrice: string
            avgRating: string
            shippingFree: boolean
            isFavorite: boolean
        }[] = await this.knex("alcohols")
            .select(
                "id",
                "image",
                "name",
                "pack",
                { averagePrice: "average_price" }
            )

        for (const alcohol of alcohols) {
            const alcoholNumberOfRating = await this.knex<{
                numberOfRating: string
            }>("alcohol_ratings")
                .count("rating as numberOfRating")
                .where("alcohol_id", alcohol.id)
                .first()
            let numberOfRating = ""
            if (alcoholNumberOfRating) {
                numberOfRating = alcoholNumberOfRating["numberOfRating"]
            } else numberOfRating = "0"

            alcohol.numberOfRating = numberOfRating

            const avgRating = await this.knex<{
                avg: string
            }>("alcohol_ratings")
                .avg("rating")
                .where("alcohol_id", alcohol.id)
                .first()
            let avg = ""
            if (avgRating) {
                avg = Number(avgRating["avg"]).toFixed(2).toString()
            } else avg = "0"

            alcohol.avgRating = avg

            alcohol.shippingFree = true

        }

        alcohols.sort((a, b) => {
            if (a["avgRating"] > b["avgRating"]) {
                return -1;
            }
            if (a["avgRating"] < b["avgRating"]) {
                return 1;
            }
            return 0;
        })

        const alcohol = alcohols[0]

        return {
            partyRooms,
            menu,
            alcohol
        }
    }

    async getUserChoicePartyRoom(numberOfPeopleFilter: number, date: string, startTime: string, endTime: string, facilityFilter: Array<number>, districtsFilter: Array<number>) {
        let partyRooms: {
            id: number
            image: string
            name: string
            introduction: string
            district: string
        }[] = await this.knex("party_rooms")
            .select(
                "party_rooms.id",
                "party_room_images.image",
                "party_rooms.name",
                "party_rooms.introduction",
                "hong_kong_districts.district"
            )
            .leftJoin("party_room_images", "party_rooms.id", "party_room_images.party_room_id")
            .leftJoin("hong_kong_districts", "party_rooms.district_id", "hong_kong_districts.id")

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

        if (numberOfPeopleFilter && numberOfPeopleFilter > 0) {
            const filteredPartyRooms: {
                id: number
            }[] = await this.knex("party_rooms")
                .select("party_rooms.id")
                .where("party_rooms.max_number_of_people", ">=", numberOfPeopleFilter)
                .andWhere("party_rooms.min_number_of_people", "<=", numberOfPeopleFilter)

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

        return { partyRooms }
    }

    async getUserChoiceMenus(numberOfPeople: number, cuisineFilter: number[]) {
        let menus: {
            id: number
            image: string
            name: string
            numberOfRating: string
            introduction: string
            avgRating: string
            price: string
            shippingFree: boolean
            shippingFees: Array<{
                id: number
                price: number
                area: string
            }>
        }[] = await this.knex("menus")
            .select(
                "id",
                "image",
                "name",
                "price",
                "introduction"
            )

        for (let menu of menus) {
            const restaurantRatings = await this.knex<{
                avg: string
            }>("restaurant_ratings")
                .avg("rating")
                .where("menus_id", menu.id)
                .first()
            let avg = ""
            if (restaurantRatings) {
                avg = Number(restaurantRatings["avg"]).toFixed(2).toString()
            } else avg = "0"
            menu["avgRating"] = avg


            const restaurantNumberOfRating = await this.knex<{
                numberOfRating: string
            }>("restaurant_ratings")
                .count("rating as numberOfRating")
                .where("menus_id", menu.id)
                .first()
            let numberOfRating = ""
            if (restaurantNumberOfRating) {
                numberOfRating = restaurantNumberOfRating["numberOfRating"]
            } else numberOfRating = "0"
            menu["numberOfRating"] = numberOfRating

            const shippingFee: {
                price: string
            }[] = await this.knex("restaurant_shipping_fee")
                .select("price")
                .where("menus_id", menu.id)

            if (shippingFee.reduce((a, b) => a + Number(b.price), 0) === 0) {
                menu["shippingFree"] = true
            } else menu["shippingFree"] = false

            const shippingFees: {
                id: number
                price: number
                area: string
            }[] = await this.knex("restaurant_shipping_fee")
                .select(
                    "restaurant_shipping_fee.id",
                    "restaurant_shipping_fee.price",
                    "hong_kong_areas.area"
                )
                .leftJoin("hong_kong_areas", "restaurant_shipping_fee.hong_kong_area_id", "hong_kong_areas.id")
                .where("menus_id", menu.id)

            menu.shippingFees = shippingFees
        }

        if (cuisineFilter && cuisineFilter.length > 0) {
            const filteredMenus: {
                id: number
            }[] = await this.knex("restaurant_cuisine")
                .select({ id: "menus_id" })
                .whereIn("cuisine_id", cuisineFilter)

            menus = (menus.filter(menu => {
                let pass = false
                filteredMenus.forEach(food => {
                    (food.id === menu.id) && (pass = true)
                })
                return pass
            }))
        }

        if (numberOfPeople && numberOfPeople > 0) {
            const filteredMenus: {
                id: number
            }[] = await this.knex("menus")
                .select("id")
                .where("max_number_of_people", ">=", numberOfPeople)
                .andWhere("min_number_of_people", "<=", numberOfPeople)

            menus = (menus.filter(food => {
                let pass = false
                filteredMenus.forEach(menu => {
                    (menu.id === food.id) && (pass = true)
                })
                return pass
            }))
        }

        return { menus }
    }

    async getUserChoiceAlcohols(typeFilter: Array<number>) {
        let alcohols: {
            id: number
            image: string
            name: string
            pack: string
            averagePrice: string
            numberOfRating: string
            avgRating: string
            shippingFree: boolean
        }[] = await this.knex("alcohols")
            .select(
                "id",
                "image",
                "name",
                "pack",
                { averagePrice: "average_price" }
            )

        for (const alcohol of alcohols) {
            const alcoholNumberOfRating = await this.knex<{
                numberOfRating: string
            }>("alcohol_ratings")
                .count("rating as numberOfRating")
                .where("alcohol_id", alcohol.id)
                .first()
            let numberOfRating = ""
            if (alcoholNumberOfRating) {
                numberOfRating = alcoholNumberOfRating["numberOfRating"]
            } else numberOfRating = "0"

            alcohol.numberOfRating = numberOfRating

            const avgRating = await this.knex<{
                avg: string
            }>("alcohol_ratings")
                .avg("rating")
                .where("alcohol_id", alcohol.id)
                .first()
            let avg = ""
            if (avgRating) {
                avg = Number(avgRating["avg"]).toFixed(2).toString()
            } else avg = "0"

            alcohol.avgRating = avg

            alcohol.shippingFree = true
        }

        if (typeFilter && typeFilter.length > 0) {
            const filteredAlcohols: {
                id: number
            }[] = await this.knex("alcohols")
                .whereIn("type_id", typeFilter)
            alcohols = (alcohols.filter(alcohol => {
                let pass = false
                filteredAlcohols.forEach(filteredAlcohol => {
                    (filteredAlcohol.id === alcohol.id) && (pass = true)
                })
                return pass
            }))
        }

        return { alcohols }
    }
}
