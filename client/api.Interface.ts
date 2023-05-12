// 店主Sign up / Sign in
// 店主management console
// 訂單管理
// 價格詳情 (店主視角)
// 店舖狀態
// 店舖資料
// Party room Page List
// ##揀場地##
// 到會 Page List
// ##揀到會##
// Wine Page List
// ##揀酒類##
// Party Room Description
// 到會 Description
// 酒 Description
// 用家Sign up / Sign in
// Email 驗證
// User 管理- 訂單管理
// 評分
// 加入購物清單
// 建立新的清單
// 價格詳情
// 付款介面
// Admin login
// Admin panel
// Register Form
// Edit Form
// Navbar
// User Favorite
// Share Line
// 成為店主
// 註冊店主帳號
// Home Page
// ##Profile##

// 店主Sign up / Sign in ##

// Copartner(店主) Login POST "/api/v1/copartner/login"

// Request
export interface CopartnerLoginForm {
    email: string,
    password: string
}

// Response
export interface CopartnerLoginResponse {
    message: string
}

// Copartner(店主) Logout GET "/api/v1/copartner/logout"

// Request

// Response
export interface CopartnerLogoutResponse {
    message: string
}


// 店主management console ##

// Get Copartner(店主) Stores GET "/api/v1/copartner/stores"

// Request
export interface GetCopartnerStores {
    copartnerId: number,
}

// Response
export interface GetCopartnerStoresResponse {
    message: string,
    data: Array<{
        name: string,
        id: number
    }>
}

// Get Copartner(店主) Today’s Orders GET “/api/v1/copartner/today-orders”

// Request
export interface GetCopartnerTodayOrders {
    copartnerId: number,
}

// Response
export interface GetCopartnerTodayOrdersResponse {
    message: string,
    data: {
        orders: Array<{
            id: number,
            storeName: string,
            clientName: string,
            date: Date,
            startTime: string | Date,
            endTime: string | Date,
        }>
    }
}

// Get Copartner(店主) Orders GET “/api/v1/copartner/orders”

// Request
export interface GetCopartnerOrders {
    copartnerID: number,
}

// Response
export interface GetCopartnerOrdersResponse {
    message: string,
    data: {
        orders: Array<{
            id: number,
            storeName: string,
            clientName: string,
            date: Date,
            states: string,
        }>
    }
}

// 訂單管理 ##

// Get Copartner(店主)  Detail Orders Get Get “/api/v1/copartner/detail-orders/:page”

// Request
export interface GetCopartnerDetailOrders {
    copartnerID: number,
    pageNum: number,
}

// Response
export interface GetCopartnerDetailOrdersResponse {
    message: string,
    data: {
        count: number
        partyRoomOrders: Array<{
            id: number,
            storeName: string,
            clientName: string,
            date: string,
            startTime: string | Date,
            endTime: string | Date,
            numberOfMember: number,
            states: string,
            'special_requirement': string
        }>
    }
}

// Update Order states PUT “/api/v1/copartner/order-states-confirm/:id”

// Request

// Response
export interface ConfirmCopartnerOrderStatesResponse {
    message: string
}

// Cancel Order states: PUT “/api/v1/copartner/order-states-cancel/:id”

// Request

// Response
export interface CancelCopartnerOrderStatesResponse {
    message: string
}

// 價格詳情 (店主視角) ##

// Get order by id GET “/api/v1/copartner/order/:id

// Request

// Response
export interface GetCopartnerOrderByIdResponse {
    message: string,
    data: {
        party: {
            id: number,
            name: string,
            date: string,
            startTime: string,
            endTime: string,
        },
        order: {
            partyRoom: {
                name: string,
                price: string,
                numberOfPeople: number
            },
            menu: Array<{
                name: string,
                quantity: number,
                price: string
            }>,
            alcohol: Array<{
                name: string,
                quantity: number,
                price: string
            }>
        }
        user: {
            name: string,
            phoneNumber: string
            date: Date
            time: string
            district: string
            address: string
            specialRequirement: string
        }
    }
}


// 店舖狀態 ##

// Get copartner’s party rooms GET “/api/v1/copartner/party-rooms”

// Request
export interface getCopartnerPartyRooms {
    copartnerId: number,
}

