import { Knex } from "knex";
import xlsx from "xlsx"
import path from "path"

export async function seed(knex: Knex): Promise<void> {

    // party_room_facility_types ##

    interface NewFacilityTypes {
        "場地設施": string,
        "電視": string,
        "電動麻雀": string,
        "唱K": string,
        "Switch": string,
        "波波池": string,
        "包無酒精飲": string,
        "BoardGame": string,
        "正規Poker 枱（包籌碼）": string,
        "有廚房": string,
        "PS4": string,
        "BBQ": string,
        "骰盅": string,
        "Netflix": string,
        "飛標": string
    }


    let workbook = xlsx.readFile(path.join(__dirname, "../data", "/newFacility-Types.xlsx"));
    const newFacilityTypesSheet = workbook.Sheets["Facility-Types"]
    const newFacilityTypes = xlsx.utils.sheet_to_json<NewFacilityTypes>(newFacilityTypesSheet)

    const types = newFacilityTypes.map(x => x.場地設施)

    for (let i = 0; i < types.length; i++) {
        await knex("party_room_facility_types").insert({ id: (i + 1), type: types[i] })
    }

};
