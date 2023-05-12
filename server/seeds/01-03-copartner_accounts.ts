import { Knex } from "knex";
import { hashPassword } from "../utils/hash"

export async function seed(knex: Knex): Promise<void> {

    // copartner_accounts ##

    let copartners = [
        { id: 1, name: "copartner_ben", email: "kbawto@gmail.com", password: "123" },
        { id: 2, name: "copartner_ting", email: "ting@gmail.com", password: "123" },
        { id: 3, name: "copartner_roy", email: "roy@gmail.com", password: "123" },
        { id: 4, name: "copartner_victor", email: "victor@gmail.com", password: "123" }
    ]

    for (let copartner of copartners) {
        copartner.password = await hashPassword(copartner.password)
        await knex("copartner_accounts").insert(copartner)
    }
};