// Response
export interface GetCopartnerPartyRoomsResponse {
    message: string,
    data: {
        partyRooms: Array<{
            name: string,
            id: number
        }>
    }
}

// Get party room open time by id GET “/api/v1/copartner/party-room-open-time/:id”

// Request
export interface GetPartyRoomOpenTimeById {
    partyRoomId: number;
}

// Response
export interface GetPartyRoomOpenTimeByIdResponse {
    message: string,
    data: {
        openTimes: Array<{
            id: number,
            date: string,
            startTime: string,
            endTime: string,
            isBook: boolean
        }>
    }
}

// Post party room open time POST “/api/v1/copartner/party-room-open-time”

// Request
export interface PostPartyRoomOpenTime {
    openTimes: Array<{
        openTimeIndex: number,
        partyRoomId: number,
        date: Date,
        startTime: string,
        endTime: string
    }>
}

// Response
export interface PostPartyRoomOpenTimeResponse {
    message: string,
    data: {
        conflictIndex: Array<number>
    }
}

// Update party room open time PUT “/api/v1/copartner/party-room-open-time”

// Request
export interface UpdatePartyRoomOpenTime {
    id: number,
    date: Date,
    startTime: Date,
    endTime: Date
}

// Response
export interface UpdatePartyRoomOpenTimeResponse {
    message: string
}

// Delete party room open time by id DELETE “/api/v1/copartner/party-room-open-time/:id”

// Request

// Response
export interface DeletePartyRoomOpenTimeByIdResponse {
    message: string
}

// 店舖資料 ##

// Get store data by id GET “/api/v1/copartner/store-data/:id”

// Request

// Response
export interface GetStoreDataByIdResponse {
    message: string,
    data: {
        id: number
        name: string
        address: string
        districtId: number
        area: number
        maxPeople: number
        minPeople: number
        introduction: string
        image: string
        facilities: Array<{
            id: number
            type: string
            isAvailable: boolean
        }>
        facilitiesDetail: string
        importantMatter: string
        contactPerson: string
        contactNumber: number
        whatsapp: number
        email: string,
        remark: string,
    }
}

// Update store data PUT “/api/v1/copartner/store-data"

// Request
export interface UpdateStoreData {
    id: number
    storeName: string
    address: string
    area: number
    districtId: number
    // district : id
    maxPeople: number
    minPeople: number
    introduction: string
    image: string
    facilities: Array<number>
    // [ facility : id ]
    facilitiesDetail: string
    importantMatter: string
    contactPerson: string
    contactNumber: number
    whatsapp: number
    email: string,
}

// Response
export interface UpdateStoreDataResponse {
    message: string
}

// Party room Page List ##

// Get recommend (小編推介) party room GET “/api/v1/party-room/recommend/:id”

// Request

// Response
export interface GetRecommendPartyRoomResponse {
    message: string,
    data: {
        id: number
        image: string
        name: string
        introduction: string
        numberOfRating: string
        avgRating: string
        price: string
        district: string
    }
}

// Get party room facility type GET “/api/v1/party-room/facility-type”

// Request

// Response
export interface GetPartyRoomFacilityTypeResponse {
    message: string,
    data: {
        facilityTypes: Array<{
            id: number,
            type: string
        }>
    }
}

// Get party room districts GET “/api/v1/party-room/districts”

// Request

// Response
export interface GetPartyRoomDistrictsResponse {
    message: string,
    data: {
        districts: Array<{
            id: number,
            name: string
        }>
    }
}

// Get , sort and filter party rooms GET “/api/v1/party-room?” 

// Request
export interface GetPartyRooms {
    sort?: string,
    // (“price” , "avgRating")
    facility?: Array<number>
    // [ facility : id ]
    districts?: Array<number>
    // [ district : id ]
    "people-quantity"?: number
    date?: Date
    start?: string,
    end?: string,
    page?: number,
    "search-word"?: string
}

// Response
export interface GetPartyRoomsResponse {
    message: string
    data: {
        count: number
        partyRooms: Array<{
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            price: string
            district: string
            isFavorite: boolean
        }>
    }
}

// ##揀場地##

// Get party room facility type GET “/api/v1/party-room/facility-type”

// Request

// Response
export interface GetPartyRoomFacilityTypeResponse {
    message: string,
    data: {
        facilityTypes: Array<{
            id: number,
            type: string
        }>
    }
}

