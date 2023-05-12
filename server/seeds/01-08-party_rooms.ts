import { Knex } from "knex";
import xlsx from "xlsx"
import path from "path"

export async function seed(knex: Knex): Promise<void> {

    // recommend party room

    const recommendPartyRoomId = (await knex("party_rooms").insert({
        name: "Double Chill",
        address: `葵涌工業街23~31號 美聯工業大廈21樓C1室`,
        district_id: 11,
        introduction: `全新Party Room，絕對私密圍內自己玩 24小時開放🏪  私隱度高👏🏻 適合 生日/節日/結婚派對🎉🎂`,
        account_id: 2,
        phone_number: "55055064",
        whatsapp: parseInt("55055064"),
        max_number_of_people: 50,
        min_number_of_people: 4,
        area: 1000,
        important_matter: ``,
        contact_person: "ting",
        email: "tecky@tecky.io",
        facilities_detail: `唱K🎤\n麻雀🀄️\nBoardgames🃏\n飛鏢🎯\n街機🕹\n桌球🎱\n氣墊球\n乒乓波🏓\nBeerpong`,
        min_number_of_consumers: 4,
        price_of_overtime: 20
    }).returning("id"))[0]

    for (let i = 1; i <= 14; i++) {
        await knex("party_room_facilities").insert({ party_room_id: recommendPartyRoomId, types_id: i })
    }

    await knex("party_room_images").insert({
        party_room_id: recommendPartyRoomId,
        image: `http://cdn.partybuildhk.com/image-1618722419402.jpeg`
    })

    await knex("party_room_prices").insert({
        party_room_id: recommendPartyRoomId,
        start_time: "00:00",
        end_time: "12:00",
        weekday_price: 19,
        weekend_price: 35 
    })

    await knex("party_room_prices").insert({
        party_room_id: recommendPartyRoomId ,
        start_time: "12:00",
        end_time: "00:00",
        weekday_price: 29,
        weekend_price: 55
    })

    let open_time = new Date();
    open_time.setUTCHours(5 - 8)
    open_time.setMinutes(0)
    open_time.setSeconds(0)
    open_time.setMilliseconds(0)
    let close_time = new Date()
    close_time.setUTCHours(23 - 8)
    close_time.setMinutes(0)
    close_time.setSeconds(0)
    close_time.setMilliseconds(0)

    // party_rooms ##

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

    const districtId = (await knex("hong_kong_districts")).reduce(
        (acc, cur) => acc.set(cur.district, cur.id),
        new Map<string, number>())

    let i = 0
    for (let partyRoom of partyRooms) {
        const account_id = ((i + 1) % 4) + 1
        i++
        await knex("party_rooms").insert({
            name: partyRoom.派對名字,
            address: partyRoom.派對地址,
            district_id: districtId.get(partyRoom.派對地區),
            introduction: partyRoom.場地介紹,
            account_id,
            phone_number: partyRoom.派對電話,
            whatsapp: parseInt(partyRoom.派對電話),
            max_number_of_people: partyRoom.派對最高人數,
            min_number_of_people: partyRoom.派對最少人數,
            area: partyRoom.場地面積,
            important_matter: partyRoom.重要事項,
            contact_person: "alex",
            email: "tecky@tecky.io",
            facilities_detail: partyRoom.設施,
            min_number_of_consumers: 4,
            price_of_overtime: 20
        })
    }

};
