import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("creator_contact", (table) => {
        table.integer('phone_number')
        table.string('contact_name')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("creator_contact", (table) => {
        table.dropColumns('phone_number')
        table.dropColumns('contact_name')
    })
}