// Get party room districts GET “/api/v1/party-room/districts”

// Request

// Response
export interface GetPartyRoomDistricts {
    message: string,
    data: {
        districts: Array<{
            id: number,
            name: string
        }>
    }
}

// Get user chose party room GET  “/api/v1/new-party/party-room?”

// Request
export interface GetUserChoicePartyRoom {
    "people-number": number
    date: Date
    start: string
    end: string
    facility: Array<number>
    // [id: number]
    districts: Array<number>
    // [id: number]
}

// Response
export interface GetUserChoicePartyRoomResponse {
    message: string
    data: {
        partyRooms: Array<{
            id: number
            image: string
            name: string
            introduction: string
            numberOfRating: string
            avgRating: string
            price: string
            district: string
        }>
    }
}

// 到會 Page List ##

// Get recommend (小編推介) restaurant GET "/api/v1/restaurant/recommend/:id”

// Request

// Response
export interface GetRecommendRestaurantResponse {
    message: string,
    data: {
        id: number
        image: string,
        name: string,
        numberOfRating: string
        avgRating: string
        introduction: string
        price: string
        shippingFree: boolean
    }
}

// Get restaurant cuisine type GET “/api/v1/restaurant/cuisine-type”

// Request

// Response
export interface GetRestaurantCuisineTypeResponse {
    message: string,
    data: {
        cuisineTypes: Array<{
            id: number,
            type: string
        }>
    }
}

// Get , sort and filter menu GET “/api/v1/restaurant/menu?”

// Request
export interface GetRestaurantMenu {
    sort?: string
    // (“price” , “avgRating”)
    "people-number"?: number
    cuisine?: Array<number>
    // [ cuisine : id ]
    "search-word": string
}

// Response
export interface GetRestaurantMenuResponse {
    message: string,
    data: {
        menus: Array<{
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            price: string
            shippingFree: boolean
            isFavorite: boolean
        }>
    }
}

// Wine Page List ##

// Get recommend alcohol GET “/api/v1/alcohol/recommend/:id”

// Request

// Response
export interface GetRecommendAlcoholResponse {
    message: string,
    data: {
        alcohol: {
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            pack: string
            averagePrice: string
            shippingFree: boolean
        }
    }
}

// Get alcohol types GET “/api/v1/alcohol/types”

// Request

// Response
export interface GetAlcoholTypesResponse {
    message: string,
    data: {
        types: Array<{
            id: number
            name: string
        }>
    }
}

// Get , sort and filter alcohols GET “/api/v1/alcohol?”

// Request
export interface GetAlcohols {
    sort: string
    //  (“price” , “avgRating”)
    type: Array<number>
    // [ type : id]P
    page: number
    "search-word": string
}

// Response
export interface GetAlcoholsResponse {
    message: string
    data: {
        count: number
        alcohols: Array<{
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            price: string
            shippingFree: boolean
            isFavorite: boolean
        }>
    }

}

// Party Room Description ##

// Get party room by id GET “/api/v1/party-room/:id”

// Request

// Response
export interface GetPartyRoomByIdResponse {
    message: string
    data: {
        partyRoom: {
            id: number
            image: string
            phoneNumber: number
            name: string
            area: number
            maxNumberOfPeople: number
            minNumberOfPeople: number
            address: string
            introduction: string
            district: string
            facilities: Array<{
                id: number
                name: string
                isAvailable: boolean
            }>
            facilitiesDetails: Array<string>
            prices: Array<{
                startTime: string
                endTime: string
                weekdayPrice: string
                weekendPrice: string
            }>
            remark: string
            // (備注)
            importantMatter: Array<string>
            minNumberOfConsumers: string
            priceOfOvertime: string
            isFavorite: boolean
        }
    }
}

// Get party room rating GET “/api/v1/party-room/rating/:partyRoomId/:pageNum”

// Request
export interface GetPartyRoomRating {
    partyRoomId: number
    pageNum: number
}

// Response
export interface GetPartyRoomRatingResponse {
    message: string
    data: {
        avgRating: string
        numberOfRating: string
        ratings: Array<{
            rating: {
                id: number
                username: string
                rating: string
                ratingDate: Date
                comment: string
            }
        }>
    }
}

