import { Knex } from "knex";
import { hashPassword } from "../utils/hash"

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('party_room_orders').del();
    await knex('party_room_facilities').del();
    await knex('party_room_facility_types').del();
    await knex('party_room_ratings').del();
    await knex('party_room_open_hours').del();
    await knex('party_room_bookings').del();
    await knex('party_room_images').del();
    await knex('party_room_prices').del();
    await knex('alcohol_orders').del();
    await knex('alcohol_ratings').del();
    await knex('food_orders').del();
    await knex('restaurant_shipping_fee').del();
    await knex('restaurant_cuisine').del();
    await knex('cuisine_list').del();
    await knex('restaurant_ratings').del();
    await knex('food').del();
    await knex('user_favorite_menu').del();
    await knex('menus').del();
    await knex('restaurant_images').del();
    await knex('creator_contact').del();
    await knex('calculator_option').del();
    await knex('share_token').del();
    await knex('payment_token').del();
    await knex('party').del();
    await knex('forgot_password').del();
    await knex('email_verification').del();
    await knex('user_favorite_party_rooms').del();
    await knex('user_favorite_alcohols').del();
    await knex('party_rooms').del();
    await knex('hong_kong_districts').del();
    await knex('hong_kong_areas').del();
    await knex('alcohols').del();
    await knex('alcohol_types').del();
    await knex('alcohols_suppliers').del();
    await knex('restaurants').del();
    await knex('copartner_accounts').del();
    await knex('users').del();
    await knex('new_copartners').del();
    await knex('admins').del();

    // users ##

    // Inserts seed entries
    let users = [
        { id: 1, name: "user_ben", password: "123", email: "kbawto@gmail.com" },
        { id: 2, name: "user_ting", password: "123", email: "ting@gmail.com" },
        { id: 3, name: "user_roy", password: "123", email: "roy@gmail.com" },
        { id: 4, name: "user_victor", password: "123", email: "victor@gmail.com" }
    ]

    for (let user of users) {
        user.password = await hashPassword(user.password)
        await knex("users").insert(user)
    }
};
