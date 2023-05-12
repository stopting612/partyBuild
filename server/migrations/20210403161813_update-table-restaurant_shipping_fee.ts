import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("restaurant_shipping_fee", (table) => {
        table.dropColumns('restaurant_id')
        table.integer("menus_id")
        table.foreign('menus_id').references('menus.id');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("restaurant_shipping_fee", (table) => {
        table.dropColumns('menus_id')
        table.integer("restaurant_id")
        table.foreign('restaurant_id').references('restaurants.id');
    })
}

