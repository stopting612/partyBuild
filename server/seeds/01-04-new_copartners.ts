import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

    // new_copartners ##

    for (let i = 0; i < 20; i++) {
        const phone_number = (i < 10) ? "6434123" + i : "643412" + i
        await knex("new_copartners").insert(
            { id: (i + 1), name: ("new_copartners" + i), email: ("new_copartners" + i + "@gmail.com"), phone_number }
        );
    }

};
