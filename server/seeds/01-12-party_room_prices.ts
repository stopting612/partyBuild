import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

    // party_room_prices ##

    const partyRooms = await knex("party_rooms")

    for (let partyRoom of partyRooms) {
        const party_room_id = partyRoom.id
        const partyRoomPrice = 90 + Math.floor(Math.random() * 10)
        const priceRange = Math.floor(Math.random() * 10)
        const weekendPrice = Math.floor(Math.random() * 10)

        if (partyRoom.id === 1) {
            continue
        }

        await knex("party_room_prices").insert({
            party_room_id,
            start_time: "00:00",
            end_time: "06:00",
            weekday_price: partyRoomPrice + priceRange,
            weekend_price: partyRoomPrice + priceRange + weekendPrice
        })

        await knex("party_room_prices").insert({
            party_room_id,
            start_time: "06:00",
            end_time: "11:00",
            weekday_price: partyRoomPrice - priceRange,
            weekend_price: partyRoomPrice - priceRange + weekendPrice
        })

        await knex("party_room_prices").insert({
            party_room_id,
            start_time: "11:00",
            end_time: "00:00",
            weekday_price: partyRoomPrice,
            weekend_price: partyRoomPrice + weekendPrice
        })
    }

};
