import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

    // hong_kong_districts ##

    const hongKongDistricts = ["中西區", "東區", "南區", "灣仔區"]
    const kowloonDistricts = ["深水埗區", "九龍城區", "觀塘區", "黃大仙區", "油尖旺區"]
    const newTerritoriesDistricts = ["離島區", "葵青區", "北區", "沙田區", "西貢區", "大埔區", "荃灣區", "屯門區", "元朗區"]


    for (let i = 0; i < 4; i++) {
        await knex("hong_kong_districts").insert({ id: (1 + i), district: hongKongDistricts[i], area_id: 1 })
    }

    for (let i = 0; i < 5; i++) {
        await knex("hong_kong_districts").insert({ id: (5 + i), district: kowloonDistricts[i], area_id: 2 })
    }

    for (let i = 0; i < 9; i++) {
        await knex("hong_kong_districts").insert({ id: (10 + i), district: newTerritoriesDistricts[i], area_id: 3 })
    };
}
