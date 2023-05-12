import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("party_rooms", (table) => {
        table.dropColumns('start_time')
        table.dropColumns('end_time')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("party_rooms", (table) => {
        table.time("start_time")
        table.time("end_time")
    })
}