// Get party room price GET “/api/v1/party-room/price?”

// Request
export interface GetPartyRoomPrice {
    id: number
    date: Date
    start: string
    end: string
    numberOfPeople: number
}

// Response
export interface GetPartyRoomPriceResponse {
    message: string
    data: {
        price: string
    }
}

// Add PartyRoomOrder to shoppingBag POST “/api/v1/users/add-party-room-order”

// Request
export interface AddPartyRoomOrder {
    partyRoomId: number
    shoppingBagId: number
    numberOfPeople: number
    date: Date
    startTime: string
    endTime: string
}

// Response
export interface AddPartyRoomOrderResponse {
    message: string
}

// 到會 Description ##


// Get menu by id Get “/api/v1/restaurant/menu/:id”

// Request

// Response
export interface GetMenuByIdResponse {
    message: string
    data: {
        id: number
        price: string
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
    }
}

// Get restaurant rating GET “/api/v1/restaurant/rating/:menuId/:pageNum”

// Request
export interface GetMenuRating {
    menuId: number
    pageNum: number
}

// Response
export interface GetMenuRatingResponse {
    message: string
    data: {
        avgRating: number
        numberOfRating: number
        ratings: Array<{
            id: number
            username: string
            rating: number
            ratingDate: string
            comment: string
        }>
    }
}


// Get party room districts GET “/api/v1/party-room/districts”

// Request

// Response
export interface GetPartyRoomDistrictsResponse {
    message: string,
    data: {
        districts: Array<{
            id: number,
            name: string
        }>
    }
}

// Get menu price Get “/api/v1/restaurant/menu-price?”

// Request
export interface GetMenuPrice {
    id: number
    quantity: number
    "shipping_fee_id": number
}

// Response
export interface GetMenuPriceResponse {
    message: string
    data: {
        price: string
        shippingFee: string
    }
}

// Add FoodOrder to shoppingBag POST “/api/v1/users/add-food-order”

// Request
export interface AddFoodOrder {
    menuId: number
    shoppingBagId: number
    shippingFeeId: number
    quantity: number
}

// Response
export interface AddFoodOrderResponse {
    message: string
}


// ##揀到會##

// Get restaurant cuisine type GET “/api/v1/restaurant/cuisine-type”

// Request

// Response
export interface GetRestaurantCuisineTypeResponse {
    message: string,
    data: {
        cuisineTypes: Array<{
            id: number,
            type: string
        }>
    }
}

// Get user choice menus GET “/api/v1/new-party/menus?”

// Request
export interface GetUserChoiceMenus {
    "people-number": number
    cuisine: Array<number>
    // [ cuisine : id ]
}

// Response
export interface GetUserChoiceMenusResponse {
    message: string,
    data: {
        menus: {
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            introduction: string
            price: number
            shippingFree: boolean
            shippingFees: Array<{
                id: number
                price: number
                area: string
            }>
        }
    }
}

// 酒 Description ##

// Get alcohol by id Get “/api/v1/alcohol/:id”

// Request

// Response
export interface GetAlcoholByIdResponse {
    message: string
    data: {
        id: number
        image: string
        phoneNumber: number
        name: string
        alcoholsSupplier: string
        pack: string
        averagePrice: number
        price: number
        introduction: string
        isFavorite: boolean
    }
}

// Get alcohol rating GET “api/v1/alcohol/rating/:alcoholId/:pageNum”

// Request
export interface GetAlcoholRating {
    alcoholId: number
    pageNum: number
}

// Response
export interface GetAlcoholRatingResponse {
    message: string
    data: {
        avgRating: number
        numberOfRating: number
        ratings: Array<{
            id: number
            username: string
            rating: number
            ratingDate: Date
            comment: string
        }>
    }
}

// Get alcohol price Get “/api/v1/alcohol/price?”

// Request
export interface GetAlcoholPrice {
    id: number
    quantity: number
}

// Response
export interface GetAlcoholPriceResponse {
    message: string
    data: {
        price: string
    }
}

// Add Alcohol Order to shoppingBag POST “/api/v1/users/add-alcohol-order”

// Request
export interface AddAlcoholOrder {
    alcoholId: number
    shoppingBagId: number
    quantity: number
}

