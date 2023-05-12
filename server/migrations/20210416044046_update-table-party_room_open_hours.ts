import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("party_room_open_hours", (table) => {
        table.boolean('is_book')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("party_room_open_hours", (table) => {
        table.dropColumns('is_book')
    })
}


