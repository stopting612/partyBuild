import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("users", (table) => {
        table.string('image')
        table.dropColumns('email_check')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("users", (table) => {
        table.dropColumns('image')
        table.string('email_check')
    })
}