// Response
export interface AddAlcoholOrderResponse {
    message: string
}

// ##揀酒類##


// Get alcohol types GET “/api/v1/alcohol/types”

// Request

// Response
export interface GetAlcoholTypesResponse {
    message: string,
    data: {
        types: Array<{
            id: number
            name: string
        }>
    }
}

// Get user choice alcohols GET  “/api/v1/new-party/alcohols”

// Request
export interface GetUserChoiceAlcohols {
    type: Array<number>
    // [ type : Id ]

}

// Response
export interface GetUserChoiceAlcoholsResponse {
    message: string,
    data: {
        alcohols: {
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            pack: string
            averagePrice: string
            shippingFree: boolean
        }
    }
}

// Post new shoppingBasket POST  “/api/v1/users/new-shopping-basket”

// Request
export interface CreateNewShoppingBasket {
    name: string
    partyRoom?: {
        id: number
        numberOfPeople: number
        date: Date
        startTime: string
        endTime: string
    },
    food?: Array<{
        id: number
        quantity: number
        shippingFeeId: number
    }>,
    alcohol?: Array<{
        id: number,
        quantity: number
    }>
}

// Response
export interface CreateNewShoppingBasketResponse {
    message: string
    data: {
        shoppingBasket: {
            id: number
            name: string
        }
    }
}

// Response
export interface CreateNewPartyResponse {
    message: string
    shoppingBagId: number
}

// 用家Sign up / Sign in ##

// Register User Account POST “/api/v1/users/register”

// Request
export interface UserRegister {
    name: string
    password: string
    email: string
}

// Response
export interface UserRegisterResponse {
    message: string
}

// User Login POST “/api/v1/users/login”

// Request
export interface UserLogin {
    email: string
    password: string
}

// Response
export interface UserLoginResponse {
    message: string
    token: string
}

// Email 驗證

// Email Verification: GET “/api/v1/users/email-verification?”

// Request
export interface EmailVerification {
    token: string
}

// Response
export interface EmailVerificationResponse {
    message: string
    token: string
}

// User 管理- 訂單管理 ## 

// Get user’s shoppingBasket GET “/api/v1/users/shopping-basket?”

// Request
export interface GetUserShoppingBasket {
    page: number
    // page >= 1
}

// Response
export interface GetUserShoppingBasketResponse {
    message: string
    data: {
        count: number
        shoppingBaskets: Array<{
            id: number
            name: string
            date: Date
            startTime: string
            endTime: string
            image: string
        }>
    }
}

// Get user History GET “/api/v1/users/shopping-basket-history?”

// Request
export interface GetUserShoppingBasketHistory {
    page: number
    // page >= 1
}

// Response
export interface GetUserShoppingBasketHistoryResponse {
    message: string
    data: {
        shoppingBaskets: {
            id: number
            name: string
            date: Date
            startTime: string
            endTime: string
        }
    }
}

// Delete shopping basket: DELETE “/api/v1/users/shopping-basket/:shoppingBasketId”

// Request
export interface DeleteShoppingBasketById {
    shoppingBasketId: number
}

// Response
export interface DeleteShoppingBasketByIdResponse {
    message: string
}

// 評分

// Get History Order : GET “/api/v1/users/history-order?”

// Request
export interface GetHistoryOrder {
    "shopping-basket-id": number
}

// Response
export interface GetHistoryOrderResponse {
    message: string
    data: {
        partyRoom: {
            id: number
            name: string
            rating: number,
            comment: string
            shoppingBasketId: number
        },
        alcohol: Array<{
            id: number
            name: string
            rating: number,
            comment: string
            shoppingBasketId: number
        }>,
        food: Array<{
            id: number
            name: string
            rating: number,
            comment: string
            shoppingBasketId: number
        }>
    }
}

// User give rating: POST “/api/v1/users/rating” 

// Request
export interface AddUserRating {
    partyRoom: {
        id: number
        rating: number,
        comment: string
        shoppingBasketId: number
    },
    alcohols: Array<{
        id: number
        name: string
        rating: number,
        comment: string
        shoppingBasketId: number
    }>,
    foods: Array<{
        id: number
        name: string
        rating: number,
        comment: string,
        shoppingBasketId: number
    }>
}

// Response
export interface AddUserRatingResponse {
    message: string
}

