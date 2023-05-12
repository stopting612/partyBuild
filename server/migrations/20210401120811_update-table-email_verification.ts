import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("email_verification", (table) => {
        table.dropColumns('user_id')
        table.string("username")
        table.string("password")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("email_verification", (table) => {
        table.dropColumns('username')
        table.dropColumns('password')
        table.string("user_id")
    })
}

