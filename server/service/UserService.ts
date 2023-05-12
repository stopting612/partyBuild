import { Knex } from "knex"
import CryptoJS from "crypto-js"
import sgMail from "@sendgrid/mail"
import dotenv from "dotenv"
dotenv.config()
import { alcoholService, partyRoomService, restaurantService } from "../main"
import { hashPassword } from "../utils/hash"

export class UserService {
    constructor(private knex: Knex) { }

    async login(email: string) {
        const user: {
            id: number
            email: string,
            password: string,
        } = await this.knex("users")
            .select('id', 'email', 'password')
            .where({ email })
            .first()

        return user
    }

    async getUserEmailById(id: number) {
        const user: {
            email: string,
            id: number
        } = await this.knex("users")
            .select("email", "id")
            .where({ id })
            .first()
        return user
    }

    async checkEmailIsAvailable(email: string) {
        const user = await this.knex("users")
            .count("name")
            .where("email", email)
            .first()
        let count
        if (user) {
            count = user["count"]
        }

        return (Number(count) === 0)

    }

    async emailVerification(token: string) {
        const user: {
            username: string,
            email: string,
            password: string
        } = await this.knex("email_verification")
            .select(
                "username",
                "email",
                "password"
            )
            .where("verification_code", token)
            .first()
        if (!user) {
            return
        }
        const hasUser = await this.knex("users")
            .select("id")
            .where("email", user.email)
            .first()
        if (hasUser) {
            return
        }

        return user
    }

    async createUser(name: string, email: string, password: string) {
        password = await hashPassword(password)
        const newUserId = (await this.knex("users")
            .insert({
                name,
                email,
                password
            })
            .returning("id"))[0]
        return {
            id: newUserId,
            email
        }
    }

    async userRegister(username: string, password: string, email: string) {
        const hashName = CryptoJS.MD5(username);
        const hashEmail = CryptoJS.MD5(email);
        const hashDate = CryptoJS.MD5((new Date()).toString())
        const hashTEXT = CryptoJS.MD5("text")
        const verification_code = hashName.toString(CryptoJS.enc.Hex) + hashEmail.toString(CryptoJS.enc.Hex) + hashTEXT.toString(CryptoJS.enc.Hex) + hashDate.toString(CryptoJS.enc.Hex)

        if (process.env.SENDGRID_API_KEY) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        }

        await this.knex("email_verification")
            .insert({
                username,
                verification_code,
                email,
                password
            })

        const msg = {
            to: email,
            from: 'welcome@partybuildhk.com', // Use the email address or domain you verified above
            subject: 'Register in partybuildhk.com',
            text: `Welcome to partybuildhk.com. Click the link to verification email. https://partybuildhk.com/users/email-verification?token=${verification_code}`,
            html: `<> <h1>Welcome to partybuildhk.com.</h1> <h2>Click the link to verification email.</h2><p> https://partybuildhk.com/users/email-verification?token=${verification_code}</p>`,
        };