// 加入購物清單 ##

// Get user’s shoppingBasket GET “/api/v1/users/shopping-basket?”

// Request
export interface GetUserShoppingBasket {
    page: number
    // page >= 1
}

// Response
export interface GetUserShoppingBasketResponse {
    message: string
    data: {
        count: number
        shoppingBaskets: Array<{
            id: number
            name: string
            date: Date
            startTime: string
            endTime: string
            image: string
        }>
    }
}

// 建立新的清單 ##

// Post new shoppingBasket POST  “/api/v1/users/new-shopping-basket”

// Request
export interface CreateNewShoppingBasket {
    name: string
    partyRoom?: {
        id: number
        numberOfPeople: number
        date: Date
        startTime: string
        endTime: string
    },
    food?: Array<{
        id: number
        quantity: number
        shippingFeeId: number
    }>,
    alcohol?: Array<{
        id: number,
        quantity: number
    }>
}

// Response
export interface CreateNewShoppingBasketResponse {
    message: string
    data: {
        shoppingBasket: {
            id: number
            name: string
        }
    }
}

// 價格詳情 ##

// Get user’s order by id GET “/api/v1/users/shopping-basket/:id”

// Request

// Response
export interface GetUserShoppingBasketByIdResponse {
    message: string
    data: {
        event: {
            name: string
            date: Date,
            startTime: string,
            endTime: string,
            numberOfPeople: number,
            isPay: boolean
        },
        partyRoomOrders: {
            id: number,
            price: number,
            name: string,
            image: string,
            itemId: number,
            openTime: Array<string>
        },
        alcoholOrders: Array<{
            id: number
            image: string
            name: string
            information: string
            price: number
            quantity: number,
            itemId: number
        }>,
        foodOrders: Array<{
            id: number
            image: string
            name: string
            price: number
            quantity: number
            district: string
            shippingFees: number,
            itemId: number
        }>,
        calculatorOption: {
            numberOfPartyRoomOrderPeople: number
            numberOfAlcoholOrderPeople: number
            numberOffoodOrderPeople: number
            options: Array<{
                id: number
                name: string
                price: number
                numberOfPeople: number
                status: boolean
                // false
            }>
        }
    }
}

// update party date: PUT “/api/v1/users/shopping-basket/date”

// Request
export interface UpdatePartyDate {
    shoppingBasketId: number,
    date: string
}

// Response
export interface UpdatePartyDateResponse {
    message: string
}

// update party start time: PUT “/api/v1/users/shopping-basket/start-time”

// Request
export interface UpdatePartyStartTime {
    shoppingBasketId: number,
    startTime: string
}

// Response
export interface UpdatePartyStartTimeResponse {
    message: string
}

// update party start time: PUT “/api/v1/users/shopping-basket/end-time”

// Request
export interface UpdatePartyEndTime {
    shoppingBasketId: number,
    endTime: string
}

// Response
export interface UpdatePartyEndTimeResponse {
    message: string
}

// Delete order DELETE “/api/v1/users/order”

// Request
export interface DeleteOrder {
    orderType: string
    // (“food” , “alcohol” ,"partyRoom")
    orderId: number
}

// Response
export interface DeleteOrderResponse {
    message: string
}

// Create new calculator-option: POST “/api/v1/users/calculator-option”

// Request
export interface CreateNewCalculatorOption {
    shoppingBasketId: number,
    name: string,
    price: number
}

// Response
export interface CreateNewCalculatorOptionResponse {
    message: string
    data: {
        id: number
        name: string
        price: number
        numberOfPeople: number
        status: boolean
    }
}

// Update calculator: PUT  “/api/v1/users/calculator”

// Request
export interface UpdateCalculatorOption {
    shoppingBasketId: number
    calculatorData: {
        numberOfPartyRoomOrderPeople: number
        numberOfAlcoholOrderPeople: number
        numberOffoodOrderPeople: number
        options: Array<{
            id: number
            name: string
            price: number
            numberOfPeople: number
            status: boolean
            // false
        }>
    }
}

// Response
export interface UpdateCalculatorOptionResponse {
    message: string
}

// Delete calculator-option: DELETE “/api/v1/users/calculator-option/:calculatorOptionId”

// Request

