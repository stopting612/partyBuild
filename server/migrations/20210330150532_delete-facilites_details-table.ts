import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.dropTable('facilities_details');

    await knex.schema.table('party_rooms', (table) => {
        table.text('facilities_detail')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('party_rooms', (table) => {
        table.dropColumns('facilities_detail')
    })

    await knex.schema.createTable("facilities_details", (table) => {
        table.increments();
        table.integer("party_room_id")
        table.foreign('party_room_id').references('party_rooms.id');
        table.text("detail")
        table.timestamps(false, true)
    })
}