        await sgMail.send(msg)

    }

    async getUserNameAndPicture(id: number, type: string) {
        if (type === "user") {
            const user: {
                name: string,
                image: string
            } = await this.knex("users")
                .select(
                    "name",
                    { picture: "image" }
                )
                .where({ id })
                .first()
            return user
        }
        if (type === "admin") {
            const admin: {
                name: string,
                image: string
            } = await this.knex("admins")
                .select(
                    "name",
                    { picture: "image" }
                )
                .where({ id })
                .first()
            return admin
        }
        if (type === "copartner") {
            const admin: {
                name: string,
                image: string
            } = await this.knex("copartner_accounts")
                .select(
                    "name",
                    { picture: "image" }
                )
                .where({ id })
                .first()
            return admin
        }
        return
    }

    async addPartyRoomOrder(partyRoomId: number, shoppingBagId: number, numberOfPeople: number, date: string, startTime: string, endTime: string) {
        const trx = await this.knex.transaction()

        try {
            const price = Number((await partyRoomService.getPartyRoomPrice(partyRoomId, date, startTime, endTime, numberOfPeople)).price)
            const partyDate = new Date(date)
            await trx("party_room_orders")
                .insert({
                    party_id: shoppingBagId,
                    party_room_id: partyRoomId,
                    price,
                    number_of_people: numberOfPeople,
                    states: "待確認"
                })
            const address = (await trx("party_rooms").select("address").where({ id: partyRoomId }).first()).address
            const districtId = (await trx("party_rooms").select("district_id").where({ id: partyRoomId }).first()).district_id
            await trx("party")
                .update({
                    date: partyDate,
                    start_time: startTime,
                    end_time: endTime,
                    address,
                    district_id: districtId,
                    is_pay: false
                })
                .where("id", shoppingBagId)

            await trx.commit()
        } catch (err) {
            await trx.rollback()
            throw err
        }
    }

    async addAlcoholOrder(alcoholId: number, shoppingBagId: number, quantity: number) {
        const price = (await alcoholService.getAlcoholPrice(alcoholId, quantity)).price
        await this.knex("alcohol_orders")
            .insert({
                party_id: shoppingBagId,
                alcohol_id: alcoholId,
                quantity: quantity,
                price: price,
                states: "待確認"
            })
    }

    async addFoodOrder(menuId: number, shoppingBagId: number, shippingFeeId: number, quantity: number) {
        const price = (await this.knex("menus").select("price").where({ id: menuId }).first()).price * quantity
        await this.knex("food_orders")
            .insert({
                party_id: shoppingBagId,
                food_id: menuId,
                quantity: quantity,
                price: price,
                states: "待確認",
                shipping_fee_id: shippingFeeId
            })
    }

    async createNewShoppingBasket(
        name: string,
        userId: number,
        partyRoom?: {
            id: number
            numberOfPeople: number
            date: string
            startTime: string
            endTime: string
        },
        food?: Array<{
            id: number
            quantity: number
            shippingFeeId?: number
        }>,
        foodPerson?: number,
        alcohol?: Array<{
            id: number,
            quantity: number
        }>,
        alcoholPerson?: number
    ) {
        const trx = await this.knex.transaction()

        try {
            const id = (await trx("party")
                .insert({
                    name,
                    creator_id: userId,
                    is_pay: false,
                    number_of_party_room_order_people: 1,
                    number_of_alcohol_order_people: 1,
                    number_of_food_order_people: 1
                }).returning("id"))[0]

            if (partyRoom && partyRoom?.id) {
                const price = Number((await partyRoomService.getPartyRoomPrice(partyRoom.id, partyRoom.date, partyRoom.startTime, partyRoom.endTime, partyRoom.numberOfPeople)).price)

                const partyDate = new Date(partyRoom.date)
                const address = (await trx("party_rooms").select("address").where({ id: partyRoom.id }).first()).address

                const districtId = (await trx("party_rooms").select("district_id").where({ id: partyRoom.id }).first()).district_id

                await trx("party_room_orders")
                    .insert({
                        party_id: id,
                        party_room_id: partyRoom.id,
                        price,
                        number_of_people: partyRoom.numberOfPeople,
                        states: "待確認"
                    })
                await trx("party")
                    .update({
                        date: partyDate,
                        start_time: partyRoom.startTime,
                        end_time: partyRoom.endTime,
                        address,
                        district_id: districtId,
                        is_pay: false,
                        number_of_party_room_order_people: partyRoom.numberOfPeople
                    })
                    .where("id", id)
            }

            if (food) {
                for (const menu of food) {
                    const menuPrice = (await trx("menus").select("price").where({ id: menu.id }).first()).price * menu.quantity

                    const partyHongKongDistrict = (await trx("party")
                        .select("district_id")
                        .where("id", id)
                        .first()).district_id
                    if (partyHongKongDistrict) {
                        const partyHongKongArea = (await trx("hong_kong_districts")
                            .select("area_id")
                            .where("id", partyHongKongDistrict)
                            .first()).area_id
                        const newShippingFeeId = (await trx("restaurant_shipping_fee")
                            .select("id")
                            .where("hong_kong_area_id", partyHongKongArea)
                            .andWhere("menus_id", menu.id)
                            .first()).id
                        menu.shippingFeeId = newShippingFeeId
                    }

                    await trx("food_orders")
                        .insert({
                            party_id: id,
                            food_id: menu.id,
                            quantity: menu.quantity,
                            price: menuPrice,
                            states: "待確認",
                            shipping_fee_id: menu.shippingFeeId
                        })
                }
            }

            if (foodPerson) {
                await trx("party")
                    .update({
                        number_of_food_order_people: foodPerson
                    })
                    .where("id", id)
            }

            if (alcohol) {
                for (const wine of alcohol) {

                    const winePrice = (await trx("alcohols").select("price").where({ id: wine.id }).first()).price * wine.quantity

                    await trx("alcohol_orders")
                        .insert({
                            party_id: id,
                            alcohol_id: wine.id,
                            quantity: wine.quantity,
                            price: winePrice,
                            states: "待確認"
                        })
                }
            }

            if (alcoholPerson) {
                await trx("party")
                    .update({
                        number_of_alcohol_order_people: alcoholPerson
                    })
                    .where("id", id)
            }

            await trx.commit()

            return {
                shoppingBasket: {
                    id,
                    name
                }
            }
        } catch (err) {
            await trx.rollback()
            throw err
        }

    }

    async getUserShoppingBasket(pageNum: number, userId: number) {
        const shoppingBaskets: {
            id: number
            name: string
            date: Date | string
            startTime: Date | string
            endTime: Date | string
            image: string
        }[] = await this.knex("party")
            .select(
                "id",
                "name",
                "date",
                { startTime: "start_time" },
                { endTime: "end_time" }
            )
            .where("creator_id", userId)
            .andWhere("is_pay", false)
            .orderBy("date", "asc")

        for (const shoppingBasket of shoppingBaskets) {
            const partyRoomImage = (await this.knex("party")
                .select("party_room_images.image")
                .leftJoin("party_room_orders", "party_room_orders.party_id", "party.id")
                .leftJoin("party_rooms", "party_room_orders.party_room_id", "party_rooms.id")
                .leftJoin("party_room_images", "party_room_images.party_room_id", "party_rooms.id")
                .where("party.id", shoppingBasket.id)
                .first())?.image

            const alcoholImage = (await this.knex("party")
                .select("alcohols.image")
                .leftJoin("alcohol_orders", "alcohol_orders.party_id", "party.id")
                .leftJoin("alcohols", "alcohol_orders.alcohol_id", "alcohols.id")
                .where("party.id", shoppingBasket.id)
                .first())?.image

            const foodImage = (await this.knex("party")
                .select("menus.image")
                .leftJoin("food_orders", "food_orders.party_id", "party.id")
                .leftJoin("menus", "food_orders.food_id", "menus.id")
                .where("party.id", shoppingBasket.id)
                .first())?.image

            if (alcoholImage) {
                shoppingBasket.image = alcoholImage
            }
            if (foodImage) {
                shoppingBasket.image = foodImage
            }
            if (partyRoomImage) {
                shoppingBasket.image = partyRoomImage
            }
        }

        shoppingBaskets.map(shoppingBasket => {
            if (!shoppingBasket.endTime) {
                shoppingBasket.date = ""
                shoppingBasket.endTime = ""
                shoppingBasket.startTime = ""
            } else {
                const endTime = shoppingBasket.endTime?.toString().slice(0, 2)
                shoppingBasket.endTime = new Date(shoppingBasket.date)
                shoppingBasket.endTime.setHours(Number(endTime))
                shoppingBasket.endTime.setMinutes(0)
                shoppingBasket.endTime.setSeconds(0)
                shoppingBasket.endTime.setMilliseconds(0)
                const startTime = shoppingBasket.startTime?.toString().slice(0, 2)
                shoppingBasket.startTime = new Date(shoppingBasket.date)
                shoppingBasket.startTime.setHours(Number(startTime))
                shoppingBasket.startTime.setMinutes(0)
                shoppingBasket.startTime.setSeconds(0)
                shoppingBasket.startTime.setMilliseconds(0)
            }
            return shoppingBasket
        })

        const num = await this.knex("party")
            .count("id")
            .where("creator_id", userId)
            .andWhere("is_pay", false)
            .first()
        let count
        if (num) {
            count = Number(num["count"])
        } else count = 0

        return {
            count,
            shoppingBaskets
        }
    }

    async getUserShoppingBasketHistory(pageNum: number, userId: number) {
        const limit = 10
        const shoppingBaskets: {
            id: number
            name: string
            date: Date | string
            startTime: Date | string
            endTime: Date | string
        }[] = await this.knex("party")
            .select(
                "id",
                "name",
                "date",
                { startTime: "start_time" },
                { endTime: "end_time" }
            )
            .where("creator_id", userId)
            .andWhere("is_pay", true)
            .limit(limit)
            .offset((limit * (pageNum - 1)))
            .orderBy("date", "desc")

        shoppingBaskets.map(shoppingBasket => {
            if (!shoppingBasket.date) {
                shoppingBasket.date = ""
                shoppingBasket.endTime = ""
                shoppingBasket.startTime = ""
            } else {
                const endTime = shoppingBasket.endTime.toString().slice(0, 2)
                shoppingBasket.endTime = new Date(shoppingBasket.date)
                shoppingBasket.endTime.setHours(Number(endTime))
                shoppingBasket.endTime.setMinutes(0)
                shoppingBasket.endTime.setSeconds(0)
                shoppingBasket.endTime.setMilliseconds(0)
                const startTime = shoppingBasket.startTime.toString().slice(0, 2)
                shoppingBasket.startTime = new Date(shoppingBasket.date)
                shoppingBasket.startTime.setHours(Number(startTime))
                shoppingBasket.startTime.setMinutes(0)
                shoppingBasket.startTime.setSeconds(0)
                shoppingBasket.startTime.setMilliseconds(0)
            }
            return shoppingBasket
        })

        const num = await this.knex("party")
            .count("id")
            .where("creator_id", userId)
            .andWhere("is_pay", true)
            .first()
        let count
        if (num) {
            count = Number(num["count"])
        } else count = 0

        return {
            count,
            shoppingBaskets
        }
    }

    async checkIsShoppingBasketOwner(shoppingBasketId: number, userId: number) {
        const shoppingBasket = await this.knex("party")
            .where("id", shoppingBasketId)
            .andWhere("creator_id", userId)
            .first()

        if (!shoppingBasket) {
            return false
        }

        return true
    }

    async getUserShoppingBasketById(id: number) {
        const event: {
            name: string
            date: string,
            startTime: Date | string,
            endTime: Date | string,
            numberOfPeople: number,
            isPay: boolean,
            deliveryTime: string,
            deliveryDate: string,
            deliveryAddress: string,
            contactName: string,
            contactPhoneNumber: string,
        } = await this.knex("party")
            .select(
                "party.name",
                "party.date",
                { startTime: "party.start_time" },
                { endTime: "party.end_time" },
                { numberOfPeople: "party_room_orders.number_of_people" },
                { isPay: "party.is_pay" },
                { deliveryTime: "party.delivery_time" },
                { deliveryDate: "party.delivery_date" },
                { deliveryAddress: "party.delivery_address" },
            )
            .leftJoin("party_room_orders", "party_room_orders.party_id", "party.id")
            .where("party.id", id)
            .first()

        if (!event) {
            return
        }

        const contact: {
            contactName: string,
            contactPhoneNumber: string,
        } = await this.knex("creator_contact")
            .select(
                { contactName: "contact_name" },
                { contactPhoneNumber: "phone_number" }
            )
            .where("party_id", id)
            .first()

        if (contact?.contactName) {
            event.contactName = contact.contactName
            event.contactPhoneNumber = contact.contactPhoneNumber
        }

        const startTime = event.startTime as string
        const endTime = event.endTime as string

        if (event.startTime && event.endTime) {
            const endTime = event.endTime.toString().slice(0, 2)
            event.endTime = new Date(event.date)
            event.endTime.setHours(event.endTime.getHours() + 8)
            event.endTime.setUTCHours(Number(endTime) - 8)
            event.endTime.setMinutes(0)
            event.endTime.setSeconds(0)
            event.endTime.setMilliseconds(0)
            const startTime = event.startTime.toString().slice(0, 2)
            event.startTime = new Date(event.date)
            event.startTime.setHours(event.startTime.getHours() + 8)
            event.startTime.setUTCHours(Number(startTime) - 8)
            event.startTime.setMinutes(0)
            event.startTime.setSeconds(0)
            event.startTime.setMilliseconds(0)

        }

        if (!event.date) {
            event.date = "未定"
        }
        if (!event.startTime && !event.endTime) {
            event.startTime = "??:??"
            event.endTime = "??:??"
        }
        if (!event.numberOfPeople) {
            event.numberOfPeople = 1
        }

        let partyRoomOrders: {
            id: number,
            price: number,
            name: string,
            image: string,
            itemId: number,
            openTime: Array<string>
        } = await this.knex("party_room_orders")
            .select(
                "party_room_orders.id",
                "party_room_orders.price",
                "party_rooms.name",
                "party_room_images.image",
                { itemId: "party_rooms.id" }
            )
            .leftJoin("party_rooms", "party_room_orders.party_room_id", "party_rooms.id")
            .leftJoin("party_room_images", "party_room_images.party_room_id", "party_rooms.id")
            .where("party_room_orders.party_id", id)
            .first()

        if (partyRoomOrders) {
            partyRoomOrders.price = (await partyRoomService.getPartyRoomPrice(partyRoomOrders.itemId, event.date, startTime, endTime, event.numberOfPeople)).price

            partyRoomOrders.openTime = (await this.knex("party_room_open_hours")
                .where("party_room_id", partyRoomOrders.itemId)).map(partyRoom => partyRoom.open_time)
        }
        if (!partyRoomOrders) {
            partyRoomOrders = {
                id: 0,
                price: 0,
                name: "",
                image: "",
                itemId: 0,
                openTime: []
            }
        }

        const alcoholOrders: {
            id: number
            price: number
            quantity: number
            image: string
            name: string
            information: string,
            itemId: number
        }[] = await this.knex("alcohol_orders")
            .select(
                "alcohol_orders.id",
                "alcohol_orders.price",
                "alcohol_orders.quantity",
                "alcohols.image",
                "alcohols.name",
                { information: "alcohols.introduction" },
                { itemId: "alcohols.id" }
            )
            .leftJoin("alcohols", "alcohol_orders.alcohol_id", "alcohols.id")
            .where("alcohol_orders.party_id", id)

        alcoholOrders.map(async alcoholOrder => {
            alcoholOrder.price = (await alcoholService.getAlcoholPrice(alcoholOrder.itemId, alcoholOrder.quantity)).price
            return alcoholOrder
        })

        let foodOrders: {
            id: number
            image: string
            name: string
            price: number
            quantity: number
            district: string
            shippingFees: number,
            shippingFeesId: number,
            itemId: number
        }[]

        if (partyRoomOrders.id !== 0) {
            foodOrders = await this.knex("food_orders")
                .select(
                    "food_orders.id",
                    "menus.image",
                    "menus.name",
                    "food_orders.price",
                    "food_orders.quantity",
                    "hong_kong_districts.district",
                    { shippingFees: "restaurant_shipping_fee.price" },
                    { shippingFeesId: "restaurant_shipping_fee.id" },
                    { itemId: "menus.id" }
                )
                .leftJoin("party", "food_orders.party_id", "party.id")
                .leftJoin("hong_kong_districts", "party.district_id", "hong_kong_districts.id")
                .leftJoin("menus", "food_orders.food_id", "menus.id")
                .leftJoin("restaurant_shipping_fee", "restaurant_shipping_fee.menus_id", "menus.id")
                .where("food_orders.party_id", id)
                .whereRaw("restaurant_shipping_fee.hong_kong_area_id = hong_kong_districts.area_id")

        } else {
            foodOrders = await this.knex("food_orders")
                .select(
                    "food_orders.id",
                    "menus.image",
                    "menus.name",
                    "food_orders.price",
                    "food_orders.quantity",
                    "hong_kong_districts.district",
                    { shippingFees: "restaurant_shipping_fee.price" },
                    { shippingFeesId: "restaurant_shipping_fee.id" },
                    { itemId: "menus.id" }
                )
                .leftJoin("party", "food_orders.party_id", "party.id")
                .leftJoin("hong_kong_districts", "party.district_id", "hong_kong_districts.id")
                .leftJoin("menus", "food_orders.food_id", "menus.id")
                .leftJoin("restaurant_shipping_fee", "food_orders.shipping_fee_id", "restaurant_shipping_fee.id")
                .where("food_orders.party_id", id)
        }

        for (const foodOrder of foodOrders) {
            const price = await restaurantService.getMenuPrice(foodOrder.itemId, foodOrder.quantity, foodOrder.shippingFeesId)
            foodOrder.price = Number(price.price) + Number(price.shippingFee)
        }


        const calculatorOption: {
            numberOfPartyRoomOrderPeople: number
            numberOfAlcoholOrderPeople: number
            numberOffoodOrderPeople: number
            options: Array<{
                id: number
                name: string
                price: number
                numberOfPeople: number
                status: boolean
                // false
            }>
        } = await this.knex("party")
            .select(
                { numberOfPartyRoomOrderPeople: "number_of_party_room_order_people" },
                { numberOfAlcoholOrderPeople: "number_of_alcohol_order_people" },
                { numberOffoodOrderPeople: "number_of_food_order_people" }
            )
            .where("id", id)
            .first()

        const options: {
            id: number
            name: string
            price: number
            numberOfPeople: number
            status: boolean
        }[] = await this.knex("calculator_option")
            .select(
                "id",
                "name",
                "price",
                { numberOfPeople: "number_of_people" },
                "status"
            )
            .where("party_id", id)

        calculatorOption.options = options

        return {
            event,
            partyRoomOrders,
            alcoholOrders,
            foodOrders,
            calculatorOption
        }
    }

    async deleteShoppingBasketById(shoppingBasketId: number) {
        await this.knex("share_token")
            .where("party_id", shoppingBasketId)
            .del()
        await this.knex("party_room_bookings")
            .where("party_id", shoppingBasketId)
            .del()
        await this.knex("payment_token")
            .where("party_id", shoppingBasketId)
            .del()
        await this.knex("party_room_orders")
            .where("party_id", shoppingBasketId)
            .del()
        await this.knex("alcohol_orders")
            .where("party_id", shoppingBasketId)
            .del()
        await this.knex("food_orders")
            .where("party_id", shoppingBasketId)
            .del()
        await this.knex("calculator_option")
            .where("party_id", shoppingBasketId)
            .del()
        await this.knex("creator_contact")
            .where("party_id", shoppingBasketId)
            .del()
        await this.knex("party_room_ratings")
            .where("party_id", shoppingBasketId)
            .del()
        await this.knex("alcohol_ratings")
            .where("party_id", shoppingBasketId)
            .del()
        await this.knex("restaurant_ratings")
            .where("party_id", shoppingBasketId)
            .del()
        await this.knex("party")
            .where("id", shoppingBasketId)
            .del()
    }

    async deleteOrder(orderType: string, orderId: number) {
        if (orderType === "food") {
            await this.knex("food_orders").where("id", orderId).del()
        }
        if (orderType === "alcohol") {
            await this.knex("alcohol_orders").where("id", orderId).del()
        }
        if (orderType === "partyRoom") {
            const shoppingBagId = (await this.knex("party_room_orders").where("id", orderId).first())?.party_id
            await this.knex("party_room_orders").where("id", orderId).del()

            await this.knex("party")
                .update({
                    date: null,
                    start_time: null,
                    end_time: null
                })
                .where("id", shoppingBagId)
        }
    }

    async updatePartyDate(date: string, shoppingBasketId: number) {
        await this.knex("party")
            .update({
                date
            })
            .where("id", shoppingBasketId)
    }

    async updatePartyStartTime(startTime: string, shoppingBasketId: number) {
        const date = new Date(startTime)
        let hours = date.getUTCHours() + 8
        if (hours >= 24) {
            hours -= 24
        }

        if (hours > 9) {
            startTime = `${hours}:00`
        } else startTime = `0${hours}:00`

        await this.knex("party")
            .update({
                start_time: startTime
            })
            .where("id", shoppingBasketId)
    }

    async updatePartyEndTime(endTime: string, shoppingBasketId: number) {
        const date = new Date(endTime)
        let hours = date.getUTCHours() + 8
        if (hours >= 24) {
            hours -= 24
        }

        if (hours > 9) {
            endTime = `${hours}:00`
        } else endTime = `0${hours}:00`

        await this.knex("party")
            .update({
                end_time: endTime
            })
            .where("id", shoppingBasketId)
    }

    async getShoppingBasketPaymentById(id: number) {
        const shoppingBasket: {
            date: Date,
            startTime: string,
            endTime: string,
            districtId: number
            address: string
        } = await this.knex("party")
            .select(
                "date",
                { startTime: "start_time" },
                { endTime: "end_time" },
                { districtId: "district_id" },
                "address"
            )
            .where("id", id)
            .first()

        return shoppingBasket
    }

    async checkHasShoppingBasket(shoppingBasketId: number) {
        const hasShoppingBasket = await this.knex("party")
            .where("id", shoppingBasketId)
            .first()

        if (!hasShoppingBasket) {
            return false
        }

        return true
    }

    async checkShoppingBasketIsPay(shoppingBasketId: number) {
        const isPay = await this.knex("party")
            .where("id", shoppingBasketId)
            .andWhere("is_pay", true)
            .first()

        if (!isPay) {
            return false
        }

        return true
    }

    async checkPartyRoomHasOpen(shoppingBasketId: number) {
        const shoppingBasket = await this.getUserShoppingBasketById(shoppingBasketId)

        if (shoppingBasket?.partyRoomOrders.id === 0) {
            return true
        }

        const partyRoomId = shoppingBasket?.partyRoomOrders.itemId
        const startTime = new Date(shoppingBasket?.event.startTime as string)
        const endTime = new Date(shoppingBasket?.event.endTime as string)

        const hasOpen = await this.knex("party_room_open_hours")
            .where("party_room_id", partyRoomId)
            .andWhere("open_time", "<=", startTime)
            .andWhere("close_time", ">=", endTime)
            .first()

        if (!hasOpen) {
            return false
        }

        console.log()

        return true
    }

    async checkHasBooking(shoppingBasketId: number) {
        const shoppingBasket = await this.getUserShoppingBasketById(shoppingBasketId)

        if (shoppingBasket?.partyRoomOrders.id === 0) {
            return false
        }

        const partyRoomId = shoppingBasket?.partyRoomOrders.itemId
        const startTime = shoppingBasket?.event.startTime as string
        const endTime = shoppingBasket?.event.endTime as string

        const hasBooking = await this.knex("party_room_bookings")
            .where("party_room_id", partyRoomId)
            .andWhere("booking_start_time", "<=", startTime)
            .andWhere("booking_end_time", ">", startTime)
            .union([
                this.knex("party_room_bookings")
                    .where("party_room_id", partyRoomId)
                    .andWhere("booking_end_time", ">=", endTime)
                    .andWhere("booking_start_time", "<", endTime),
                this.knex("party_room_bookings")
                    .where("party_room_id", partyRoomId)
                    .andWhere("booking_start_time", ">=", startTime)
                    .andWhere("booking_end_time", "<=", endTime)
            ])
            .first()

        if (!hasBooking) {
            return false
        }

        return true

    }

    async pay(contactName: string, phoneNumber: number, shoppingBasketId: number, date: string, startTime: string, address: string, specialRequirement: string, userId: number) {
        const trx = await this.knex.transaction()

        try {
            const newDate = new Date(date)
            await trx("party")
                .update({
                    delivery_date: newDate,
                    delivery_time: startTime,
                    delivery_address: address
                })
                .where("id", shoppingBasketId)

            const hasCreatorContact = await trx("creator_contact")
                .where("user_id", userId)
                .andWhere("party_id", shoppingBasketId)
                .first()

            if (hasCreatorContact) {
                await trx("creator_contact")
                    .update({
                        phone_number: phoneNumber,
                        contact_name: contactName
                    })
                    .where({
                        user_id: userId,
                        party_id: shoppingBasketId,
                    })
            } else {
                await trx("creator_contact")
                    .insert({
                        user_id: userId,
                        party_id: shoppingBasketId,
                        phone_number: phoneNumber,
                        contact_name: contactName
                    })
            }

            await trx("party_room_orders")
                .update({
                    special_requirement: specialRequirement
                })
                .where("party_id", shoppingBasketId)

            const stripe = require('stripe')('sk_test_51IfgPRFp69OakVIR6GRVjtKTFRIlOjVO7vZDWHHYfJRDaRRb2Ik4n2YaJHGRdXYdYbB6CxvIxnTj6cpiH5jalJ0d00bLdNrXc0')

            const items = []

            const shoppingBasket = await this.getUserShoppingBasketById(shoppingBasketId)

            if (shoppingBasket?.partyRoomOrders.id !== 0) {
                items.push({
                    price_data: {
                        currency: 'hkd',
                        product_data: {
                            name: shoppingBasket?.partyRoomOrders.name,
                        },
                        unit_amount: Math.ceil(Number(shoppingBasket?.partyRoomOrders.price)) * 100,
                    },
                    quantity: 1,
                })
            }

            if (shoppingBasket) {
                for (const foodOrder of shoppingBasket.foodOrders) {
                    items.push({
                        price_data: {
                            currency: 'hkd',
                            product_data: {
                                name: foodOrder.name,
                            },
                            unit_amount: Math.ceil(foodOrder.price / foodOrder.quantity) * 100,
                        },
                        quantity: foodOrder.quantity,
                    })
                }

                for (const alcoholOrders of shoppingBasket.alcoholOrders) {
                    items.push({
                        price_data: {
                            currency: 'hkd',
                            product_data: {
                                name: alcoholOrders.name,
                            },
                            unit_amount: Math.ceil(alcoholOrders.price / alcoholOrders.quantity) * 100,
                        },
                        quantity: alcoholOrders.quantity,
                    })
                }
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: items,
                mode: 'payment',
                success_url: `${process.env.CORS_HOST}/orderdetail/${shoppingBasketId}`,
                cancel_url: `${process.env.CORS_HOST}/orderdetail/${shoppingBasketId}`,
            });

            if (session) {
                await trx("payment_token")
                    .insert({
                        token: session.id,
                        party_id: shoppingBasketId
                    })
            }

            await trx.commit()

            return { id: session.id }

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

    async checkHasPaymentToken(token: string) {
        const partyId = (await this.knex("payment_token").select({ partyId: "party_id" }).where("token", token).first())?.partyId
        if (!partyId) {
            return false
        }
        return true
    }

    async paymentSuccess(token: string) {
        const trx = await this.knex.transaction()

        try {
            const partyId = (await trx("payment_token").select({ partyId: "party_id" }).where("token", token).first()).partyId

            await trx("payment_token").where("party_id", partyId).del()

            await trx("party")
                .update({
                    is_pay: true
                })
                .where("id", partyId)

            const shoppingBasket = await this.getUserShoppingBasketById(partyId)

            const partyRoomId = (await trx("party_room_orders").where("id", shoppingBasket?.partyRoomOrders.id).first())?.party_room_id

            if (partyRoomId) {
                if (shoppingBasket?.partyRoomOrders.id !== 0) {
                    await trx("party_room_bookings")
                        .insert({
                            party_room_id: partyRoomId,
                            booking_start_time: shoppingBasket?.event.startTime,
                            booking_end_time: shoppingBasket?.event.endTime,
                            party_id: partyId
                        })

                    await trx("party_room_orders")
                        .update({
                            price: shoppingBasket?.partyRoomOrders.price
                        })
                        .where("id", shoppingBasket?.partyRoomOrders.id)
                }
            }

            if (shoppingBasket) {
                if (shoppingBasket.foodOrders.length > 1) {
                    for (const foodOrder of shoppingBasket.foodOrders) {
                        await trx("food_orders")
                            .update({
                                price: foodOrder.price
                            })
                            .where("id", foodOrder.id)
                    }
                }
            }

            if (shoppingBasket) {
                if (shoppingBasket.alcoholOrders.length > 1) {
                    for (const alcoholOrder of shoppingBasket.alcoholOrders) {
                        await trx("alcohol_orders")
                            .update({
                                price: alcoholOrder.price
                            })
                            .where("id", alcoholOrder.id)
                    }
                }
            }

            if (process.env.SENDGRID_API_KEY) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            }

            if (partyRoomId) {
                const email = (await trx("copartner_accounts")
                    .select(
                        "copartner_accounts.email",
                    )
                    .leftJoin("party_rooms", "party_rooms.account_id", "copartner_accounts.id")
                    .where("party_rooms.id", partyRoomId)
                    .first()).email

                const msg = {
                    to: email,
                    from: 'welcome@partybuildhk.com', // Use the email address or domain you verified above
                    subject: 'New Order',
                    text: `You get a new order.`,
                    html: `<> <h1>You get a new order. </h1>`,
                };

                await sgMail.send(msg)
            }

            await trx.commit()
        } catch (err) {
            await trx.rollback()
            throw err
        }
    }

    async getCalculatorOptionById(id: number) {
        const calculatorOption = await this.knex("calculator_option")
            .where("id", id)
            .first()
        return calculatorOption;
    }

    async createNewCalculatorOption(shoppingBasketId: number, name: string, price: string) {
        const id = (await this.knex("calculator_option")
            .insert({
                party_id: shoppingBasketId,
                name,
                price,
                number_of_people: 1
            })
            .returning("id"))[0]
        return {
            id,
            name,
            price,
            status: false,
            numberOfPeople: 1
        }
    }

    async updateCalculatorOption(
        shoppingBasketId: number,
        calculatorData: {
            numberOfPartyRoomOrderPeople: number
            numberOfAlcoholOrderPeople: number
            numberOffoodOrderPeople: number
            options: Array<{
                id: number
                name: string
                price: number
                numberOfPeople: number
                status: boolean
                // false
            }>
        }
    ) {
        const trx = await this.knex.transaction()

        try {
            await trx("party")
                .update({
                    number_of_party_room_order_people: calculatorData.numberOfPartyRoomOrderPeople,
                    number_of_alcohol_order_people: calculatorData.numberOfAlcoholOrderPeople,
                    number_of_food_order_people: calculatorData.numberOffoodOrderPeople
                })
                .where("id", shoppingBasketId)

            await trx("calculator_option")
                .where("party_id", shoppingBasketId)
                .del()

            for (const option of calculatorData.options) {
                await trx("calculator_option")
                    .insert({
                        name: option.name,
                        price: option.price,
                        number_of_people: option.numberOfPeople,
                        status: option.status,
                        party_id: shoppingBasketId
                    })
            }

            await trx.commit()
        } catch (err) {
            await trx.rollback()
            throw err
        }
    }

    async deleteCalculatorOption(id: number) {
        await this.knex("calculator_option")
            .where("id", id)
            .del()
    }

    async getHistoryOrder(shoppingBasketId: number, userId: number) {
        const food = []
        const foodOrders: {
            id: number
            name: string
        }[] = await this.knex("food_orders")
            .select(
                "menus.name",
                "menus.id"
            )
            .leftJoin("menus", "food_orders.food_id", "menus.id")
            .groupBy(
                "menus.name",
                "menus.id"
            )
            .where("food_orders.party_id", shoppingBasketId)
        for (const foodOrder of foodOrders) {
            let rating: {
                rating: number,
                comment: string
            } = await this.knex("restaurant_ratings")
                .select(
                    "rating",
                    "comment"
                )
                .where("user_id", userId)
                .andWhere("menus_id", foodOrder.id)
                .andWhere("party_id", shoppingBasketId)
                .first()
            if (!rating) {
                rating = {
                    rating: 1,
                    comment: ""
                }
            }
            food.push({
                id: foodOrder.id,
                name: foodOrder.name,
                rating: rating.rating,
                comment: rating.comment,
                shoppingBasketId
            })
        }

        const alcohol = []
        const alcoholOrders: {
            id: number
            name: string
        }[] = await this.knex("alcohol_orders")
            .select(
                "alcohols.name",
                "alcohols.id"
            )
            .groupBy(
                "alcohols.name",
                "alcohols.id"
            )
            .leftJoin("alcohols", "alcohol_orders.alcohol_id", "alcohols.id")
            .where("alcohol_orders.party_id", shoppingBasketId)
        for (const alcoholOrder of alcoholOrders) {
            let rating: {
                rating: number,
                comment: string
            } = await this.knex("alcohol_ratings")
                .select(
                    "rating",
                    "comment"
                )
                .where("user_id", userId)
                .andWhere("alcohol_id", alcoholOrder.id)
                .andWhere("party_id", shoppingBasketId)
                .first()
            if (!rating) {
                rating = {
                    rating: 1,
                    comment: ""
                }
            }
            alcohol.push({
                id: alcoholOrder.id,
                name: alcoholOrder.name,
                rating: rating.rating,
                comment: rating.comment,
                shoppingBasketId
            })
        }

        let partyRoom
        const partyRoomOrders: {
            id: number
            name: string
        }[] = await this.knex("party_room_orders")
            .select(
                "party_rooms.name",
                "party_rooms.id"
            )
            .leftJoin("party_rooms", "party_room_orders.party_room_id", "party_rooms.id")
            .where("party_room_orders.party_id", shoppingBasketId)
        for (const partyRoomOrder of partyRoomOrders) {
            let rating: {
                rating: number,
                comment: string
            } = await this.knex("party_room_ratings")
                .select(
                    "rating",
                    "comment"
                )
                .where("user_id", userId)
                .andWhere("party_room_id", partyRoomOrder.id)
                .andWhere("party_id", shoppingBasketId)
                .first()
            if (!rating) {
                rating = {
                    rating: 1,
                    comment: ""
                }
            }
            partyRoom = {
                id: partyRoomOrder.id,
                name: partyRoomOrder.name,
                rating: rating.rating,
                comment: rating.comment,
                shoppingBasketId
            }
        }

        return {
            partyRoom,
            alcohols: alcohol,
            foods: food
        }
    }

    async addUserRating(
        partyRoom: {
            id: number
            rating: number,
            comment: string,
            shoppingBasketId: number
        },
        alcohols: Array<{
            id: number
            name: string
            rating: number,
            comment: string,
            shoppingBasketId: number
        }>,
        foods: Array<{
            id: number
            name: string
            rating: number,
            comment: string,
            shoppingBasketId: number
        }>,
        userId: number
    ) {
        const trx = await this.knex.transaction()

        try {
            const partyRoomHasRating = await trx("party_room_ratings")
                .where("party_id", partyRoom.shoppingBasketId)
                .andWhere("user_id", userId)
                .andWhere("party_room_id", partyRoom.id)
                .first()
            if (partyRoomHasRating) {
                await trx("party_room_ratings")
                    .update({
                        comment: partyRoom.comment,
                        rating: partyRoom.rating,
                    })
                    .where("party_id", partyRoom.shoppingBasketId)
                    .andWhere("user_id", userId)
                    .andWhere("party_room_id", partyRoom.id)
            } else {
                await trx("party_room_ratings")
                    .insert({
                        party_room_id: partyRoom.id,
                        user_id: userId,
                        comment: partyRoom.comment,
                        rating: partyRoom.rating,
                        party_id: partyRoom.shoppingBasketId
                    })
            }

            for (let alcohol of alcohols) {
                const alcoholHasRating = await trx("alcohol_ratings")
                    .where("party_id", alcohol.shoppingBasketId)
                    .andWhere("user_id", userId)
                    .andWhere("alcohol_id", alcohol.id)
                    .first()
                if (alcoholHasRating) {
                    await trx("alcohol_ratings")
                        .update({
                            comment: alcohol.comment,
                            rating: alcohol.rating,
                        })
                        .where("party_id", alcohol.shoppingBasketId)
                        .andWhere("user_id", userId)
                        .andWhere("alcohol_id", alcohol.id)
                } else {
                    await trx("alcohol_ratings")
                        .insert({
                            alcohol_id: alcohol.id,
                            user_id: userId,
                            comment: alcohol.comment,
                            rating: alcohol.rating,
                            party_id: alcohol.shoppingBasketId
                        })
                }
            }

            for (const food of foods) {
                const foodHasRating = await trx("restaurant_ratings")
                    .where("party_id", food.shoppingBasketId)
                    .andWhere("user_id", userId)
                    .andWhere("menus_id", food.id)
                    .first()
                if (foodHasRating) {
                    await trx("restaurant_ratings")
                        .update({
                            comment: food.comment,
                            rating: food.rating,
                        })
                        .where("party_id", food.shoppingBasketId)
                        .andWhere("user_id", userId)
                        .andWhere("menus_id", food.id)
                } else {
                    await trx("restaurant_ratings")
                        .insert({
                            menus_id: food.id,
                            user_id: userId,
                            comment: food.comment,
                            rating: food.rating,
                            party_id: food.shoppingBasketId
                        })
                }
            }

            await trx.commit()
        } catch (err) {
            await trx.rollback()
            throw err
        }
    }

    async getUserFavorite(userId: number) {
        const partyRooms: Array<{
            id: number
            image: string
            name: string
            district: string
            numberOfRating: string
            avgRating: string
            price: string
            isFavorite: boolean
        }> = await this.knex("party_rooms")
            .select(
                "party_rooms.id",
                "party_room_images.image",
                "party_rooms.name",
                "hong_kong_districts.district"
            )
            .rightJoin("party_room_images", "party_rooms.id", "party_room_images.party_room_id")
            .rightJoin("hong_kong_districts", "party_rooms.district_id", "hong_kong_districts.id")
            .rightJoin("user_favorite_party_rooms", "user_favorite_party_rooms.party_room_id", "party_rooms.id")
            .where("user_favorite_party_rooms.user_id", userId)

        for (const partyRoom of partyRooms) {
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

        const menus: Array<{
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            price: string
            shippingFree: boolean
            isFavorite: boolean
        }> = await this.knex("menus")
            .select(
                "menus.id",
                "menus.image",
                "menus.name",
                "menus.price"
            )
            .leftJoin("user_favorite_menu", "user_favorite_menu.menu_id", "menus.id")
            .where("user_favorite_menu.user_id", userId)

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

            if (userId) {
                const hasFavorite = await this.knex("user_favorite_menu").where("user_id", userId).andWhere("menu_id", menu.id).first()
                if (hasFavorite) {
                    menu["isFavorite"] = true
                } else menu["isFavorite"] = false
            } else {
                menu["isFavorite"] = false
            }

        }

        const alcohols: Array<{
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            price: string
            shippingFree: boolean
            isFavorite: boolean
        }> = await this.knex("alcohols")
            .select(
                "alcohols.id",
                "alcohols.image",
                "alcohols.name",
                "alcohols.pack",
                { averagePrice: "alcohols.average_price" }
            )
            .leftJoin("user_favorite_alcohols", "user_favorite_alcohols.alcohol_id", "alcohols.id")
            .where("user_favorite_alcohols.user_id", userId)

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

            if (userId) {
                const hasFavorite = await this.knex("user_favorite_alcohols").where("user_id", userId).andWhere("alcohol_id", alcohol.id).first()
                if (hasFavorite) {
                    alcohol.isFavorite = true
                } else alcohol.isFavorite = false
            } else {
                alcohol.isFavorite = false
            }
        }

        return {
            partyRoom: partyRooms,
            foodList: menus,
            alcoholList: alcohols
        }
    }

    async createNewUserFavorite(type: string, id: number, userId: number) {
        if (type === "food") {
            const hasAdd = await this.knex("user_favorite_menu").where({
                user_id: userId,
                menu_id: id
            }).first()
            if (hasAdd) {
                return
            }

            await this.knex("user_favorite_menu")
                .insert({
                    user_id: userId,
                    menu_id: id
                })
        }

        if (type === "alcohol") {
            const hasAdd = await this.knex("user_favorite_alcohols").where({
                user_id: userId,
                alcohol_id: id
            }).first()
            if (hasAdd) {
                return
            }

            await this.knex("user_favorite_alcohols")
                .insert({
                    user_id: userId,
                    alcohol_id: id
                })
        }

        if (type === "partyRoom") {
            const hasAdd = await this.knex("user_favorite_party_rooms").where({
                user_id: userId,
                party_room_id: id
            }).first()
            if (hasAdd) {
                return
            }

            await this.knex("user_favorite_party_rooms")
                .insert({
                    user_id: userId,
                    party_room_id: id
                })
        }
    }

    async deleteUserFavorite(type: string, id: number, userId: number) {
        if (type === "food") {
            await this.knex("user_favorite_menu")
                .where({
                    user_id: userId,
                    menu_id: id
                })
                .del()
        }

        if (type === "alcohol") {
            await this.knex("user_favorite_alcohols")
                .where({
                    user_id: userId,
                    alcohol_id: id
                })
                .del()
        }

        if (type === "partyRoom") {
            await this.knex("user_favorite_party_rooms")
                .where({
                    user_id: userId,
                    party_room_id: id
                })
                .del()
        }
    }

    async getShareLine(shoppingBasketId: number) {
        function makeid(length: number) {
            var result = [];
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result.push(characters.charAt(Math.floor(Math.random() *
                    charactersLength)));
            }
            return result.join('');
        }

        let token = (await this.knex("share_token")
            .select("token")
            .where("party_id", shoppingBasketId)
            .first())?.token

        if (!token) {
            token = "ZZZM1tLjPlszfri1u7jBTK1QTRxKBvMBFDiid8oE"
            let hasToken = await this.knex("share_token")
                .where("token", token)
                .first()

            while (hasToken) {
                token = makeid(40)
                hasToken = await this.knex("share_token")
                    .where("token", token)
                    .first()
            }

            await this.knex("share_token")
                .insert({
                    party_id: shoppingBasketId,
                    token
                })
        }

        return { token }
    }

    async getSharePage(token: string) {
        const shoppingBasketId = (await this.knex("share_token")
            .select(
                { partyId: "party_id" }
            )
            .where("token", token)
            .first())?.partyId

        if (!shoppingBasketId) {
            return
        }

        return this.getUserShoppingBasketById(shoppingBasketId)
    }

    async getUserDate(userId: number) {
        const user: {
            name: string
            email: string
        } = await this.knex("users")
            .select(
                "name",
                "email"
            )
            .where("id", userId)
            .first()

        return user
    }

    async updateProfileDate(userId: number, adminId: number, copartnerId: number, name: string, password: string, image: string) {
        if (userId) {
            password = await hashPassword(password)

            if (image) {
                await this.knex("users")
                    .update({
                        name,
                        password,
                        image
                    })
                    .where("id", userId)
            } else {
                await this.knex("users")
                    .update({
                        name,
                        password
                    })
                    .where("id", userId)
            }
        }
        if (adminId) {
            password = await hashPassword(password)

            if (image) {
                await this.knex("admins")
                    .update({
                        name,
                        password,
                        image
                    })
                    .where("id", adminId)
            } else {
                await this.knex("admins")
                    .update({
                        name,
                        password
                    })
                    .where("id", adminId)

            }
        }
        if (copartnerId) {
            password = await hashPassword(password)
            if (image) {
                await this.knex("copartner_accounts")
                    .update({
                        name,
                        password,
                        image
                    })
                    .where("id", copartnerId)
            } else {
                await this.knex("copartner_accounts")
                    .update({
                        name,
                        password,
                        image
                    })
                    .where("id", copartnerId)

            }
        }
    }
}
