import { Knex } from "knex";
//  import { hashPassword } from "../utils/hash";
import xlsx from "xlsx";
import path from "path";


export async function seed(knex: Knex): Promise<void> {

    const trx = await knex.transaction();

    // await knex('alcohols_suppliers').del();
    // interface alcoholType {
    //     party_name: string,
    //     alcohol_name: string,
    //     quantity: number,
    //     price: number,
    //     special_requirement: string,
    //     states: string,
    // }

    // interface calculatorOption {
    //     name: string,
    //     price: number,
    //     number_of_people: number,
    //     party_id: number,
    //     status: string,
    // }


    // interface alcoholSupplier {
    //     name: string,
    //     phone_number: number,
    //     introduction: string,
    //     account_id: number,
    // }

    // interface creatorContact {
    //     user_id: number,
    //     party_id: number,
    //     phone_number: number,
    //     contact_name: string,
    // }


    // interface emailVerification {
    //     email: string,
    //     verification_code: string,
    //     username: string,
    //     password: string,
    // }
    interface foodOrders {
        party_id: number,
        quantity: number,
        price: number,
        special_requirement: string,
        states: string,
        food_id: number,
        shipping_fee_id: number,
    }
    // interface partyTable {
    //     name: string,
    //     creator_id: number,
    //     date: Date,
    //     discount: number,
    //     is_pay: Boolean,
    //     address: string,
    //     district_id: number,
    //     start_time: Date | string,
    //     end_time: Date | string,
    //     number_of_party_room_order_people: number,
    //     number_of_alcohol_order_people: number,
    //     number_of_food_order_people: number,
    // }
    // interface partyRoomOrder {
    //     party_id: number,
    //     party_room_id: number,
    //     price: number,
    //     special_requirement: string,
    //     states: string,
    //     number_of_people: number,
    // }
    interface forgotPassword {
        user_id: number,
        verification_code: string,
    }



    // interface PartyRoomBooking {
    //     party_room_id: number,
    //     booking_start_time: Date | string,
    //     booking_end_time: Date | string,
    //     party_id: number
    // }


    // interface restaurantImage {
    //     restaurant_id: number,
    //     image: string,
    // }

    // interface restaurant {
    //     name: string,
    //     introduction: string,
    //     phone_number: number,
    //     location: string,
    //     account_id: number,
    // }




    // let workbookTwo = xlsx.readFile(path.join(__dirname, "../data", "/26_5_seed_data.xlsx"));
    // let workbookThree = xlsx.readFile(path.join(__dirname, "../data", "/26_5_seed_data.xlsx"));
    // let workbookForth = xlsx.readFile(path.join(__dirname, "../data", "/26_5_seed_data.xlsx"));
    // let workbookFifth = xlsx.readFile(path.join(__dirname, "../data", "/26_5_seed_data.xlsx"));
    // let workbookSix = xlsx.readFile(path.join(__dirname, "../data", "/26_5_seed_data.xlsx"));
    let workbookSeven = xlsx.readFile(path.join(__dirname, "../data", "/26_5_seed_data.xlsx"));
    // let workbookEight = xlsx.readFile(path.join(__dirname, "../data", "/26_5_seed_data.xlsx"));
    // let workbookNight = xlsx.readFile(path.join(__dirname, "../data", "/26_5_seed_data.xlsx"));
    let workbookTen = xlsx.readFile(path.join(__dirname, "../data", "/26_5_seed_data.xlsx"));
    // let workbookEleven = xlsx.readFile(path.join(__dirname, "../data", "/26_5_seed_data.xlsx"));
    // let workbookTwelves = xlsx.readFile(path.join(__dirname, "../data", "/26_5_seed_data.xlsx"));
    // let workbookThirteen = xlsx.readFile(path.join(__dirname, "../data", "/26_5_seed_data.xlsx"));


    // const alcoholTableSheet = workbookTwo.Sheets["alcohol_orders"]
    // const alcoholsSupplierTableSheet = workbookThree.Sheets["alcohols_suppliers"]
    // const calculatorOptionTableSheet = workbookForth.Sheets["calculator_option"]
    // const creatorContactTableSheet = workbookFifth.Sheets["creator_contact"]
    // const emailVerification = workbookSix.Sheets["email_verification"]
    const foodOrdersTableSheet = workbookSeven.Sheets["food_orders"]
    // const partyTableSheet = workbookEight.Sheets["party"]
    // const partyRoomOrderTableSheet = workbookNight.Sheets["party_room_orders"]
    const forgotPasswordTableSheet = workbookTen.Sheets["forgot_password"]
    // const partyRoomOpenTimeSheet = workbookEleven.Sheets['party_room_bookings']
    // const restaurantImageTableSheet = workbookTwelves.Sheets["restaurant_images"]
    // const restaurantTableSheet = workbookThirteen.Sheets["restaurants"]

    // const alcoholType = xlsx.utils.sheet_to_json<alcoholType>(alcoholTableSheet)
    // const alcoholSupplierType = xlsx.utils.sheet_to_json<alcoholSupplier>(alcoholsSupplierTableSheet)
    // const calculatorOption = xlsx.utils.sheet_to_json<calculatorOption>(calculatorOptionTableSheet)
    // const creatorContact = xlsx.utils.sheet_to_json<creatorContact>(creatorContactTableSheet)
    // const emailVerificationType = xlsx.utils.sheet_to_json<emailVerification>(emailVerification)
    const foodOrderType = xlsx.utils.sheet_to_json<foodOrders>(foodOrdersTableSheet)
    // const partyTable = xlsx.utils.sheet_to_json<partyTable>(partyTableSheet)
    // const partyRoomOrder = xlsx.utils.sheet_to_json<partyRoomOrder>(partyRoomOrderTableSheet)
    // const partyOpenTime = xlsx.utils.sheet_to_json<PartyRoomBooking>(partyRoomOpenTimeSheet)
    const forgotPassword = xlsx.utils.sheet_to_json<forgotPassword>(forgotPasswordTableSheet)
    // const restaurantType = xlsx.utils.sheet_to_json<restaurantImage>(restaurantImageTableSheet)
    // const restaurants = xlsx.utils.sheet_to_json<restaurant>(restaurantTableSheet)






    // const SelectedPartyRoomMapping = await knex('party_rooms')
    //     .select('id', 'name')

    // const PartyRoomMapping = SelectedPartyRoomMapping.reduce(
    //     (acc, cur) => acc.set(cur.name, cur.id),
    //     new Map<string, number>()
    // );

    const partySelect = await knex('party')
        .select('id', 'name')

    const partyMapping = partySelect.reduce(
        (acc, cur) => acc.set(cur.name, cur.id),
        new Map<string, number>()
    );

    const creatorMapping = await knex('users')
        .select('id', 'name')

    const UsersMapping = creatorMapping.reduce(
        (acc, cur) => acc.set(cur.name, cur.id),
        new Map<string, number>()
    );

    // const copartnerSelected = await knex('copartner_accounts')
    //     .select('id', 'name')

    // const copartnerMapping = copartnerSelected.reduce(
    //     (acc, cur) => acc.set(cur.name, cur.id),
    //     new Map<string, number>()
    // );

    // const alcoholDataBaseMapping = await knex('alcohols')
    //     .select('id', 'name')
    // const alcoholNewMapping = alcoholDataBaseMapping.reduce(
    //     (acc, cur) => acc.set(cur.name, cur.id),
    //     new Map<string, number>()
    // );

   

    const MenusSelected = await knex('menus')
        .select('id', 'name')

    const MenusMapping = MenusSelected.reduce(
        (acc, cur) => acc.set(cur.name, cur.id),
        new Map<string, number>()
    );

    // const RestaurantSelected = await knex('restaurants')
    // .select('id', 'name')

    // const RestaurantMapping = RestaurantSelected.reduce(
    //     (acc, cur) => acc.set(cur.name, cur.id),
    //     new Map<string, number>()
        
    // );

    const selectedShippingFee = await knex('restaurant_shipping_fee')
    .select("id", 'menus_id')
     const ShippingMapping = selectedShippingFee.reduce(
    (acc, cur) => acc.set(cur.menus_id, cur.id),
    new Map<number, number>()
  );




    
    await trx('food_orders')
        .insert(
            foodOrderType.map((foodOrder) => {
                return {
                    party_id: partyMapping.get(foodOrder.party_id),
                    quantity: foodOrder.quantity,
                    price: foodOrder.price,
                    special_requirement: foodOrder.special_requirement,
                    states: foodOrder.states,
                    food_id: MenusMapping.get(foodOrder.food_id),
                    shipping_fee_id: ShippingMapping.get(MenusMapping.get(foodOrder.food_id))
                    
                };
            })
        );
        
    await trx('forgot_password')
    .insert(
        forgotPassword.map((forgotPassword) => {
            return {
                user_id:UsersMapping.get(forgotPassword.user_id),
                verification_code:forgotPassword.verification_code
   
            };
        })
    );

    // await trx('restaurants')
    // .insert(
    //     restaurants.map((restaurant) => {
    //         return {
    //             name:restaurant.name,
    //             introduction:restaurant.introduction,
    //             phone_number:restaurant.phone_number,
    //             location:restaurant.location,
    //             account_id:copartnerMapping.get(restaurant.account_id)
   
    //         };
    //     })
    // );

    // await trx('restaurant_images')
    // .insert(
    //     restaurantType.map((restaurantPhoto) => {
    //         return {
    //             restaurant_id:RestaurantMapping.get(restaurantPhoto.restaurant_id),
    //             image:restaurantPhoto.image,
    //         };
    //     })
    // );

   

  






    // console.log(
    //     alcoholSupplierType.map((alcoholSupplier) => {
    //     return {
    //         name:alcoholSupplier.name,
    //         phone_number:alcoholSupplier.phone_number,
    //         introduction:alcoholSupplier.introduction,
    //         account_id:copartnerMapping.get(alcoholSupplier.account_id)  

    //     };
    //  })
    //  )













    await trx.commit();









};
