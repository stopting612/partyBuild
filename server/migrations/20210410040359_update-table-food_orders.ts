import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("food_orders", (table) => {
        table.integer('shipping_fee_id')
        table.foreign('shipping_fee_id').references('restaurant_shipping_fee.id');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("food_orders", (table) => {
        table.dropColumns('shipping_fee_id')
    })
}