// Response
export interface DeleteCalculatorOptionResponse {
    message: string
}

// 付款介面 ##


// Get districts GET “/api/v1/part-room/districts”

// Request

// Response
export interface GetPartyRoomDistricts {
    message: string,
    data: {
        districts: Array<{
            id: number,
            name: string
        }>
    }
}

// Get shoppingBasket payment by id GET “/api/v1/users/shopping-basket-payment/:id”

// Request

// Response
export interface GetShoppingBasketPaymentByIdResponse {
    message: string
    data: {
        date: Date,
        startTime: string,
        endTime: string,
        districtId: number
        address: string
    }
}

// Get payment: POST “/api/v1/users/create-payment”

// Request
export interface Pay {
    contactName: string
    phoneNumber: number
    shoppingBasketId: number
    date: Date,
    startTime: string,
    address: string
    specialRequirement: string
}

// Response
export interface PayResponse {
    message: string
    data: {
        id: number
    }
}

// Admin login

// Admin login POST “/api/v1/admin/login”

// Request
export interface AdminLogin {
    email: string
    password: string
}

// Response
export interface AdminLoginResponse {
    message: string
}

// Admin panel

// Get new_copartners GET “/api/v1/admin/new-copartner”

// Request
export interface GetNewCopartner {
    page: number
}

// Response
export interface GetNewCopartnerResponse {
    message: string,
    data: {
        newCopartners: Array<{
            id: number
            name: string
            email: string
            phoneNumber: string
            state: string
        }>
    }
}

// Update NewCopartner states: PUT “/api/v1/admin/new-copartner”

// Request
export interface UpdateNewCopartnerStates {
    id: number
    state: string
    // "未處理" , "處理中" , "已完成"
}

// Response
export interface UpdateNewCopartnerStatesResponse {
    message: string,
}

// Register Form ##


// Get party room facility type GET “/api/v1/part-room/facility-type”

// Request

// Response
export interface GetPartyRoomFacilityType {
    message: string,
    data: {
        facilityTypes: Array<{
            id: number,
            type: string
        }>
    }
}


// Register party room POST “/api/v1/admin/party-room”

// Request
export interface RegisterPartyRoom {
    userEmail: string
    storeName: string
    address: string
    districtId: number
    // district : id
    area: number
    maxPeople: number
    minPeople: number
    introduction: string
    image: string
    facilities: Array<number>
    //[ facility : id ]
    facilitiesDetail: string
    importantMatter: string
    contactPerson: string
    contactNumber: number
    whatsapp: number
    email: string,
}

// Response
export interface RegisterPartyRoomResponse {
    message: string
}

// Edit Form ##


// Get party room facility type GET “/api/v1/part-room/facility-type”

// Request

// Response
export interface GetPartyRoomFacilityType {
    message: string,
    data: {
        facilityTypes: Array<{
            id: number,
            type: string
        }>
    }
}

// Get All party room : GET "/api/v1/admin/party-room"

// Request

// Response
export interface GetAllPartyRoomResponse {
    message: string,
    data: {
        partyRooms: {
            id: number,
            name: string,
        }
    }
}

// Update store room PUT “/api/v1/admin/party-room”

// Request
export interface UpdatePartyRoom {
    id: number
    storeName: string
    address: string
    districtId: number
    // district : id
    area: number
    maxPeople: number
    minPeople: number
    introduction: string
    image: string
    facilities: Array<number>
    //[ facility : id ]
    facilitiesDetail: string
    importantMatter: string
    contactPerson: string
    contactNumber: number
    whatsapp: number
    email: string,
}

// Response
export interface UpdatePartyRoomResponse {
    message: string
}

// Get store data by id GET “/api/v1/admin/party-room/:id”

// Request

// Response
export interface AdminGetPartyRoomByIdResponse {
    id: number
    name: string
    address: string
    districtId: number
    area: number
    maxPeople: number
    minPeople: number
    introduction: string
    image: string
    facilities: Array<{
        id: number
        type: string
        isAvailable: boolean
    }>
    facilitiesDetail: string
    importantMatter: string
    contactPerson: string
    contactNumber: number
    whatsapp: number
    email: string,
    remark: string,
}

// Navbar ##

// Get user name and profile picture GET “/api/v1/users/name-picture”

// Request

