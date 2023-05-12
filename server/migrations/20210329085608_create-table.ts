import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("admins", (table) => {
        table.increments();
        table.string("name").unique()
        table.string("password")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("new_copartners", (table) => {
        table.increments();
        table.string("name")
        table.string("email").unique()
        table.string("phone_number")
        table.string("state").defaultTo("未處理")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("users", (table) => {
        table.increments();
        table.string("name")
        table.string("password")
        table.string("email")
        table.boolean("email_check").defaultTo(false)
        table.timestamps(false, true)
    })

    await knex.schema.createTable("copartner_accounts", (table) => {
        table.increments();
        table.string("name")
        table.string("password")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("restaurants", (table) => {
        table.increments();
        table.string("name")
        table.text("introduction")
        table.string("phone_number")
        table.text("location")
        table.integer("account_id")
        table.foreign('account_id').references('copartner_accounts.id');
        table.timestamps(false, true)
    })

    await knex.schema.createTable("alcohols_suppliers", (table) => {
        table.increments();
        table.string("name")
        table.string("phone_number")
        table.text("introduction")
        table.integer("account_id")
        table.foreign('account_id').references('copartner_accounts.id');
        table.timestamps(false, true)
    })

    await knex.schema.createTable("alcohol_types", (table) => {
        table.increments();
        table.string("type")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("alcohols", (table) => {
        table.increments();
        table.string("name")
        table.string("price")
        table.integer("alcohols_supplier_id")
        table.foreign('alcohols_supplier_id').references('alcohols_suppliers.id');
        table.text("introduction")
        table.string("image")
        table.integer("type_id")
        table.foreign('type_id').references('alcohol_types.id');
        table.text("pack")
        table.integer("average_price")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("hong_kong_areas", (table) => {
        table.increments();
        table.string("area")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("hong_kong_districts", (table) => {
        table.increments();
        table.string("district")
        table.integer("area_id")
        table.foreign('area_id').references('hong_kong_areas.id');
        table.timestamps(false, true)
    })

    await knex.schema.createTable("party_rooms", (table) => {
        table.increments();
        table.string("name")
        table.text("address")
        table.integer("district_id")
        table.foreign('district_id').references('hong_kong_districts.id');
        table.time('start_time')
        table.time('end_time')
        table.string('phone_number')
        table.text('introduction')
        table.integer('account_id')
        table.foreign('account_id').references('copartner_accounts.id');
        table.integer('whatsapp')
        table.integer('area')
        table.text('important_matter')
        table.string('contact_person')
        table.string('email')
        table.integer('max_number_of_people')
        table.integer('min_number_of_people')
        table.timestamps(false, true)
    })

    await knex.schema.createTable("user_favorite_alcohols", (table) => {
        table.increments();
        table.integer("user_id")
        table.foreign('user_id').references('users.id');
        table.integer("alcohol_id")
        table.foreign('alcohol_id').references('alcohols.id');
        table.timestamps(false, true)
    })

    await knex.schema.createTable("user_favorite_party_rooms", (table) => {
        table.increments();
        table.integer("user_id")
        table.foreign('user_id').references('users.id');
        table.integer("party_room_id")
        table.foreign('party_room_id').references('party_rooms.id');
        table.timestamps(false, true)
    })

    await knex.schema.createTable("email_verification", (table) => {
        table.increments();
        table.integer("user_id")
        table.foreign('user_id').references('users.id');
        table.string("email")
        table.string("verification_code")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("forgot_password", (table) => {
        table.increments();
        table.integer("user_id")
        table.foreign('user_id').references('users.id');
        table.string("verification_code")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("party", (table) => {
        table.increments();
        table.string("name")
        table.integer("creator_id")
        table.foreign('creator_id').references('users.id');
        table.date("date")
        table.integer("discount")
        table.boolean("is_pay")
        table.text("address")
        table.integer("district_id")
        table.foreign('district_id').references('hong_kong_districts.id');
        table.time("start_time")
        table.time("end_time")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("creator_contact", (table) => {
        table.increments();
        table.integer("user_id")
        table.foreign('user_id').references('users.id');
        table.integer("party_id")
        table.foreign('party_id').references('party.id');
        table.timestamps(false, true)
    })

    await knex.schema.createTable("restaurant_images", (table) => {
        table.increments();
        table.integer("restaurant_id")
        table.foreign('restaurant_id').references('restaurants.id');
        table.string("image")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("menus", (table) => {
        table.increments();
        table.integer("restaurant_id")
        table.foreign('restaurant_id').references('restaurants.id');
        table.string("name")
        table.integer("price")
        table.text("introduction")
        table.string("image")
        table.integer("max_number_of_people")
        table.integer("min_number_of_people")
        table.integer("booking_prepare_time")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("user_favorite_menu", (table) => {
        table.increments();
        table.integer("user_id")
        table.foreign('user_id').references('users.id');
        table.integer("restaurant_id")
        table.foreign('restaurant_id').references('restaurants.id');
        table.timestamps(false, true)
    })

    await knex.schema.createTable("food", (table) => {
        table.increments();
        table.integer("menu_id")
        table.foreign('menu_id').references('menus.id');
        table.string("name")
        table.integer("quantity")
        table.string("image")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("food_orders", (table) => {
        table.increments();
        table.integer("party_id")
        table.foreign('party_id').references('party.id');
        table.integer("quantity")
        table.integer("price")
        table.text("special_requirement")
        table.string("state")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("restaurant_ratings", (table) => {
        table.increments();
        table.integer("menus_id")
        table.foreign('menus_id').references('menus.id');
        table.integer("user_id")
        table.foreign('user_id').references('users.id');
        table.integer("rating")
        table.text("comment")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("cuisine_list", (table) => {
        table.increments();
        table.string("cuisine")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("restaurant_cuisine", (table) => {
        table.increments();
        table.integer("menus_id")
        table.foreign('menus_id').references('menus.id');
        table.integer("cuisine_id")
        table.foreign('cuisine_id').references('cuisine_list.id');
        table.timestamps(false, true)
    })

    await knex.schema.createTable("restaurant_shipping_fee", (table) => {
        table.increments();
        table.integer("restaurant_id")
        table.foreign('restaurant_id').references('menus.id');
        table.integer("price")
        table.integer("hong_kong_area_id")
        table.foreign('hong_kong_area_id').references('hong_kong_areas.id');
        table.timestamps(false, true)
    })

    await knex.schema.createTable("alcohol_ratings", (table) => {
        table.increments();
        table.integer("alcohol_id")
        table.foreign('alcohol_id').references('alcohols.id');
        table.integer("user_id")
        table.foreign('user_id').references('users.id');
        table.integer("rating")
        table.text("comment")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("alcohol_orders", (table) => {
        table.increments();
        table.integer("party_id")
        table.foreign('party_id').references('party.id');
        table.integer("alcohol_id")
        table.foreign('alcohol_id').references('alcohols.id');
        table.integer("quantity")
        table.integer("price")
        table.text("special_requirement")
        table.string("states")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("party_room_prices", (table) => {
        table.increments();
        table.integer("party_room_id")
        table.foreign('party_room_id').references('party_rooms.id');
        table.time("start_time")
        table.time("end_time")
        table.integer("weekday_price")
        table.integer("weekend_price")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("party_room_images", (table) => {
        table.increments();
        table.integer("party_room_id")
        table.foreign('party_room_id').references('party_rooms.id');
        table.string("image")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("party_room_bookings", (table) => {
        table.increments();
        table.integer("party_room_id")
        table.foreign('party_room_id').references('party_rooms.id');
        table.timestamp("booking_start_time")
        table.timestamp("booking_end_time")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("party_room_open_hours", (table) => {
        table.increments();
        table.integer("party_room_id")
        table.foreign('party_room_id').references('party_rooms.id');
        table.timestamp("open_time")
        table.timestamp("close_time")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("party_room_ratings", (table) => {
        table.increments();
        table.integer("party_room_id")
        table.foreign('party_room_id').references('party_rooms.id');
        table.integer("user_id")
        table.foreign('user_id').references('users.id');
        table.text("comment")
        table.integer("rating")
        table.integer("price_rating")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("party_room_facility_types", (table) => {
        table.increments();
        table.string("type")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("party_room_facilities", (table) => {
        table.increments();
        table.integer("party_room_id")
        table.foreign('party_room_id').references('party_rooms.id');
        table.integer("types_id")
        table.foreign('types_id').references('party_room_facility_types.id');
        table.timestamps(false, true)
    })

    await knex.schema.createTable("facilities_details", (table) => {
        table.increments();
        table.integer("party_room_id")
        table.foreign('party_room_id').references('party_rooms.id');
        table.text("detail")
        table.timestamps(false, true)
    })

    await knex.schema.createTable("party_room_orders", (table) => {
        table.increments();
        table.integer("party_id")
        table.foreign('party_id').references('party.id');
        table.integer("party_room_id")
        table.foreign('party_room_id').references('party_rooms.id');
        table.integer("price")
        table.text("special_requirement")
        table.string("states")
        table.integer("number_of_people")
        table.timestamps(false, true)
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('party_room_orders');
    await knex.schema.dropTable('facilities_details');
    await knex.schema.dropTable('party_room_facilities');
    await knex.schema.dropTable('party_room_facility_types');
    await knex.schema.dropTable('party_room_ratings');
    await knex.schema.dropTable('party_room_open_hours');
    await knex.schema.dropTable('party_room_bookings');
    await knex.schema.dropTable('party_room_images');
    await knex.schema.dropTable('party_room_prices');
    await knex.schema.dropTable('alcohol_orders');
    await knex.schema.dropTable('alcohol_ratings');
    await knex.schema.dropTable('restaurant_shipping_fee');
    await knex.schema.dropTable('restaurant_cuisine');
    await knex.schema.dropTable('cuisine_list');
    await knex.schema.dropTable('restaurant_ratings');
    await knex.schema.dropTable('food_orders');
    await knex.schema.dropTable('food');
    await knex.schema.dropTable('user_favorite_menu');
    await knex.schema.dropTable('menus');
    await knex.schema.dropTable('restaurant_images');
    await knex.schema.dropTable('creator_contact');
    await knex.schema.dropTable('party');
    await knex.schema.dropTable('forgot_password');
    await knex.schema.dropTable('email_verification');
    await knex.schema.dropTable('user_favorite_party_rooms');
    await knex.schema.dropTable('user_favorite_alcohols');
    await knex.schema.dropTable('party_rooms');
    await knex.schema.dropTable('hong_kong_districts');
    await knex.schema.dropTable('hong_kong_areas');
    await knex.schema.dropTable('alcohols');
    await knex.schema.dropTable('alcohol_types');
    await knex.schema.dropTable('alcohols_suppliers');
    await knex.schema.dropTable('restaurants');
    await knex.schema.dropTable('copartner_accounts');
    await knex.schema.dropTable('users');
    await knex.schema.dropTable('new_copartners');
    await knex.schema.dropTable('admins');
}

