import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

    // party_room_open_hours ##
    const partyRooms = await knex("party_rooms")

    for (let partyRoom of partyRooms) {
        const party_room_id = partyRoom.id
        let open_time = new Date();
        open_time.setDate(open_time.getDate() - 8)
        open_time.setUTCHours(10 - 8)
        open_time.setMinutes(0)
        open_time.setSeconds(0)
        open_time.setMilliseconds(0)
        let close_time = new Date()
        close_time.setDate(close_time.getDate() - 8)
        close_time.setUTCHours(22 - 8)
        close_time.setMinutes(0)
        close_time.setSeconds(0)
        close_time.setMilliseconds(0)

        for (let i = 0; i < 100; i++) {
            open_time.setDate(open_time.getDate() + 1)
            close_time.setDate(close_time.getDate() + 1)
            await knex("party_room_open_hours").insert({
                party_room_id,
                open_time,
                close_time,
                is_book: false
            })
        }

    }

};
