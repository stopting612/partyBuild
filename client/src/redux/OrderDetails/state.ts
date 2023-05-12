export interface Event {
  date: string
  startTime: string
  endTime: string
  numberOfPeople: number
  isPay: boolean
  name : string
  deliveryAddress: string | null
  deliveryDate : string | null
  deliveryTime : string | null
  contactName: string | null
  contactPhoneNumber: string | null
}

export interface PartyRoomOrder {
  id: number
  price: number
  name: string
  image: string
  itemId: number
  openTime: []

}

export interface AlcoholOrders {
  id: number
  image: string
  name: string
  information: string
  price: number
  quantity: number
  itemId: number
}

export interface FoodOrders {
  id: number
  image: string
  name: string
  price: number
  quantity: number
  district: string
  shippingFees: number
  itemId: number
}

export interface Option {
  id?: number
  name: string
  price: number
  numberOfPeople: number
  status: boolean
}

export interface CalculatorOptions {
  numberOfAlcoholOrderPeople: number
  numberOfFoodOrderPeople: number
  numberOfPartyRoomOrderPeople: number
  options: (Option|null)[]
}

export interface OrderDetails {
    event: Event
    partyRoomOrders: PartyRoomOrder | null
    alcoholOrders: AlcoholOrders[]
    foodOrders: FoodOrders[]
    calculatorOption : CalculatorOptions
}
