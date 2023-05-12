import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("alcohols", (table) => {
        table.decimal("average_price", 6, 1).alter()
        table.decimal("price", 6, 1).alter()
    })

    await knex.schema.alterTable("menus", (table) => {
        table.decimal("price", 6, 1).alter()
    })

    await knex.schema.alterTable("food_orders", (table) => {
        table.decimal("price", 6, 1).alter()
    })

    await knex.schema.alterTable("restaurant_shipping_fee", (table) => {
        table.decimal("price", 6, 1).alter()
    })

    await knex.schema.alterTable("alcohol_orders", (table) => {
        table.decimal("price", 6, 1).alter()
    })

    await knex.schema.alterTable("party_room_prices", (table) => {
        table.decimal("weekday_price", 6, 1).alter()
        table.decimal("weekend_price", 6, 1).alter()
    })

    await knex.schema.alterTable("party_room_orders", (table) => {
        table.decimal("price", 6, 1).alter()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("party_room_orders", (table) => {
        table.integer("price").alter()
    })

    await knex.schema.alterTable("party_room_prices", (table) => {
        table.integer("weekday_price").alter()
        table.integer("weekend_price").alter()
    })

    await knex.schema.alterTable("alcohol_orders", (table) => {
        table.integer("price").alter()
    })
    
    await knex.schema.alterTable("restaurant_shipping_fee", (table) => {
        table.integer("price").alter()
    })
    
    await knex.schema.alterTable("food_orders", (table) => {
        table.integer("price").alter()
    })
    
    await knex.schema.alterTable("menus", (table) => {
        table.integer("price").alter()
    })

    await knex.schema.alterTable("alcohols", (table) => {
        table.integer("average_price").alter()
        table.integer("price").alter()
    })
}

