import { Knex } from "knex";
import xlsx from "xlsx"
import path from "path"

export async function seed(knex: Knex): Promise<void> {

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

    const 電視 = newFacilityTypes.map(x => x.電視)
    const 電動麻雀 = newFacilityTypes.map(x => x.電動麻雀)
    const 唱K = newFacilityTypes.map(x => x.唱K)
    const Switch = newFacilityTypes.map(x => x.Switch)
    const 波波池 = newFacilityTypes.map(x => x.波波池)
    const 包無酒精飲 = newFacilityTypes.map(x => x.包無酒精飲)
    const BoardGame = newFacilityTypes.map(x => x.BoardGame)
    const Poker枱 = newFacilityTypes.map(x => x["正規Poker 枱（包籌碼）"])
    const 有廚房 = newFacilityTypes.map(x => x.有廚房)
    const PS4 = newFacilityTypes.map(x => x.PS4)
    const BBQ = newFacilityTypes.map(x => x.BBQ)
    const 骰盅 = newFacilityTypes.map(x => x.骰盅)
    const Netflix = newFacilityTypes.map(x => x.Netflix)
    const 飛標 = newFacilityTypes.map(x => x.飛標)

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

    workbook = xlsx.readFile(path.join(__dirname, "../data", "/Partyroom詳情v2.xlsx"));
    const partyRoomSheet = workbook.Sheets["Partyroom詳情"]
    const partyRooms = xlsx.utils.sheet_to_json<PartyRoom>(partyRoomSheet)

    const partyRoomId = (await knex("party_rooms")).reduce(
        (acc, cur) => acc.set(cur.name, cur.id),
        new Map<string, number>())

    const facilityTypeId = (await knex("party_room_facility_types")).reduce(
        (acc, cur) => acc.set(cur.type, cur.id),
        new Map<string, number>())

    // party_room_facilities ##

    for (let partyRoom of partyRooms) {
        // Get each partyRoom 設施 as facility
        if (partyRoom.設施) {
            for (let facility of partyRoom.設施.split("\n")) {
                for (let option of 電視) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("🖥 電視") })
                }
                for (let option of 電動麻雀) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("🀄️ 電動麻雀") })
                }
                for (let option of 唱K) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("🎤 唱K") })
                }
                for (let option of Switch) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("🎮 Switch") })
                }
                for (let option of 波波池) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("🎈 波波池") })
                }
                for (let option of 包無酒精飲) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("☕️ 包無酒精飲品") })
                }
                for (let option of BoardGame) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("♜ BoardGame") })
                }
                for (let option of Poker枱) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("♣️ 正規Poker 枱（包籌碼）") })
                }
                for (let option of 有廚房) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("🍴 有廚房") })
                }
                for (let option of PS4) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("👾 PS4") })
                }
                for (let option of BBQ) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("🍢 BBQ") })
                }
                for (let option of 骰盅) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("🎲 骰盅") })
                }
                for (let option of Netflix) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("💻 Netflix") })
                }
                for (let option of 飛標) {
                    (option === facility) && await await knex("party_room_facilities").insert({ party_room_id: partyRoomId.get(partyRoom.派對名字), types_id: facilityTypeId.get("🎯 飛標") })
                }
            }
        }
    }
};
