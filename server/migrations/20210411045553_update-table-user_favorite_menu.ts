import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("user_favorite_menu", (table) => {
        table.dropColumns('restaurant_id')
        table.integer('menu_id')
        table.foreign('menu_id').references('menus.id');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("user_favorite_menu", (table) => {
        table.dropColumns('menu_id')
        table.integer('restaurant_id')
        table.foreign('restaurant_id').references('restaurants.id');
    })
}

