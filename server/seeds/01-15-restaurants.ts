import { Knex } from "knex";
import path from "path"
import fs from "fs"

export async function seed(knex: Knex): Promise<void> {

    // restaurants ##

    const restaurants = {
        name: "象月 Da Moon",
        introduction: "泰國廚師20年經驗， 正宗泰國菜，經典咖哩炒蟹 地道炸彈蟹，泰式冬陰功湯， 秘製醃料生蝦刺身， 大量正宗泰菜應有盡有， 菜式款款正宗，材料樣樣新鮮。",
        phone_number: "2285 8861",
        location: "Tai Wo Estate, 大埔舊墟直街9號粵發大廈地下3號舖",
        account_id: 3
    }



    const restaurantId = (await knex("restaurants").insert(restaurants).returning("id"))[0]
    // cuisine_list
    const cuisines = ["歐陸風味", "法式", "日式", "韓式", "中式", "川式", "台式", "馬拉風味", "意式", "泰式", "越式", "德式"]
    const cuisineId = {}

    for (const cuisine of cuisines) {
        const id = (await knex("cuisine_list").insert({ cuisine }).returning("id"))[0]
        cuisineId[cuisine] = id
    }

    // recommend menus

    const menuId = (await knex("menus").insert({
        restaurant_id: restaurantId,
        name: "象月 Da Moon 到會",
        price: 1200,
        introduction: "正宗泰國菜，經典咖哩炒蟹 地道炸彈蟹，泰式冬陰功湯， 秘製醃料生蝦刺身， 大量正宗泰菜應有盡有， 菜式款款正宗，材料樣樣新鮮。",
        image: "http://cdn.partybuildhk.com/image-1618818811302.jpeg",
        max_number_of_people: 1,
        min_number_of_people: 30,
        booking_prepare_time: 4
    }).returning("id"))[0]

    await knex("food").insert({
        menu_id: menuId,
        name: "泰式炒金邊粉",
        image: "https://static7.orstatic.com/userphoto2/photo/12/UAK/05ZF3EF902F7F4AD95326Atx.jpg",
        quantity: 1,
    })

    await knex("food").insert({
        menu_id: menuId,
        name: "青檸梳打",
        image: "https://static8.orstatic.com/userphoto2/photo/1H/161B/08AXEN374C14603FDC903Btx.jpg",
        quantity: 1,
    })

    await knex("food").insert({
        menu_id: menuId,
        name: "炸蝦餅",
        image: "https://static5.orstatic.com/userphoto2/photo/1D/135M/07QFYS5650149C0B8C0DFAtx.jpg",
        quantity: 1,
    })

    await knex("food").insert({
        menu_id: menuId,
        name: "新鮮菠蘿炒飯",
        image: "https://static8.orstatic.com/userphoto2/photo/15/X53/06JOBB37556E9938631613tx.jpg",
        quantity: 1,
    })

    await knex("food").insert({
        menu_id: menuId,
        name: "生蝦刺身",
        image: "https://static6.orstatic.com/userphoto2/photo/15/X53/06JOB1780FBE1020D8CBD8tx.jpg",
        quantity: 1,
    })

    for (let i = 0; i < 200; i++) {
        const rating = Math.floor(Math.random() * 5) + 1
        const randomNum = Math.random()
        let comment: string = ""
        if (randomNum < 1) {
            comment = "唔錯嘅菜式，無論係嗅覺同味覺上都充斥住泰式香料嘅味道，以青咖哩做主題配搭pizza撞出嚟嘅效果幾唔錯"
        }
        if (randomNum < 0.9) {
            comment = "碟邊嘅蘋果蓉酸酸甜甜，可以減輕鴨肝嘅油膩感，所以唔覺漏，咖哩飯係微辣，容易入口👍蒜片鹹魚茄子鮑魚炒意大利麵🍝依個菜式名令我聯想起茶餐廳嘅鹹魚雞粒炒飯"
        }
        if (randomNum < 0.8) {
            comment = "我覺得佢呢個都幾好食喎。"
        }
        if (randomNum < 0.7) {
            comment = "食物一流，口味特別"
        }
        if (randomNum < 0.6) {
            comment = "呢個飯薯仔味比較濃 有少少似薯片咖哩 因為呢個特點我哋都不停咁食"
        }
        if (randomNum < 0.5) {
            comment = "蟹肉一啲都唔孤寒再加埋蟹籽同埋個辣辣地嘅飯，夠惹味"
        }
        if (randomNum < 0.3) {
            comment = "蜂蜜紅茶茶底太濃，有D苦澀"
        }
        if (randomNum < 0.2) {
            comment = "海老天婦羅天婦羅炸得夠乾身唔會過份油膩,海老肉質彈牙帶淡淡蝦香"
        }
        if (randomNum < 0.1) {
            comment = "胡麻豆腐沙律份量豐富,一片片充滿豆香味既頭腐上加上濃香胡麻醬及鮮甜既蟹籽及三文魚籽,底下再以新鮮翠綠既生律菜鋪底.整體層次感豐富,而且朸開胃.醬汁漬鮑魚及活赤貝刺身刺身新鮮甘甜唔會腥,質感爽彈而且鮑魚一點都唔會韌."
        }

        const user_id = Math.floor(Math.random() * 4) + 1

        await knex("restaurant_ratings").insert({
            menus_id: menuId,
            user_id,
            comment,
            rating
        })
    }

    const shippingFee = (Math.random() < 0.2) ? 100 : 0
    await knex("restaurant_shipping_fee").insert({
        menus_id: menuId,
        hong_kong_area_id: 1,
        price: shippingFee
    })
    await knex("restaurant_shipping_fee").insert({
        menus_id: menuId,
        hong_kong_area_id: 2,
        price: shippingFee
    })
    await knex("restaurant_shipping_fee").insert({
        menus_id: menuId,
        hong_kong_area_id: 3,
        price: shippingFee
    })

    // menus ##

    const data = fs.readFileSync(path.join(__dirname, "../data", "new到會詳情.json"), "utf-8")
    const menus: {
        "到會名字": string,
        "到會圖片": string,
        "cuisine": string[],
        "套餐詳情": [
            {
                "套餐Name": string,
                "套餐價錢": string,
                "套餐圖片": string
            }
        ]
    }[] = JSON.parse(data)

    for (const menu of menus) {
        const restaurant_id = restaurantId
        const price = menu.套餐詳情.reduce((a, b) => {
            return a + Number(b.套餐價錢.slice(1))
        }, 0) / 2
        const min_number_of_people = Math.ceil(Math.random() * 20) + 2
        const max_number_of_people = min_number_of_people + 10

        const id = (await knex("menus").insert({
            restaurant_id,
            name: menu.到會名字,
            price,
            introduction: "暫無",
            image: menu.到會圖片,
            max_number_of_people,
            min_number_of_people,
            booking_prepare_time: 4
        }).returning("id"))[0]

        // food ##
        for (const food of menu.套餐詳情) {
            await knex("food").insert({
                menu_id: id,
                name: food.套餐Name,
                image: food.套餐圖片,
                quantity: 1,
            }).returning("id")
        }

        // restaurant_ratings ##
        for (let i = 0; i < 200; i++) {
            const rating = Math.floor(Math.random() * 5) + 1
            const randomNum = Math.random()
            let comment: string = ""
            if (randomNum < 1) {
                comment = "唔錯嘅菜式，無論係嗅覺同味覺上都充斥住泰式香料嘅味道，以青咖哩做主題配搭pizza撞出嚟嘅效果幾唔錯"
            }
            if (randomNum < 0.9) {
                comment = "碟邊嘅蘋果蓉酸酸甜甜，可以減輕鴨肝嘅油膩感，所以唔覺漏，咖哩飯係微辣，容易入口👍蒜片鹹魚茄子鮑魚炒意大利麵🍝依個菜式名令我聯想起茶餐廳嘅鹹魚雞粒炒飯"
            }
            if (randomNum < 0.8) {
                comment = "我覺得佢呢個都幾好食喎。"
            }
            if (randomNum < 0.7) {
                comment = "食物一流，口味特別"
            }
            if (randomNum < 0.6) {
                comment = "呢個飯薯仔味比較濃 有少少似薯片咖哩 因為呢個特點我哋都不停咁食"
            }
            if (randomNum < 0.5) {
                comment = "蟹肉一啲都唔孤寒再加埋蟹籽同埋個辣辣地嘅飯，夠惹味"
            }
            if (randomNum < 0.3) {
                comment = "蜂蜜紅茶茶底太濃，有D苦澀"
            }
            if (randomNum < 0.2) {
                comment = "海老天婦羅天婦羅炸得夠乾身唔會過份油膩,海老肉質彈牙帶淡淡蝦香"
            }
            if (randomNum < 0.1) {
                comment = "胡麻豆腐沙律份量豐富,一片片充滿豆香味既頭腐上加上濃香胡麻醬及鮮甜既蟹籽及三文魚籽,底下再以新鮮翠綠既生律菜鋪底.整體層次感豐富,而且朸開胃.醬汁漬鮑魚及活赤貝刺身刺身新鮮甘甜唔會腥,質感爽彈而且鮑魚一點都唔會韌."
            }

            const user_id = Math.floor(Math.random() * 4) + 1

            await knex("restaurant_ratings").insert({
                menus_id: id,
                user_id,
                comment,
                rating
            })
        }


        // restaurant_shipping_fee ##
        const shippingFee = (Math.random() < 0.2) ? 10 : 0
        await knex("restaurant_shipping_fee").insert({
            menus_id: id,
            hong_kong_area_id: 1,
            price: shippingFee
        })
        await knex("restaurant_shipping_fee").insert({
            menus_id: id,
            hong_kong_area_id: 2,
            price: shippingFee
        })
        await knex("restaurant_shipping_fee").insert({
            menus_id: id,
            hong_kong_area_id: 3,
            price: shippingFee
        })

        // restaurant_cuisine
        for (let type of menu.cuisine) {
            await knex("restaurant_cuisine").insert({
                menus_id: id,
                cuisine_id: cuisineId[type]
            })
        }
    }
};
