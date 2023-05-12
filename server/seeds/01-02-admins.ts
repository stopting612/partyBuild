import { Knex } from "knex";
import { hashPassword } from "../utils/hash"

export async function seed(knex: Knex): Promise<void> {
    // admins ##

    let admins = [
        { id: 1, name: "admin_ben", password: "123", email: "ben@gmail.com" },
        { id: 2, name: "admin_ting", password: "123", email: "ting@gmail.com" },
        { id: 3, name: "admin_roy", password: "123", email: "roy@gmail.com" },
        { id: 4, name: "admin_victor", password: "123", email: "victor@gmail.com" }
    ]

    for (let admin of admins) {
        admin.password = await hashPassword(admin.password)
        await knex("admins").insert(admin)
    }

};
