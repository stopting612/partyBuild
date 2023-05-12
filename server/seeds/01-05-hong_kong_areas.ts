import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

    // hong_kong_areas ##

    await knex("hong_kong_areas").insert({ id: 1, area: "香港" })
    await knex("hong_kong_areas").insert({ id: 2, area: "九龍" })
    await knex("hong_kong_areas").insert({ id: 3, area: "新界" })

};
