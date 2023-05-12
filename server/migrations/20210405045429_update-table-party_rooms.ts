import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("party_rooms", (table) => {
        table.string('min_number_of_consumers')
        table.string('price_of_overtime')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("party_rooms", (table) => {
        table.dropColumns('min_number_of_consumers')
        table.dropColumns('price_of_overtime')
    })
}

