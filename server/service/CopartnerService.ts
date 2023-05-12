import { Knex } from "knex"
import * as dotenv from 'dotenv'
import sgMail from "@sendgrid/mail"
import { hashPassword } from "../utils/hash"
dotenv.config()

export class CopartnerService {
    constructor(private knex: Knex) { }

    async copartnerLogin(email: string) {
        const copartner: {
            id: number
            email: string,
            password: string,
        } = await this.knex("copartner_accounts")
            .select('id', 'email', 'password')
            .where({ email })
            .first()
        return copartner
    }

    async getCopartnerEmailById(id: number) {
        const copartner: {
            id: number
            email: string,
        } = await this.knex("copartner_accounts")
            .select('id', 'email',)
            .where({ id })
            .first()

        return copartner
    }

    async getCopartnerDate(copartnerId: number) {
        const copartner: {
            name: string
            email: string
        } = await this.knex("copartner_accounts")
            .select(
                "name",
                "email"
            )
            .where("id", copartnerId)
            .first()

        return copartner
    }

    async getCorpartnerStores(id: number) {
        const corpartnerstores: {
            id: number
            name: string
        }[] = await this.knex("copartner_accounts")
            .select("party_rooms.id", 'party_rooms.name')
            .innerJoin('party_rooms', 'copartner_accounts.id', 'party_rooms.account_id')
            .where("copartner_accounts.id", id)

        return corpartnerstores
    }

    async getCorpartnerStoresTodayOrder(id: number) {
        const date = new Date()
        date.setUTCHours(-8)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)

        const getCopartnerTodayOrder: {
            id: number,
            storeName: string,
            clientName: string,// question about clientName
            date: Date,
            startTime: string | Date,
            endTime: string | Date,
        }[] = await this.knex("copartner_accounts")
            .select(
                'party_room_orders.id',
                { storeName: 'party_rooms.name' },
                { clientName: 'creator_contact.contact_name' },
                'party.date',
                { startTime: 'party.start_time' },
                { endTime: 'party.end_time' }
            )
            .leftJoin('party_rooms', 'copartner_accounts.id', 'party_rooms.account_id')
            .leftJoin('party_room_orders', 'party_rooms.id', 'party_room_orders.party_room_id')
            .leftJoin('party', 'party_room_orders.party_id', 'party.id')
            .leftJoin('creator_contact', 'party.id', 'creator_contact.party_id')
            .where("copartner_accounts.id", id)
            .andWhere("party.is_pay", true)
            .andWhere('party.date', '=', date)
            .groupBy(
                'party_room_orders.id',
                'party_rooms.name',
                'creator_contact.contact_name',
                'party.date',
                'party.start_time',
                'party.end_time'
            )
            // .andWhere('party.date', '<', 'tomorrow')
            // .andWhere('party.date', '<',)
            // .andWhere('party.date','<',"today+ INVTERVAL 1 DAY")
            // .andWhere('party.created_at', '>', )
            // .andWhere('created_at', '<',)
            .orderBy('party.start_time', "asc")
        getCopartnerTodayOrder.map(order => {
            const endTime = Number(order.endTime?.toString().slice(0, 2))
            const startTime = Number(order.startTime?.toString().slice(0, 2))
            order.endTime = new Date(order.date)
            order.startTime = new Date(order.date)
            order.startTime.setHours(startTime)
            order.endTime.setHours(endTime)


            return order
        })
        getCopartnerTodayOrder.map


