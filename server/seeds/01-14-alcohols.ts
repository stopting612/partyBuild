import { Knex } from "knex";
import xlsx from "xlsx"
import path from "path"

export async function seed(knex: Knex): Promise<void> {

    // alcohols_suppliers ##

    let alcoholsSuppliers = {
        name: "East West Spirits Limited",
        phone_number: "2369 5699",
        introduction: "East West Spirits Limited is a Hong Kong based company set up in 2002 for the business of sourcing and distributing select quality products to the local Food and Beverage businesses. East West Spirits Limited currently holds distributorship of various internationally recognized brands and continues to expand its portfolio. East West is the exclusive distributor in Hong Kong, Macau and Guangzhou (P. R. China) for McDowell’s Spirits, Shaw Wallace Spirits, United Breweries and Segu Chilean Wines. Please visit Indian Whisky, Whisky and Wine. It is also the exclusive distributor of Red Horse beer in South Africa.",
        account_id: 3
    }

    let alcoholsSuppliersId = await knex("alcohols_suppliers").insert(alcoholsSuppliers).returning("id");

    alcoholsSuppliersId = alcoholsSuppliersId[0]

    // alcohol_types ##

    interface AlcoholTypes {
        "alcohol_types": string
    }

    let workbook = xlsx.readFile(path.join(__dirname, "../data", "/酒詳情.xlsx"));
    const alcoholTypeSheet = workbook.Sheets["alcohol_types"]
    const alcoholTypes = xlsx.utils.sheet_to_json<AlcoholTypes>(alcoholTypeSheet)

    const alcoholTypeId = {}

    for (let alcoholType of alcoholTypes) {
        let id = await knex("alcohol_types").insert({ type: alcoholType.alcohol_types }).returning("id")
        alcoholTypeId[alcoholType.alcohol_types] = id[0]
    }

    // alcohols ##



    const recommendAlcoholId = (await knex("alcohols").insert({
        name: "FR711 Château Sainte Catherine 2015 Cadillac - Côtes de Bordeaux",
        price: 88,
        alcohols_supplier_id: alcoholsSuppliersId,
        introduction: "擁有紅寶石般的酒裙，口感層次豐富。香氣複雜，有紅色水果，櫻桃和灌木等香氣，口感圓潤飽滿，最吸引人的地方就在於優雅和力量之間的平衡。柔滑細膩的單寧令人食慾大開",
        image: "https://static.wixstatic.com/media/c59029_50aa5bade27a49d489d2e2703b72d727~mv2.jpg/v1/fill/w_586,h_344,al_c,q_80,usm_0.66_1.00_0.01/FR711.webp",
        type_id: alcoholTypeId["紅酒"],
        pack: "1支",
        average_price: 88
    }).returning("id"))[0]

    for (let i = 0; i < 200; i++) {
        const alcohol_id = recommendAlcoholId
        const user_id = Math.floor(Math.random() * 4) + 1
        const rating = Math.floor(Math.random() * 5) + 1
        const randomNum = Math.random()
        let comment: string = ""
        if (randomNum < 1) {
            comment = "特別的淡淡花香，清爽的口感，不會太甜膩的感受，香氣撲鼻，算起來CP值還不錯。"
        }
        if (randomNum < 0.9) {
            comment = "這是單一葡萄品種syrah，撲鼻而來的優雅的果香，在水晶杯上紅寶石般的神祕光澤，圓潤帶點過桶木香及淡淡巧克力的香氣，順口的口感，會讓人忍不住一口接一口，整體的平衡感，真是值得我再飲一杯…..真棒。"
        }
        if (randomNum < 0.8) {
            comment = "葡萄酒是我們能夠品嘗到的最微妙的物質之一，而且他自帶很強烈的揮發特質，並且不停地向周圍空氣中散發出很多不同的香味，不需要加熱即可以散發出很多香氣。當你打開一瓶上好的葡萄酒，倒入杯中，記得仔細得去感受不同種類的香氣，體會它們融入每一個嗅覺細胞時所激起的歡愉甚至回憶。"
        }
        if (randomNum < 0.7) {
            comment = "相比在沉默中喝酒，有音樂的搭配可讓酒量增加，口感更佳，而愉快的感覺也可以提高。特定的音樂和特定種類的酒對上了，就能提升酒的味道產生具有個別特色的風味。"
        }
        if (randomNum < 0.6) {
            comment = "釀制白萄萄酒時是使用壓榨的葡萄汁。而釀製紅酒則是使用整個萄萄。紅酒发酵時， 萄萄皮、籽、汁液，有時還有葡萄梗一起浸漬，它們中的顏色和丹寧都在发酵過程中被提取出來。因此， 飲用紅酒時， 單寧會讓口腔產生乾燥的感覺。"
        }
        if (randomNum < 0.5) {
            comment = "光線會使酒中明亮的水果風味變鈍，最糟糕的是會引入一系列令人不愉快的氣味，例如腐爛的白菜或雞蛋或者濕羊毛味。"
        }
        if (randomNum < 0.3) {
            comment = "酒本身的風味濃郁，單單品嚐酒本身，也能享受其美好的風味。普遍來說，火腿、鵝肝、藍莓級酪及少數種類的堅果"
        }
        if (randomNum < 0.2) {
            comment = "Beautiful wine 🍷"
        }
        if (randomNum < 0.1) {
            comment = "很甜美平衡"
        }


        await knex("alcohol_ratings").insert({
            alcohol_id,
            user_id,
            comment,
            rating
        })
    }

    interface Alcohols {
        "名字": string,
        "套裝": string,
        "平均價錢": string,
        "總共價錢": string,
        "介紹": string,
        "圖片": string,
        "alcohol_types": string
    }

    workbook = xlsx.readFile(path.join(__dirname, "../data", "/酒詳情.xlsx"));
    const alcoholSheet = workbook.Sheets["酒"]
    const alcohols = xlsx.utils.sheet_to_json<Alcohols>(alcoholSheet)

    const alcoholsId = {}

    for (let alcohol of alcohols) {
        // price 總共價錢
        let fullWidthPrice = alcohol.總共價錢.slice(3)
        let halfWidthPrice = '';
        for (var i = 0, l = fullWidthPrice.length; i < l; i++) {
            var c = fullWidthPrice[i].charCodeAt(0);
            //只針對半形去轉換
            if (c >= 0xFF00 && c <= 0xFFEF) {
                c = 0xFF & (c + 0x20);
            }
            halfWidthPrice += String.fromCharCode(c);
        }

        const price = Number(halfWidthPrice)

        // average_price 平均價錢
        fullWidthPrice = alcohol.平均價錢
        halfWidthPrice = '';
        for (var i = 0, l = fullWidthPrice.length; i < l; i++) {
            var c = fullWidthPrice[i].charCodeAt(0);
            //只針對半形去轉換
            if (c >= 0xFF00 && c <= 0xFFEF) {
                c = 0xFF & (c + 0x20);
            }
            halfWidthPrice += String.fromCharCode(c);
        }

        const average_price = Number(halfWidthPrice)

        // alcohol_types

        const type_id = alcoholTypeId[alcohol.alcohol_types]

        const id = await knex("alcohols").insert({
            name: alcohol.名字,
            price,
            alcohols_supplier_id: alcoholsSuppliersId,
            introduction: alcohol.介紹,
            image: alcohol.圖片,
            type_id,
            pack: alcohol.套裝,
            average_price
        })
        alcoholsId[alcohol.名字] = id[0]
    }

    // alcohol_ratings ##

    for (let alcohol of alcohols) {
        for (let i = 0; i < 200; i++) {
            const alcohol_id = alcoholsId[alcohol.名字]
            const user_id = Math.floor(Math.random() * 4) + 1
            const rating = Math.floor(Math.random() * 5) + 1
            const randomNum = Math.random()
            let comment: string = ""
            if (randomNum < 1) {
                comment = "特別的淡淡花香，清爽的口感，不會太甜膩的感受，香氣撲鼻，算起來CP值還不錯。"
            }
            if (randomNum < 0.9) {
                comment = "這是單一葡萄品種syrah，撲鼻而來的優雅的果香，在水晶杯上紅寶石般的神祕光澤，圓潤帶點過桶木香及淡淡巧克力的香氣，順口的口感，會讓人忍不住一口接一口，整體的平衡感，真是值得我再飲一杯…..真棒。"
            }
            if (randomNum < 0.8) {
                comment = "葡萄酒是我們能夠品嘗到的最微妙的物質之一，而且他自帶很強烈的揮發特質，並且不停地向周圍空氣中散發出很多不同的香味，不需要加熱即可以散發出很多香氣。當你打開一瓶上好的葡萄酒，倒入杯中，記得仔細得去感受不同種類的香氣，體會它們融入每一個嗅覺細胞時所激起的歡愉甚至回憶。"
            }
            if (randomNum < 0.7) {
                comment = "相比在沉默中喝酒，有音樂的搭配可讓酒量增加，口感更佳，而愉快的感覺也可以提高。特定的音樂和特定種類的酒對上了，就能提升酒的味道產生具有個別特色的風味。"
            }
            if (randomNum < 0.6) {
                comment = "釀制白萄萄酒時是使用壓榨的葡萄汁。而釀製紅酒則是使用整個萄萄。紅酒发酵時， 萄萄皮、籽、汁液，有時還有葡萄梗一起浸漬，它們中的顏色和丹寧都在发酵過程中被提取出來。因此， 飲用紅酒時， 單寧會讓口腔產生乾燥的感覺。"
            }
            if (randomNum < 0.5) {
                comment = "光線會使酒中明亮的水果風味變鈍，最糟糕的是會引入一系列令人不愉快的氣味，例如腐爛的白菜或雞蛋或者濕羊毛味。"
            }
            if (randomNum < 0.3) {
                comment = "酒本身的風味濃郁，單單品嚐酒本身，也能享受其美好的風味。普遍來說，火腿、鵝肝、藍莓級酪及少數種類的堅果"
            }
            if (randomNum < 0.2) {
                comment = "Beautiful wine 🍷"
            }
            if (randomNum < 0.1) {
                comment = "很甜美平衡"
            }


            await knex("alcohol_ratings").insert({
                alcohol_id,
                user_id,
                comment,
                rating
            })
        }
    }

};
