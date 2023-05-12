import { Knex } from "knex";
import xlsx from "xlsx"
import path from "path"

export async function seed(knex: Knex): Promise<void> {

    interface PartyRoom {
        "派對名字": string,
        "派對地址": string,
        "派對地區": string,
        "派對電話": string,
        "派對最高人數": string,
        "派對最少人數": string,
        "場地介紹": string,
        "場地面積": string,
        "重要事項": string,
        "設施": string,
        "圖片": string,
    }

    const workbook = xlsx.readFile(path.join(__dirname, "../data", "/Partyroom詳情v2.xlsx"));
    const partyRoomSheet = workbook.Sheets["Partyroom詳情"]
    const partyRooms = xlsx.utils.sheet_to_json<PartyRoom>(partyRoomSheet)

    // party_room_images ##
    const partyRoomId = (await knex("party_rooms")).reduce(
        (acc, cur) => acc.set(cur.name, cur.id),
        new Map<string, number>())

    for (let partyRoom of partyRooms) {
        const party_room_id = partyRoomId.get(partyRoom.派對名字)

        await knex("party_room_images").insert({
            party_room_id,
            image: partyRoom.圖片
        })
    }

};
