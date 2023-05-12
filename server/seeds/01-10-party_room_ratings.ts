import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

    // party_room_ratings 

    const partyRooms = await knex("party_rooms")

    for (let partyRoom of partyRooms) {
        const random = Math.floor(Math.random() * 20)
        for (let i = 0; i < random; i++) {
            const party_room_id = partyRoom.id
            const rating = Math.floor(Math.random() * 5) + 1
            const randomNum = Math.random()

            const user_id = Math.floor(Math.random() * 4) + 1

            let comment: string = ""
            if (randomNum < 1) {
                comment = "會再黎+推薦朋友黎價錢定位合理，房間乾淨。又多boardgame選擇又有switch+麻雀玩一大班人/得幾個人都玩到...有大細房間選擇廁所分男女好乾淨又有廚房，廚房用具俾人煲水/煮輕食地點都好就腳啲staff好nice, 好有禮貌"
            }
            if (randomNum < 0.9) {
                comment = "遊戲多；空間大，適合 Family Gathering"
            }
            if (randomNum < 0.8) {
                comment = "職員服務態度良好，環境不錯，地點方便，容易找~😀"
            }
            if (randomNum < 0.7) {
                comment = "Good for fun and games and spacey rooms!! Will go there again. Spent the time @ Kwun Tong 萬年 2/F。。。 The only thing is indication of the main entrance is not clear enough."
            }
            if (randomNum < 0.6) {
                comment = "Very good experience at comma party, decorations in 英倫車站 are very beautiful, lightings are sufficient and bright, very suitable for taking photos with friends.Board games and 麻雀 are prepared, but the maintenance for these stuffs can be done better.Staffs are helpful, polite and friendly, always smile and give useful suggestions.The price is very attractive, highly recommend to people who want to hold a party"
            }
            if (randomNum < 0.5) {
                comment = "地方夠大，職員都好好人，唔嫌棄我地咁多小朋友，又多多要求🙏🏿🙏🏿🙏🏿辛苦晒"
            }
            if (randomNum < 0.3) {
                comment = "非常完美的聚會，謝謝職員的支援及協助。"
            }
            if (randomNum < 0.2) {
                comment = "最近來過幾次都很滿意，不過建議在party 房的門口裝個名牌寫返咩主題啦，次次岀來去完洗手間都驚入錯房XDD"
            }
            if (randomNum < 0.1) {
                comment = "空間很大，有適合小童的設備"
            }

            await knex("party_room_ratings").insert({
                party_room_id,
                user_id,
                comment,
                rating
            })
        }
    }

};
