import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("calculator_option", (table) => {
        table.increments();
        table.string("name")
        table.integer("price")
        table.integer("number_of_people")
        table.integer("party_id")
        table.foreign('party_id').references('party.id');
        table.timestamps(false, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('calculator_option');
}

