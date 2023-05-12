import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("party", (table) => {
        table.integer('number_of_party_room_order_people')
        table.integer('number_of_alcohol_order_people')
        table.integer('number_of_food_order_people')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("party", (table) => {
        table.dropColumns('number_of_party_room_order_people')
        table.dropColumns('number_of_alcohol_order_people')
        table.dropColumns('number_of_food_order_people')
    })
}