// Response
export interface GetUserNameAndPictureResponse {
    message: string,
    data: {
        name: string,
        picture: string
    }
}

// User Favorite ##

// Create new user favorite POST “/api/v1/users/favorite”

// Request
export interface CreateNewUserFavorite {
    type: string
    // (“food” , “alcohol” ,"partyRoom")
    id: number
}

// Response
export interface CreateNewUserFavoriteResponse {
    message: string
}

// Delete user favorite DELETE “/api/v1/users/favorite”

// Request
export interface DeleteUserFavorite {
    type: string
    // (“food” , “alcohol” ,"partyRoom")
    id: number
}

// Response
export interface DeleteUserFavoriteResponse {
    message: string
}

// Get user favorite: GET “/api/v1/users/favorite”

// Request

// Response
export interface GetUserFavorite {
    message: string
    data: {
        partyRooms: Array<{
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            price: string
            district: string
            isFavorite: boolean
        }>,
        menus: Array<{
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            price: string
            shippingFree: boolean
            isFavorite: boolean
        }>,
        alcohols: Array<{
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            price: string
            shippingFree: boolean
            isFavorite: boolean
        }>
    }
}

// Share Line ##

// Create Share Line: GET “/api/v1/users/share-link/:shoppingBasketId”

// Request
export interface GetShareLine {
    shoppingBasketId: number
}

// Response
export interface GetShareLineResponse {
    message: string
    data: {
        token: string
    }
}

// Get sharing page: GET “/api/v1/users/sharing?”

// Request
export interface GetSharePage {
    token: string
}

// Response
export interface GetSharePageResponse {
    message: string
    data: {
        event: {
            name: string
            date: Date,
            startTime: string,
            endTime: string,
            numberOfPeople: number,
            isPay: boolean
        },
        partyRoomOrders: {
            id: number,
            price: number,
            name: string,
            image: string
        },
        alcoholOrders: Array<{
            id: number
            image: string
            name: string
            information: string
            price: number
            quantity: number
        }>,
        foodOrders: Array<{
            id: number
            image: string
            name: string
            price: number
            quantity: number
            district: string
            shippingFees: number
        }>,
        calculatorOption: {
            numberOfPartyRoomOrderPeople: number
            numberOfAlcoholOrderPeople: number
            numberOffoodOrderPeople: number
            options: Array<{
                id: number
                name: string
                price: number
                numberOfPeople: number
                status: boolean
                // false
            }>
        }
    }
}

// 成為店主 ##

// Add new copartners: POST “/api/v1/copartner/new-copartners”

// Request
export interface AddNewCopartners {
    name: string
    email: string
    phoneNumber: string
}

// Response
export interface AddNewCopartnersResponse {
    message: string
}

// 註冊店主帳號 ##

// Create copartner: POST “/api/v1/copartner”

// Request
export interface CreateCopartner {
    email: string
}

// Response
export interface CreateCopartnerResponse {
    message: string
}

// Home Page

// Get home page recommend: GET “/api/v1/home-recommend” 

// Request

// Response
export interface GetHomePageRecommendResponse {
    message: string
    data: {
        partyRooms: Array<{
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            price: string
            district: string
        }>,
        menu: {
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            price: string
            shippingFree: boolean
        },
        alcohol: {
            id: number
            image: string
            name: string
            numberOfRating: string
            avgRating: string
            price: string
            shippingFree: boolean
        }
    }
}
// ##Profile##


// Get User Date: GET “/api/v1/users/profile”

// Request

// Response
export interface GetUserDateResponse {
    message: string
    data: {
        user: {
            name: string
            email: string
        }
    }
}

// Get Admin Date: GET “/api/v1/admin/profile”

// Request

// Response
export interface GetAdminDateResponse {
    message: string
    data: {
        admin: {
            name: string
            email: string
        }
    }
}

// Get Copartner Date: GET “/api/v1/copartner/profile”

// Request

// Response
export interface GetCopartnerDateResponse {
    message: string
    data: {
        copartner: {
            name: string
            email: string
        }
    }
}

// Update Profile Date: PUT “/api/v1/profile”

// Request
export interface UpdateUserDate {
    name: string
    password: string
    image: string
}

// Response
export interface UpdateUserDateResponse {
    message: string
}
