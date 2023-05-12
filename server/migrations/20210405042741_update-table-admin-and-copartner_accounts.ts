import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("admins", (table) => {
        table.string('email')
        table.string('image')
    })
    await knex.schema.table("copartner_accounts", (table) => {
        table.string('name')
        table.string('image')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("admins", (table) => {
        table.dropColumns('email')
        table.dropColumns('image')
    })
    await knex.schema.table("copartner_accounts", (table) => {
        table.dropColumns('name')
        table.dropColumns('image')
    })
}