        return getCopartnerTodayOrder
    }

    async getCorpartnerStoresOrder(id: number) {
        const getCopartnerOrder: {
            id: number,
            storeName: string,
            clientName: string,// question about clientName
            date: Date,
            state: string,
            // startTime: string | Date,
            // endTime: string | Date,
        }[] = await this.knex("copartner_accounts")
            .select(
                'party_room_orders.id',
                { storeName: 'party_rooms.name' },
                { clientName: 'creator_contact.contact_name' },
                'party.date',
                'party_room_orders.states'
            )
            //  { startTime: 'party.start_time'}, { endTime: 'party.end_time' }
            .leftJoin('party_rooms', 'copartner_accounts.id', 'party_rooms.account_id')
            .leftJoin('party_room_orders', 'party_rooms.id', 'party_room_orders.party_room_id')
            .leftJoin('party', 'party_room_orders.party_id', 'party.id')
            .leftJoin('creator_contact', 'party.id', 'creator_contact.party_id')
            .where("copartner_accounts.id", id)
            .andWhere("party.is_pay", true)
            .groupBy(
                'party_room_orders.id',
                'party_rooms.name',
                'creator_contact.contact_name',
                'party.date',
                'party_room_orders.states'
            )
            // .orderBy([ { column: 'party_room.created_at', order:'desc'}, { column: 'party.date', order: 'desc' }] )
            .orderBy('party.date', "desc")
            .orderBy('party_room_orders.states', "asc")

        // const now = new Date("2021-04-06")
        // // "2021-04-06T16:00:00.000Z"
        // // "10:00:00"
        // const startTime = "10:00:00"

        // startTime.slice(0, 2) // "10"
        // now.setHours(Number(startTime.slice(0, 2)))

        // // console.log(getCopartnerTodayOrder)
        // getCopartnerOrder.map(order => {
        //     const endTime = Number(order.endTime?.toString().slice(0, 2))
        //     const startTime= Number(order.startTime?.toString().slice(0, 2))
        //     order.endTime = new Date(order.date)
        //     order.startTime= new Date(order.date)
        //     order.date.getDate
        //     order.startTime.setHours(startTime)
        //     order.endTime.setHours(endTime)
        //     // console.log(order.endTime.getHours())
        //     // console.log(order.startTime.getHours())

        //     return order
        // })
        // getCopartnerOrder.map


        return getCopartnerOrder
    }



    async getCopartnerStoreDetailOrder(id: number, pageNum: number) {
        const limit = 10
        const getCopartnerStoreDetailOrder: {
            id: number,
            storeName: string,
            clientName: string,// question about clientName
            date: Date,
            startTime: string | Date,
            endTime: string | Date,
            numberOfMember: number,
            states: string,
            special_requirement: string,
        }[] = await this.knex("copartner_accounts")
            .select(
                'party_room_orders.id',
                { storeName: 'party_rooms.name', },
                { clientName: 'creator_contact.contact_name' },
                'party.date',
                { startTime: 'party.start_time' },
                { endTime: 'party.end_time' },
                { numberOfMember: 'party_room_orders.number_of_people' },
                'party_room_orders.states',
                'party_room_orders.special_requirement'
            )
            .leftJoin('party_rooms', 'copartner_accounts.id', 'party_rooms.account_id')
            .leftJoin('party_room_orders', 'party_rooms.id', 'party_room_orders.party_room_id')
            .leftJoin('party', 'party_room_orders.party_id', 'party.id')
            .leftJoin('creator_contact', 'party.id', 'creator_contact.party_id')
            .where("copartner_accounts.id", id)
            .andWhere("party.is_pay", true)
            .groupBy(
                'party_room_orders.id',
                'party_rooms.name',
                'creator_contact.contact_name',
                'party.date',
                'party.start_time',
                'party.end_time',
                'party_room_orders.number_of_people',
                'party_room_orders.states',
                'party_room_orders.special_requirement'
            )
            .limit(limit)
            .offset((limit * (pageNum - 1)))
            .orderBy('party.date', "asc")

        getCopartnerStoreDetailOrder.sort((b, a) => {
            if (a.states === b.states) {
                return 0
            }
            if (a.states === "待確認") {
                return 1
            }
            if (a.states === "已確認" && b.states !== "待確認") {
                return 1
            }
            if (a.states === "已完結" && (b.states !== "已確認" && b.states !== "待確認")) {
                return 1
            }
            return -1
        })

        const num = await this.knex("copartner_accounts")
            .count('party_room_orders.party_room_id')
            .leftJoin('party_rooms', 'copartner_accounts.id', 'party_rooms.account_id')
            .leftJoin('party_room_orders', 'party_rooms.id', 'party_room_orders.party_room_id')
            .leftJoin('party', 'party_room_orders.party_id', 'party.id')
            .leftJoin('creator_contact', 'party.id', 'creator_contact.party_id')
            .where("copartner_accounts.id", id)
            .andWhere("party.is_pay", true)
            .first()
        let count
        if (num) {
            count = Number(num["count"])
        } else count = 0

        return {
            count,
            partyRoomOrders: getCopartnerStoreDetailOrder
        }

    }

    async confirmCopartnerOrderStates(id: number) {
        const trx = await this.knex.transaction()

        try {
            await trx("party_room_orders")
                .update({
                    states: "已確認"
                })
                .where("id", id)

            const partyId = (await trx("party_room_orders").where("id", id).first()).party_id

            const bookingTime: {
                partyRoomId: number,
                bookingStartTime: string,
                bookingEndTime: string,
            } = await trx("party_room_bookings")
                .select(
                    { partyRoomId: "party_room_id" },
                    { bookingStartTime: "booking_start_time" },
                    { bookingEndTime: "booking_end_time" }
                )
                .where("party_id", partyId)
                .first()

            const fillRepeatTimes: {
                id: number,
                openTime: string,
                closeTime: string
            }[] = await trx("party_room_open_hours")
                .select(
                    "id",
                    { openTime: "open_time" },
                    { closeTime: "close_time" }
                )
                .where("party_room_id", bookingTime.partyRoomId)
                .andWhere("open_time", "=", bookingTime.bookingStartTime)
                .andWhere("close_time", "=", bookingTime.bookingEndTime)

            for (const fillRepeatTime of fillRepeatTimes) {
                await trx("party_room_open_hours")
                    .update("is_book", true)
                    .where("id", fillRepeatTime.id)

                await trx.commit()

                return
            }


            const bookingStartTimeRepeatTimes: {
                id: number,
                openTime: string | Date,
                closeTime: string | Date
            }[] = await trx("party_room_open_hours")
                .select(
                    "id",
                    { openTime: "open_time" },
                    { closeTime: "close_time" }
                )
                .where("party_room_id", bookingTime.partyRoomId)
                .andWhere("open_time", "<=", bookingTime.bookingStartTime)
                .andWhere("close_time", ">", bookingTime.bookingStartTime)

            for (const bookingStartTimeRepeatTime of bookingStartTimeRepeatTimes) {
                await trx("party_room_open_hours")
                    .where("id", bookingStartTimeRepeatTime.id)
                    .del()

                await trx("party_room_open_hours")
                    .insert({
                        party_room_id: bookingTime.partyRoomId,
                        open_time: bookingStartTimeRepeatTime.openTime,
                        close_time: bookingTime.bookingStartTime,
                        is_book: false
                    })

                await trx("party_room_open_hours")
                    .insert({
                        party_room_id: bookingTime.partyRoomId,
                        open_time: bookingTime.bookingStartTime,
                        close_time: bookingStartTimeRepeatTime.closeTime,
                        is_book: true
                    })
            }

            const bookingEndTimeRepeatTimes: {
                id: number,
                openTime: string | Date,
                closeTime: string | Date
            }[] = await trx("party_room_open_hours")
                .select(
                    "id",
                    { openTime: "open_time" },
                    { closeTime: "close_time" }
                )
                .where("party_room_id", bookingTime.partyRoomId)
                .andWhere("close_time", ">=", bookingTime.bookingEndTime)
                .andWhere("open_time", "<", bookingTime.bookingEndTime)

            for (const bookingEndTimeRepeatTime of bookingEndTimeRepeatTimes) {
                await trx("party_room_open_hours")
                    .where("id", bookingEndTimeRepeatTime.id)
                    .del()

                await trx("party_room_open_hours")
                    .insert({
                        party_room_id: bookingTime.partyRoomId,
                        open_time: bookingTime.bookingEndTime,
                        close_time: bookingEndTimeRepeatTime.closeTime,
                        is_book: false
                    })

                await trx("party_room_open_hours")
                    .insert({
                        party_room_id: bookingTime.partyRoomId,
                        open_time: bookingEndTimeRepeatTime.openTime,
                        close_time: bookingTime.bookingEndTime,
                        is_book: true
                    })
            }


            const email = (await trx("users")
                .select(
                    "users.email",

                )
                .leftJoin("party", "party.creator_id", "users.id")
                .leftJoin("party_room_orders", "party_room_orders.party_id", "party.id")
                .where("party_room_orders.id", id)
                .first()).email

            if (process.env.SENDGRID_API_KEY) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            }

            const msg = {
                to: email,
                from: 'welcome@partybuildhk.com', // Use the email address or domain you verified above
                subject: 'Order confirm',
                text: `Your party room order has been confirm`,
                html: `<> <h1>Your party room order has been confirm. </h1>`,
            };

            await sgMail.send(msg)

            await trx.commit()
        } catch (err) {
            await trx.rollback()
            throw err
        }
    }

    async cancelCopartnerOrderStates(id: number) {
        const trx = await this.knex.transaction()

        try {
            await trx("party_room_orders")
                .update({
                    states: "已取消"
                })
                .where("id", id)

            const partyRoomBookingTimeId = (await trx("party_room_bookings")
                .select("party_room_bookings.id")
                .leftJoin("party_room_orders", "party_room_orders.party_id", "party_room_bookings.party_id")
                .where("party_room_orders.id", id)
                .first()).id

            await trx("party_room_bookings")
                .where("id", partyRoomBookingTimeId)
                .del()

            if (process.env.SENDGRID_API_KEY) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            }

            const email = (await trx("users")
                .select(
                    "users.email",

                )
                .leftJoin("party", "party.creator_id", "users.id")
                .leftJoin("party_room_orders", "party_room_orders.party_id", "party.id")
                .where("party_room_orders.id", id)
                .first()).email


            const msg = {
                to: email,
                from: 'welcome@partybuildhk.com', // Use the email address or domain you verified above
                subject: 'Order cancel',
                text: `Your party room order has been cancel`,
                html: `<> <h1>Your party room order has been cancel. </h1>`,
            };

            await sgMail.send(msg)

            await trx.commit()

        } catch (err) {
            await trx.rollback()
            throw err
        }

    }

    async checkPartyRoomOrderExist(id: number) {
        const partyRoomOrder = await this.knex("party_room_orders").select("id").where("id", id).first()
        if (!partyRoomOrder) {
            return false
        }
        return true
    }

    async getCopartnerOrderById(id: number) {
        const party: {
            id: number,
            name: string,
            date: string,
            startTime: string,
            endTime: string,
            states: string
        } = await this.knex("party")
            .select(
                "party.id",
                "party.name",
                "party.date",
                { startTime: "party.start_time" },
                { endTime: "party.end_time" },
                "party_room_orders.states"
            )
            .rightJoin("party_room_orders", "party_room_orders.party_id", "party.id")
            .where("party_room_orders.id", id)
            .first()

        const partyRoom: {
            name: string,
            price: string
            numberOfPeople: number
        } = await this.knex("party_rooms")
            .select(
                "party_rooms.name",
                "party_room_orders.price",
                { numberOfPeople: "party_room_orders.number_of_people" }
            )
            .leftJoin("party_room_orders", "party_room_orders.party_room_id", "party_rooms.id")
            .where("party_room_orders.id", id)
            .first()

        const menu: Array<{
            name: string,
            quantity: number,
            price: string
        }> = await this.knex("menus")
            .select(
                "menus.name",
                "food_orders.quantity",
                "food_orders.price"
            )
            .leftJoin("food_orders", "food_orders.food_id", "menus.id")
            .where("food_orders.party_id", party.id)

        const alcohol: Array<{
            name: string,
            quantity: number,
            price: string
        }> = await this.knex("alcohols")
            .select(
                "alcohols.name",
                "alcohol_orders.quantity",
                "alcohol_orders.price",
            )
            .leftJoin("alcohol_orders", "alcohol_orders.alcohol_id", "alcohols.id")
            .where("alcohol_orders.party_id", party.id)

        const user: {
            name: string,
            phoneNumber: string
            date: Date
            time: string
            district: string
            address: string
            specialRequirement: string
        } = await this.knex("creator_contact")
            .select(
                { name: "creator_contact.contact_name" },
                { phoneNumber: "creator_contact.phone_number" },
                { date: "party.delivery_date" },
                { time: "party.delivery_time" },
                "hong_kong_districts.district",
                { address: "party.delivery_address" },
                { specialRequirement: "party_room_orders.special_requirement" }
            )
            .leftJoin("party", "creator_contact.party_id", "party.id")
            .leftJoin("hong_kong_districts", "party.district_id", "hong_kong_districts.id")
            .leftJoin("party_room_orders", "party_room_orders.party_id", "party.id")
            .where("party.id", party.id)
            .first()

        return {
            party,
            order: {
                partyRoom,
                menu,
                alcohol
            },
            user
        }
    }

    async getCorpartnerPartyRoom(id: number) {
        const getCorpartnerPartyRoom: {
            id: number
            name: string
        }[] = await this.knex("copartner_accounts")
            .select("party_rooms.id", 'party_rooms.name')
            .innerJoin('party_rooms', 'copartner_accounts.id', 'party_rooms.account_id')
            .where("copartner_accounts.id", id)

        return getCorpartnerPartyRoom
    }

    async getCorpartnerPartyRoomOpenTime(id: number) {
        const now = new Date()
        now.setUTCHours(now.getUTCHours() + 8)
        const today = now.toISOString()
        const getCorpartnerPartyRoomOpenTime: {
            id: number,
            date: string | Date,
            startTime: string | Date,
            endTime: string | Date,
            isBook: boolean
        }[] = await this.knex("party_room_open_hours")
            .select(
                'id',
                { date: 'open_time' },
                { startTime: 'open_time' },
                { endTime: 'close_time' },
                { isBook: 'is_book' }
            )
            .where("party_room_id", id)
            .whereRaw(`DATE(open_time) >= DATE('${today}')`)
            .orderBy('open_time')

        return getCorpartnerPartyRoomOpenTime
    }


    async getCorpartnerTotalPriceOrder(id: number) {
        const getCopartnerStoreDetailOrder: {
            name: string,
            date: Date,
            startTime: Date | string,
            endTime: Date | string,
            districts: string,
            address: string,
            specialRequirement: string,
            partyRoom: {
                name: string,
                price: string
            },
            menu: {
                name: string,
                price: string
            },
            alcohol: {
                name: string,
                price: string
            },
            users: {
                name: string,
                phoneNumber: string
            }

        }[] = await this.knex("party_room_orders")
            .select('party.name', 'party.date', { startTime: ' party.start_time' }, { endTime: 'party.end_time' },
                'hong_kong_districts.district', 'party.address',
                'party_room_orders.special_requirement', 'party_rooms.name', 'party_rooms_orders.price',
                'food_orders.price', 'menus.price', 'alcohols.name', 'alcohol_orders.price',
                'creator_contact.contact_name', 'creator_contact.phone_number')
            .leftJoin('party_rooms', 'party_room_orders.party_room_id', 'party_rooms.account_id')
            // .leftJoin('party_room_orders', 'party_rooms.id', 'party_room_orders.party_room_id')
            // .leftJoin('party', 'party_room_orders.party_id', 'party.id')
            .leftJoin('creator_contact', 'party_rooms.id', 'creator_contact.party_id')
            .leftJoin('party', 'creator_contact.party_id', 'party.id')
            // .leftJoin('food_orders', 'party.id', 'food_orders.party_id')
            .leftJoin('menus', 'party.id', "menus.id")
            .leftJoin('food_orders', 'menus.id', 'food_orders.party_id')
            // .leftJoin('party', 'food_orders.party_id', 'party.id')
            .leftJoin('alcohol_orders', 'party.id', 'alcohol_orders.party_id')
            .leftJoin('alcohols', 'alcohol_orders.alcohol_id', 'alcohols.id')
            .leftJoin('hong_kong_districts', 'alcohols.id', '')
            .where("party.id", id)
            .andWhere("party.is_pay", true)


        return getCopartnerStoreDetailOrder

    }






    async getStoreDataById(id: number) {
        const partyRoom: {
            id: number
            name: string
            address: string
            districtId: number
            area: number
            maxPeople: number
            minPeople: number
            introduction: string
            image: string
            facilities: Array<{
                id: number
                type: string
                isAvailable: boolean
            }>
            facilitiesDetail: string
            importantMatter: string
            contactPerson: string
            contactNumber: number
            whatsapp: number
            email: string,
            remark: string,
        } = await this.knex("party_rooms")
            .select(
                "id",
                "name",
                "address",
                { districtId: "district_id" },
                "area",
                { maxPeople: "max_number_of_people" },
                { minPeople: "min_number_of_people" },
                "introduction",
                { facilitiesDetail: "facilities_detail" },
                { importantMatter: "important_matter" },
                { contactPerson: "contact_person" },
                { contactNumber: "phone_number" },
                "whatsapp",
                "email",
                "remark",
                { priceOfOvertime: "price_of_overtime" }
            )
            .where("id", id)
            .first()

        if (!partyRoom) {
            return
        }

        const image = (await this.knex("party_room_images")
            .select("image")
            .where("party_room_id", id)
            .first())?.image

        partyRoom.image = image

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

        const partyRoomFacilityTypes = await this.knex("party_room_facility_types")
            .select(
                "party_room_facility_types.id",
                { name: "party_room_facility_types.type" }
            )
        const facilities: {
            id: number
            type: string
            isAvailable: boolean
        }[] = partyRoomFacilityTypes.map(type => {
            type["isAvailable"] = false
            partyRoomFacilities.forEach(facility => {
                (facility.id === type.id) && (type["isAvailable"] = true)
            })
            return type
        })
        partyRoom.facilities = facilities

        return partyRoom
    }

    async updateStoreData(
        id: number,
        storeName: string,
        address: string,
        districtId: number,
        // district : id
        area: number,
        maxPeople: number,
        minPeople: number,
        introduction: string,
        image: string,
        facilities: Array<number>,
        //[ facility : id ]
        facilitiesDetail: string,
        importantMatter: string,
        contactPerson: string,
        contactNumber: number,
        whatsapp: number,
        email: string
    ) {
        await this.knex("party_rooms")
            .update({
                name: storeName,
                address,
                district_id: districtId,
                phone_number: contactNumber,
                introduction,
                whatsapp,
                area,
                important_matter: importantMatter,
                contact_person: contactPerson,
                email,
                max_number_of_people: maxPeople,
                min_number_of_people: minPeople,
                facilities_detail: facilitiesDetail,
                min_number_of_consumers: 4
            })
            .where("id", id)

        await this.knex("party_room_facilities")
            .where("party_room_id", id)
            .del()

        if (facilities.length > 0) {
            await this.knex("party_room_facilities")
                .insert(facilities.map(facility => {
                    return { party_room_id: id, types_id: facility }
                }))
        }

        if (image !== "http://cdn.partybuildhk.com/undefined") {
            await this.knex("party_room_images")
                .where("party_room_id", id)
                .del()

            await this.knex("party_room_images")
                .insert({
                    party_room_id: id,
                    image
                })
        }
    }

    async postPartyRoomOpenTime(
        openTimes: {
            openTimeIndex: number,
            partyRoomId: number,
            date: Date,
            startTime: string,
            endTime: string
        }[]
    ) {
        const conflictIndex = []

        const trx = await this.knex.transaction()

        try {
            for (const openTime of openTimes) {
                const date = openTime.date
                const partyRoomId = openTime.partyRoomId
                const startTime = new Date(date)
                startTime.setUTCHours(Number(openTime.startTime.slice(0, 2)) - 8)
                const endTime = new Date(date)
                endTime.setUTCHours(Number(openTime.endTime.slice(0, 2)) - 8)
                if (Number(openTime.startTime.slice(0, 2)) > Number(openTime.endTime.slice(0, 2))) {
                    endTime.setDate(endTime.getDate() + 1)
                }

                const hasRepeatTime = await trx("party_room_open_hours")
                    .where("party_room_id", partyRoomId)
                    .andWhere("open_time", "<=", startTime)
                    .andWhere("close_time", ">", startTime)
                    .union([
                        trx("party_room_open_hours")
                            .where("party_room_id", partyRoomId)
                            .andWhere("close_time", ">=", endTime)
                            .andWhere("open_time", "<", endTime),
                        trx("party_room_open_hours")
                            .where("party_room_id", partyRoomId)
                            .andWhere("open_time", ">=", startTime)
                            .andWhere("close_time", "<=", endTime)
                    ])
                if (hasRepeatTime.length > 0) {
                    conflictIndex.push(openTime.openTimeIndex)
                } else {

                    const startTimeSameToCloseTime: {
                        id: number,
                        openTime: string,
                        closeTime: string
                    } = await trx("party_room_open_hours")
                        .select(
                            "id",
                            { openTime: "open_time" },
                            { closeTime: "close_time" }
                        )
                        .where("party_room_id", partyRoomId)
                        .andWhere("close_time", startTime)
                        .andWhere("is_book", false)
                        .first()

                    const endTimeSameToOpenTime: {
                        id: number,
                        openTime: string,
                        closeTime: string
                    } = await trx("party_room_open_hours")
                        .select(
                            "id",
                            { openTime: "open_time" },
                            { closeTime: "close_time" }
                        )
                        .where("party_room_id", partyRoomId)
                        .andWhere("open_time", endTime)
                        .andWhere("is_book", false)
                        .first()

                    if (startTimeSameToCloseTime && !endTimeSameToOpenTime) {
                        await trx("party_room_open_hours")
                            .where("id", startTimeSameToCloseTime.id)
                            .del()

                        await trx("party_room_open_hours")
                            .insert({
                                party_room_id: partyRoomId,
                                open_time: startTimeSameToCloseTime.openTime,
                                close_time: endTime,
                                is_book: false
                            })
                    }



                    if (endTimeSameToOpenTime && !startTimeSameToCloseTime) {
                        await trx("party_room_open_hours")
                            .where("id", endTimeSameToOpenTime.id)
                            .del()

                        await trx("party_room_open_hours")
                            .insert({
                                party_room_id: partyRoomId,
                                open_time: startTime,
                                close_time: endTimeSameToOpenTime.closeTime,
                                is_book: false
                            })
                    }

                    if (startTimeSameToCloseTime && endTimeSameToOpenTime) {
                        await trx("party_room_open_hours")
                            .where("id", startTimeSameToCloseTime.id)
                            .del()

                        await trx("party_room_open_hours")
                            .where("id", endTimeSameToOpenTime.id)
                            .del()

                        await trx("party_room_open_hours")
                            .insert({
                                party_room_id: partyRoomId,
                                open_time: startTimeSameToCloseTime.openTime,
                                close_time: endTimeSameToOpenTime.closeTime,
                                is_book: false
                            })
                    }

                    if (!startTimeSameToCloseTime && !endTimeSameToOpenTime) {
                        await trx("party_room_open_hours")
                            .insert({
                                party_room_id: partyRoomId,
                                open_time: startTime,
                                close_time: endTime,
                                is_book: false
                            })
                    }

                }
            }

            if (conflictIndex.length === 0) {
                await trx.commit()
            } else {
                await trx.rollback()
                return { conflictIndex }
            }

        } catch (err) {
            await trx.rollback()
            throw err
        }

        return { conflictIndex }
    }

    async checkHasPartyRoomOpenTime(id: number) {
        const openTime = await this.knex("party_room_open_hours").where({ id }).first()
        if (!openTime) {
            return false
        }
        return true
    }

    async updatePartyRoomOpenTime(id: number, date: string, startTime: string, endTime: string) {
        const trx = await this.knex.transaction()

        try {
            const partyRoomId = (await trx("party_room_open_hours").where("id", id).first())?.party_room_id
            const openTime = new Date(date)
            openTime.setUTCHours(Number(startTime.slice(0, 2)) - 8)
            const closeTime = new Date(date)
            closeTime.setUTCHours(Number(endTime.slice(0, 2)) - 8)
            if (Number(startTime.slice(0, 2)) > Number(endTime.slice(0, 2))) {
                closeTime.setDate(closeTime.getDate() + 1)
            }

            await trx("party_room_open_hours")
                .where("id", id)
                .del()

            const hasRepeatTime = await trx("party_room_open_hours")
                .where("party_room_id", partyRoomId)
                .andWhere("open_time", "<=", openTime)
                .andWhere("close_time", ">", openTime)
                .union([
                    trx("party_room_open_hours")
                        .where("party_room_id", partyRoomId)
                        .andWhere("close_time", ">=", closeTime)
                        .andWhere("open_time", "<", closeTime),
                    trx("party_room_open_hours")
                        .where("party_room_id", partyRoomId)
                        .andWhere("open_time", ">=", openTime)
                        .andWhere("close_time", "<=", closeTime)
                ])

            if (hasRepeatTime.length > 0) {
                await trx.rollback()
                return hasRepeatTime
            }

            const startTimeSameToCloseTime: {
                id: number,
                openTime: string,
                closeTime: string
            } = await trx("party_room_open_hours")
                .select(
                    "id",
                    { openTime: "open_time" },
                    { closeTime: "close_time" }
                )
                .where("party_room_id", partyRoomId)
                .andWhere("close_time", openTime)
                .andWhere("is_book", false)
                .first()

            const endTimeSameToOpenTime: {
                id: number,
                openTime: string,
                closeTime: string
            } = await trx("party_room_open_hours")
                .select(
                    "id",
                    { openTime: "open_time" },
                    { closeTime: "close_time" }
                )
                .where("party_room_id", partyRoomId)
                .andWhere("open_time", closeTime)
                .andWhere("is_book", false)
                .first()

            if (startTimeSameToCloseTime && !endTimeSameToOpenTime) {
                await trx("party_room_open_hours")
                    .where("id", startTimeSameToCloseTime.id)
                    .del()

                await trx("party_room_open_hours")
                    .insert({
                        party_room_id: partyRoomId,
                        open_time: startTimeSameToCloseTime.openTime,
                        close_time: closeTime,
                        is_book: false
                    })
            }



            if (endTimeSameToOpenTime && !startTimeSameToCloseTime) {
                await trx("party_room_open_hours")
                    .where("id", endTimeSameToOpenTime.id)
                    .del()

                await trx("party_room_open_hours")
                    .insert({
                        party_room_id: partyRoomId,
                        open_time: openTime,
                        close_time: endTimeSameToOpenTime.closeTime,
                        is_book: false
                    })
            }

            if (startTimeSameToCloseTime && endTimeSameToOpenTime) {
                await trx("party_room_open_hours")
                    .where("id", startTimeSameToCloseTime.id)
                    .del()

                await trx("party_room_open_hours")
                    .where("id", endTimeSameToOpenTime.id)
                    .del()

                await trx("party_room_open_hours")
                    .insert({
                        party_room_id: partyRoomId,
                        open_time: startTimeSameToCloseTime.openTime,
                        close_time: endTimeSameToOpenTime.closeTime,
                        is_book: false
                    })
            }

            if (!startTimeSameToCloseTime && !endTimeSameToOpenTime) {
                await trx("party_room_open_hours")
                    .insert({
                        party_room_id: partyRoomId,
                        open_time: openTime,
                        close_time: closeTime,
                        is_book: false
                    })
            }

            await trx.commit()
            return []

        } catch (err) {
            await trx.rollback()
            throw err
        }
    }

    async checkIsBookingTime(id: number) {
        const hasBooking = await this.knex("party_room_open_hours")
            .where("id", id)
            .where("is_book", true)
            .first()

        if (!hasBooking) {
            return false
        }

        return true
    }

    async deletePartyRoomOpenTimeById(id: number) {
        await this.knex("party_room_open_hours")
            .where("id", id)
            .del()
    }

    async checkHasCopartnerAndNewCopartnerEail(email: string) {
        const hasNewCopartnersEmail = await this.knex("new_copartners")
            .where("email", email)
            .first()
        const hasCopartnersEmail = await this.knex("copartner_accounts")
            .where("email", email)
            .first()

        if (hasCopartnersEmail || hasNewCopartnersEmail) {
            return true
        }
        return false
    }

    async addNewCopartners(name: string, email: string, phoneNumber: number) {
        await this.knex("new_copartners")
            .insert({
                name,
                email,
                phone_number: phoneNumber,
                state: "未處理"
            })
    }

    async checkHasNewCopartnerEmail(email: string) {
        const hasNewCopartnersEmail = await this.knex("new_copartners")
            .where("email", email)
            .first()
        if (hasNewCopartnersEmail) {
            return true
        }
        return false
    }

    async checkHasCopartnerEmail(email: string) {
        const hasCopartnersEmail = await this.knex("copartner_accounts")
            .where("email", email)
            .first()
        if (hasCopartnersEmail) {
            return true
        }
        return false
    }

    async createCopartner(email: string) {
        const trx = await this.knex.transaction()

        try {

            const password = this.randomString(10)
            const hashPW = await hashPassword(password)

            const name = email.split("@")[0]

            await trx("copartner_accounts")
                .insert({
                    name,
                    email: email,
                    password: hashPW
                })

            if (process.env.SENDGRID_API_KEY) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            }

            const msg = {
                to: email,
                from: 'welcome@partybuildhk.com', // Use the email address or domain you verified above
                subject: 'Register in partybuildhk.com',
                text: `Welcome to partybuildhk.com. Your username is : ${email} and password is : ${password}`,
                html: `<> <h1>Welcome to partybuildhk.com.</h1> <p> Your username is : ${email} and password is : ${password}</p>`,
            };

            await sgMail.send(msg)

            await trx.commit()
        } catch (err) {
            await trx.rollback()
            throw err
        }

    }

    randomString(length: number) {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() *
                charactersLength)));
        }
        return result.join('');
    }
}