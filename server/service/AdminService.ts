import { Knex } from "knex"

export class AdminService {
    constructor(private knex: Knex) { }

    async login(email: string) {
        const admin: {
            id: number
            email: string,
            password: string,
        } = await this.knex("admins")
            .select('id', 'email', 'password')
            .where({ email })
            .first()

        return admin
    }

    async getAdminDate(adminId: number) {
        const admin: {
            name: string
            email: string
        } = await this.knex("admins")
            .select(
                "name",
                "email"
            )
            .where("id", adminId)
            .first()

        return admin
    }

    async getAdminEmailById(id: number) {
        const admin: {
            email: string,
            id: number
        } = await this.knex("admins")
            .select("email", "id")
            .where({ id })
            .first()
        return admin
    }

    async getNewCopartner(pageNum: number) {
        const limit = 10
        const newCopartners: {
            id: number
            name: string
            email: string
            phoneNumber: string
            state: string
        }[] = await this.knex("new_copartners")
            .select(
                "id",
                "name",
                "email",
                { phoneNumber: "phone_number" },
                "state"
            )
            .limit(limit)
            .offset((limit * (pageNum - 1)))

        const num = await this.knex("new_copartners")
            .count("id")
            .first()
        let count
        if (num) {
            count = Number(num["count"])
        } else count = 0

        return {
            count,
            newCopartners
        }
    }

    async updateNewCopartnerStates(id: number, state: string) {
        await this.knex("new_copartners")
            .update({
                state
            })
            .where({ id })
    }

    async checkHasCopartnerByUserEmail(userEmail: string) {
        const copartner = await this.knex("copartner_accounts")
            .where("email", userEmail)
            .first()

        if (!copartner) {
            return false
        }

        return true
    }

    async registerPartyRoom(
        userEmail: string,
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
        const trx = await this.knex.transaction()
        try {
            const accountId = (await trx("copartner_accounts").select("id").where("email", userEmail).first())?.id

            const partyRoomId = (await trx("party_rooms")
                .insert({
                    name: storeName,
                    address,
                    district_id: districtId,
                    phone_number: contactNumber,
                    introduction,
                    account_id: accountId,
                    whatsapp,
                    area,
                    important_matter: importantMatter,
                    contact_person: contactPerson,
                    email,
                    max_number_of_people: maxPeople,
                    min_number_of_people: minPeople,
                    facilities_detail: facilitiesDetail,
                    min_number_of_consumers: 4,
                    price_of_overtime: 20
                })
                .returning("id"))[0]

            await trx("party_room_prices").insert({
                party_room_id: partyRoomId,
                start_time: "00:00",
                end_time: "06:00",
                weekday_price: 200,
                weekend_price: 300
            })

            await trx("party_room_prices").insert({
                party_room_id: partyRoomId,
                start_time: "06:00",
                end_time: "11:00",
                weekday_price: 200,
                weekend_price: 300
            })

            await trx("party_room_prices").insert({
                party_room_id: partyRoomId,
                start_time: "11:00",
                end_time: "00:00",
                weekday_price: 200,
                weekend_price: 300
            })

            if (facilities.length > 0) {
                await trx("party_room_facilities")
                    .insert(facilities.map(facility => {
                        return { party_room_id: partyRoomId, types_id: facility }
                    }))
            }

            await trx("party_room_images")
                .insert({
                    party_room_id: partyRoomId,
                    image
                })

            await trx.commit()

        } catch (err) {
            await trx.rollback()
            throw err
        }
    }

    async updatePartyRoom(
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

        await this.knex("party_room_images")
            .where("party_room_id", id)
            .del()

        await this.knex("party_room_images")
            .insert({
                party_room_id: id,
                image
            })
    }

    async getAllPartyRoom() {
        return await this.knex("party_rooms")
            .select(
                "id",
                "name"
            )
    }

    async adminGetPartyRoomById(id: number) {
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
            facilitiesDetail: string
            importantMatter: string
            contactPerson: string
            contactNumber: number
            whatsapp: number
            email: string,
            remark: string,
            facilities: Array<{
                id: number
                type: string
                isAvailable: boolean
            }>
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
}