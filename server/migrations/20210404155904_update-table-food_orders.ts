import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("food_orders", (table) => {
        table.integer('food_id')
        table.foreign('food_id').references('menus.id');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("food_orders", (table) => {
        table.dropColumns('food_id')
    })
}

