import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('party_rooms', (table) => {
        table.text('remark')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('party_rooms', (table) => {
        table.dropColumns('remark')
    })
}

