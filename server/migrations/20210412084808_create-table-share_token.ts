import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("share_token", (table) => {
        table.increments();
        table.integer("party_id")
        table.foreign('party_id').references('party.id');
        table.string("token")
        table.timestamps(false, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('share_token');
}

