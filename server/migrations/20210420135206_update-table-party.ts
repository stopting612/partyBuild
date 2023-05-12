import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("party", (table) => {
        table.string('delivery_time')
        table.string('delivery_date')
        table.text('delivery_address')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("party", (table) => {
        table.dropColumns('delivery_time')
        table.dropColumns('delivery_date')
        table.dropColumns('delivery_address')
    })
}

