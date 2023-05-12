import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("calculator_option", (table) => {
        table.boolean('status').defaultTo(false)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("calculator_option", (table) => {
        table.dropColumns('status')
    })
}

