import { Knex } from "knex"

export class RestaurantService {
    constructor(private knex: Knex) { }

    async getRecommendRestaurant() {
        const restaurant: {
            id: number
            name: string,
            image: string,
            introduction: string
            price: string
            numberOfRating: string
            avgRating: string
            shippingFree: boolean
        } = await this.knex("menus")
            .select(
                "id",
                "name",
                "image",
                "introduction",
                "price"
            )
            .first()
        if (!restaurant) {
            return
        }

        const restaurantRatings = await this.knex<{
            avg: string
        }>("restaurant_ratings")
            .avg("rating")
            .where("menus_id", restaurant.id)
            .first()
        let avg = ""
        if (restaurantRatings) {
            avg = Number(restaurantRatings["avg"]).toFixed(2).toString()
        } else avg = "0"
        restaurant["avgRating"] = avg

        const restaurantNumberOfRating = await this.knex<{
            numberOfRating: string
        }>("restaurant_ratings")
            .count("rating as numberOfRating")
            .where("menus_id", restaurant.id)
            .first()
        let numberOfRating = ""
        if (restaurantNumberOfRating) {
            numberOfRating = restaurantNumberOfRating["numberOfRating"]
        } else numberOfRating = "0"
        restaurant["numberOfRating"] = numberOfRating

        const shippingFee: {
            price: string
        }[] = await this.knex("restaurant_shipping_fee")
            .select("price")
            .where("menus_id", restaurant.id)

        if (shippingFee.reduce((a, b) => a + Number(b.price), 0) === 0) {
            restaurant["shippingFree"] = true
        } else restaurant["shippingFree"] = false

        return restaurant
    }

    async getRestaurantCuisineType() {
        const cuisineTypes = await this.knex("cuisine_list")
            .select(
                "id",
                { type: "cuisine" }
            )
        return { cuisineTypes }
    }

    async getRestaurantMenu(sortBy: string, numberOfPeople: number, cuisineFilter: number[], pageNum: number, searchWord: string, userId?: number) {
        let menus: {
            id: number
            image: string
            name: string
            price: string
            shippingFree: boolean
            numberOfRating: string
            avgRating: string
        }[]
        if (!searchWord) {
            menus = await this.knex("menus")
                .select(
                    "id",
                    "image",
                    "name",
                    "price"
                )
        } else {
            menus = await this.knex("menus")
                .select(
                    "id",
                    "image",
                    "name",
                    "price"
                )
                .where("name", "ilike", `%${searchWord}%`)
        }

        for (let menu of menus) {
            const restaurantRatings = await this.knex<{
                avg: string
            }>("restaurant_ratings")
                .avg("rating")
                .where("menus_id", menu.id)
                .first()
            let avg = ""
            if (restaurantRatings) {
                avg = Number(restaurantRatings["avg"]).toFixed(2).toString()
            } else avg = "0"
            menu["avgRating"] = avg


            const restaurantNumberOfRating = await this.knex<{
                numberOfRating: string
            }>("restaurant_ratings")
                .count("rating as numberOfRating")
                .where("menus_id", menu.id)
                .first()
            let numberOfRating = ""
            if (restaurantNumberOfRating) {
                numberOfRating = restaurantNumberOfRating["numberOfRating"]
            } else numberOfRating = "0"
            menu["numberOfRating"] = numberOfRating

            const shippingFee: {
                price: string
            }[] = await this.knex("restaurant_shipping_fee")
                .select("price")
                .where("menus_id", menu.id)

            if (shippingFee.reduce((a, b) => a + Number(b.price), 0) === 0) {
                menu["shippingFree"] = true
            } else menu["shippingFree"] = false

            if (userId) {
                const hasFavorite = await this.knex("user_favorite_menu").where("user_id", userId).andWhere("menu_id", menu.id).first()
                if (hasFavorite) {
                    menu["isFavorite"] = true
                } else menu["isFavorite"] = false
            } else {
                menu["isFavorite"] = false
            }

        }

        if (sortBy === "price") {
            menus.sort((a, b) => {
                if (a[sortBy] > b[sortBy]) {
                    return 1;
                }
                if (a[sortBy] < b[sortBy]) {
                    return -1;
                }
                return 0;
            })
        }

        if (sortBy === "avgRating") {
            menus.sort((a, b) => {
                if (a[sortBy] > b[sortBy]) {
                    return -1;
                }
                if (a[sortBy] < b[sortBy]) {
                    return 1;
                }
                return 0;
            })
        }

        if (cuisineFilter && cuisineFilter.length > 0) {
            const filteredMenus: {
                id: number
            }[] = await this.knex("restaurant_cuisine")
                .select({ id: "menus_id" })
                .whereIn("cuisine_id", cuisineFilter)

            menus = (menus.filter(menu => {
                let pass = false
                filteredMenus.forEach(food => {
                    (food.id === menu.id) && (pass = true)
                })
                return pass
            }))
        }

        if (numberOfPeople && numberOfPeople > 0) {
            const filteredMenus: {
                id: number
            }[] = await this.knex("menus")
                .select("id")
                .where("max_number_of_people", ">=", numberOfPeople)
                .andWhere("min_number_of_people", "<=", numberOfPeople)

            menus = (menus.filter(food => {
                let pass = false
                filteredMenus.forEach(menu => {
                    (menu.id === food.id) && (pass = true)
                })
                return pass
            }))
        }

        const count = menus.length

        if (pageNum) {
            const limit = 10
            const startNum = limit * (pageNum - 1)
            menus = menus.slice(startNum, startNum + limit)
        }

        return {
            count,
            menus
        }
    }

