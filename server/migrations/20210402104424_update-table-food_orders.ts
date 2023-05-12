import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("food_orders", (table) => {
        table.dropColumns('state')
        table.string("states")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("food_orders", (table) => {
        table.dropColumns('states')
        table.string("state")
    })
}

