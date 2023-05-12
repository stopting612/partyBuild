import { Knex } from "knex"

export class AlcoholService {
    constructor(private knex: Knex) { }

    async getRecommendAlcohol() {
        const alcohol: {
            id: number
            image: string
            name: string
            introduction: string
            numberOfRating: string
            avgRating: string
            price: string
            district: string
        } = await this.knex("alcohols")
            .select(
                "id",
                "image",
                "name",
                "pack",
                { averagePrice: "average_price" },
                "price"
            )
            .first()

        const alcoholRatings = await this.knex<{
            avg: string
        }>("alcohol_ratings")
            .avg("rating")
            .where("alcohol_id", alcohol.id)
            .first()
        let avg = ""
        if (alcoholRatings) {
            avg = Number(alcoholRatings["avg"]).toFixed(2).toString()
        } else avg = "0"

        const alcoholNumberOfRating = await this.knex<{
            numberOfRating: string
        }>("alcohol_ratings")
            .count("rating as numberOfRating")
            .where("alcohol_id", alcohol.id)
            .first()
        let numberOfRating = ""
        if (alcoholNumberOfRating) {
            numberOfRating = alcoholNumberOfRating["numberOfRating"]
        } else numberOfRating = "0"

        const data = {
            ...alcohol,
            avgRating: avg,
            numberOfRating
        }

        return data
    }

    async getAlcoholTypes() {
        const types = await this.knex("alcohol_types")
            .select(
                "alcohol_types.id",
                { name: "alcohol_types.type" }
            )
        return { types }
    }

    async getAlcohols(sortBy: string, typeFilter: Array<number>, pageNum: number, searchWord: string, userId?: number) {
        let alcohols: {
            id: number
            image: string
            name: string
            numberOfRating: string
            pack: string
            averagePrice: string
            avgRating: string
            shippingFree: boolean
            isFavorite: boolean
        }[]
        if (!searchWord) {
            alcohols = await this.knex("alcohols")
                .select(
                    "id",
                    "image",
                    "name",
                    "pack",
                    { averagePrice: "average_price" }
                )
        } else {
            alcohols = await this.knex("alcohols")
                .select(
                    "id",
                    "image",
                    "name",
                    "pack",
                    { averagePrice: "average_price" }
                )
                .where("name", "ilike", `%${searchWord}%`)
        }

        for (const alcohol of alcohols) {
            const alcoholNumberOfRating = await this.knex<{
                numberOfRating: string
            }>("alcohol_ratings")
                .count("rating as numberOfRating")
                .where("alcohol_id", alcohol.id)
                .first()
            let numberOfRating = ""
            if (alcoholNumberOfRating) {
                numberOfRating = alcoholNumberOfRating["numberOfRating"]
            } else numberOfRating = "0"

            alcohol.numberOfRating = numberOfRating

            const avgRating = await this.knex<{
                avg: string
            }>("alcohol_ratings")
                .avg("rating")
                .where("alcohol_id", alcohol.id)
                .first()
            let avg = ""
            if (avgRating) {
                avg = Number(avgRating["avg"]).toFixed(2).toString()
            } else avg = "0"

            alcohol.avgRating = avg

            alcohol.shippingFree = true

            if (userId) {
                const hasFavorite = await this.knex("user_favorite_alcohols").where("user_id", userId).andWhere("alcohol_id", alcohol.id).first()
                if (hasFavorite) {
                    alcohol.isFavorite = true
                } else alcohol.isFavorite = false
            } else {
                alcohol.isFavorite = false
            }
        }

        if (sortBy === "price") {
            alcohols.sort((a, b) => {
                if (Number(a["averagePrice"]) > Number(b["averagePrice"])) {
                    return 1;
                }
                if (Number(a["averagePrice"]) < Number(b["averagePrice"])) {
                    return -1;
                }
                return 0;
            })
        }

        if (sortBy === "avgRating") {
            alcohols.sort((a, b) => {
                if (a[sortBy] > b[sortBy]) {
                    return -1;
                }
                if (a[sortBy] < b[sortBy]) {
                    return 1;
                }
                return 0;
            })
        }

        if (typeFilter && typeFilter.length > 0) {
            const filteredAlcohols: {
                id: number
            }[] = await this.knex("alcohols")
                .whereIn("type_id", typeFilter)
            alcohols = (alcohols.filter(alcohol => {
                let pass = false
                filteredAlcohols.forEach(filteredAlcohol => {
                    (filteredAlcohol.id === alcohol.id) && (pass = true)
                })
                return pass
            }))
        }

        const count = alcohols.length

        if (pageNum) {
            const limit = 10
            const startNum = limit * (pageNum - 1)
            alcohols = alcohols.slice(startNum, startNum + limit)
        }

        return {
            count,
            alcohols
        }
    }

    async getAlcoholById(id: number, userId?: number) {
        const alcohol: {
            id: number
            name: string
            price: number
            introduction: string
            image: string
            pack: string
            alcoholsSupplier: string
            phoneNumber: number
            averagePrice: number
            isFavorite: boolean
        } = await this.knex("alcohols")
            .select(
                "alcohols.id",
                "alcohols.name",
                "alcohols.price",
                "alcohols.introduction",
                "alcohols.image",
                "alcohols.pack",
                { averagePrice: "alcohols.average_price" },
                { alcoholsSupplier: "alcohols_suppliers.name" },
                { phoneNumber: "alcohols_suppliers.phone_number" },
            )
            .where("alcohols.id", id)
            .leftJoin("alcohols_suppliers", "alcohols.alcohols_supplier_id", "alcohols_suppliers.id")
            .first()

        if (!alcohol) {
            return
        }

        if (userId) {
            const hasFavorite = await this.knex("user_favorite_alcohols").where("user_id", userId).andWhere("alcohol_id", id).first()
            if (hasFavorite) {
                alcohol.isFavorite = true
            } else alcohol.isFavorite = false
        } else {
            alcohol.isFavorite = false
        }

        return alcohol
    }

    async getAlcoholRating(alcoholId: number, pageNum: number) {
        const limit = 10
        const alcoholRating: {
            id: number
            username: string
            rating: number
            ratingDate: Date
            comment: string
        }[] = await this.knex("alcohol_ratings")
            .select(
                "alcohol_ratings.id",
                "users.name",
                "alcohol_ratings.rating",
                "alcohol_ratings.comment"
            )
            .leftJoin("users", "alcohol_ratings.user_id", "users.id")
            .where("alcohol_ratings.alcohol_id", alcoholId)
            .limit(limit)
            .offset((limit * (pageNum - 1)))

        const avgRating = await this.knex<{
            avg: string
        }>("alcohol_ratings")
            .avg("rating")
            .where("alcohol_id", alcoholId)
            .first()
        let avg = ""
        if (avgRating) {
            avg = Number(avgRating["avg"]).toFixed(2).toString()
        } else avg = "0"

        const alcoholNumberOfRating = await this.knex<{
            numberOfRating: string
        }>("alcohol_ratings")
            .count("rating as numberOfRating")
            .where("alcohol_id", alcoholId)
            .first()
        let numberOfRating = ""
        if (alcoholNumberOfRating) {
            numberOfRating = alcoholNumberOfRating["numberOfRating"]
        } else numberOfRating = "0"

        return {
            avgRating: avg,
            numberOfRating,
            ratings: alcoholRating,
        }
    }

    async getAlcoholPrice(alcoholId: number, quantity: number) {
        const price = (await this.knex("alcohols").select("price").where("id", alcoholId).first()).price * quantity
        return { price }
    }
}