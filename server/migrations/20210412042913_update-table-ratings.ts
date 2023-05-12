import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("restaurant_ratings", (table) => {
        table.integer('party_id')
        table.foreign('party_id').references('party.id');
    })
    await knex.schema.table("alcohol_ratings", (table) => {
        table.integer('party_id')
        table.foreign('party_id').references('party.id');
    })
    await knex.schema.table("party_room_ratings", (table) => {
        table.integer('party_id')
        table.foreign('party_id').references('party.id');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("restaurant_ratings", (table) => {
        table.dropColumns('party_id')
    })
    await knex.schema.table("alcohol_ratings", (table) => {
        table.dropColumns('party_id')
    })
    await knex.schema.table("party_room_ratings", (table) => {
        table.dropColumns('party_id')
    })
}

