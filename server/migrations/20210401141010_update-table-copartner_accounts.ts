import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("copartner_accounts", (table) => {
        table.dropColumns('name')
        table.string("email")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("copartner_accounts", (table) => {
        table.dropColumns('email')
        table.string("name")
    })
}

