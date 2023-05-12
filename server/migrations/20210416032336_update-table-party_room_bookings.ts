import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("party_room_bookings", (table) => {
        table.integer('party_id')
        table.foreign('party_id').references('party.id');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("party_room_bookings", (table) => {
        table.dropColumns('party_id')
    })
}