    async getMenuById(id: number, userId?: number) {
        const menu: {
            id: number
            price: number
            image: string
            phoneNumber: string
            name: string
            restaurant: string
            bookingPrepareTime: string
            minNumberOfPeople: string
            maxNumberOfPeople: string
            introduction: string
            shippingFees: Array<{
                id: number
                price: number
                area: string
            }>
            foods: Array<{
                id: number
                name: string
                quantity: number
                image: string
            }>
            isFavorite: boolean
        } = await this.knex("menus")
            .select(
                "menus.id",
                "menus.price",
                "menus.image",
                { phoneNumber: "restaurants.phone_number" },
                "menus.name",
                { restaurant: "restaurants.name" },
                { bookingPrepareTime: "menus.booking_prepare_time" },
                { minNumberOfPeople: "menus.min_number_of_people" },
                { maxNumberOfPeople: "menus.max_number_of_people" },
                "menus.introduction" ,
            )
            .leftJoin("restaurants", "menus.restaurant_id", "restaurants.id")
            .where("menus.id", id)
            .first()

        if (!menu) {
            return
        }

        const foods: {
            id: number
            name: string
            quantity: number
            image: string
        }[] = await this.knex("food")
            .select(
                "id",
                "name",
                "quantity",
                "image"
            )
            .where("menu_id", id)

        menu.foods = foods

        const shippingFees: {
            id: number
            price: number
            area: string
        }[] = await this.knex("restaurant_shipping_fee")
            .select(
                "restaurant_shipping_fee.id",
                "restaurant_shipping_fee.price",
                "hong_kong_areas.area"
            )
            .leftJoin("hong_kong_areas", "restaurant_shipping_fee.hong_kong_area_id", "hong_kong_areas.id")
            .where("menus_id", id)
        menu.shippingFees = shippingFees

        if (userId) {
            const hasFavorite = await this.knex("user_favorite_menu").where("user_id", userId).andWhere("menu_id", id).first()
            if (hasFavorite) {
                menu.isFavorite = true
            } else menu.isFavorite = false
        } else {
            menu.isFavorite = false
        }

        return menu
    }

    async getMenuRating(menuId: number, pageNum: number) {
        const limit = 10
        const ratings: {
            id: number
            username: string
            rating: string
            ratingDate: Date
            comment: string
        }[] = await this.knex("restaurant_ratings")
            .select(
                "restaurant_ratings.id",
                "users.name",
                "restaurant_ratings.rating",
                { ratingDate: "restaurant_ratings.created_at" },
                "restaurant_ratings.comment"
            )
            .leftJoin("users", "restaurant_ratings.user_id", "users.id")
            .where("restaurant_ratings.menus_id", menuId)
            .limit(limit)
            .offset((limit * (pageNum - 1)))

        const menuNumberOfRating = await this.knex<{
            numberOfRating: string
        }>("restaurant_ratings")
            .count("rating as numberOfRating")
            .where("menus_id", menuId)
            .first()
        let numberOfRating = ""
        if (menuNumberOfRating) {
            numberOfRating = menuNumberOfRating["numberOfRating"]
        } else numberOfRating = "0"

        const menuRating = await this.knex<{
            avg: string
        }>("restaurant_ratings")
            .avg("rating")
            .where("menus_id", menuId)
            .first()
        let avg = ""
        if (menuRating) {
            avg = Number(menuRating["avg"]).toFixed(2).toString()
        } else avg = "0"

        return {
            avgRating: avg,
            numberOfRating,
            ratings
        }
    }

    async getMenuPrice(menuId: number, quantity: number, shippingFeeId: number) {
        const price = (await this.knex("menus").select("price").where("id", menuId).first()).price * quantity
        const shippingFee = (await this.knex("restaurant_shipping_fee")
            .select("price")
            .where("id", shippingFeeId)
            .first())?.price
        return { price, shippingFee }
    }
}