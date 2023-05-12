export interface PartyRoomOrder {
  id: number
}

export interface FoodOrder {
  id: number
  quantity: number
  shippingFeeId: number
}

export interface BeverageOrder {
  id: number
  quantity: number
}

export interface PartyRequirements {
  location: string[]
  facilities: string[]
  cuisine: string[]
  beverageTypes: string[]
}

export interface PartyRoomChoice {
  id: number
  image: string
  name: string
  introduction: string
  numberOfRating: string
  avgRating: string
  price: string
  district: string
}

export interface FoodChoice {
  id: number
  image: string
  name: string
  numberOfRating: string
  avgRating: string
  introduction: string
  price: string
  shippingFree: boolean
  shippingFees: { id: number; price: string; area: string }[]
}

export interface BeverageChoice {
  id: number
  image: string
  name: string
  introduction: string
  numberOfRating: string
  avgRating: string
  pack: string
  averagePrice: string
  shippingFree: boolean
}

export interface PartyInfo {
  date: string
  startTime: string
  endTime: string
}

export interface PartyDetails extends PartyInfo {
  name: string
  partyRoomPerson?: string
  foodPerson?: string
  beveragePerson?: string
  partyRoomOrder?: PartyRoomOrder | null
  foodOrders?: (FoodOrder | null)[]
  beverageOrders?: (BeverageOrder | null)[]
}

export interface Options {
  districts: { id: number; name: string }[]
  facilities: { id: number; type: string }[]
  cuisine: { id: number; type: string }[]
  beverageTypes: { id: number; name: string }[]
}

export interface HoldAParty {
  partyDetails: PartyDetails
  partyRequirements: PartyRequirements
  partyRoomChoices: PartyRoomChoice[]
  foodChoices: FoodChoice[]
  beverageChoices: BeverageChoice[]
  options: Options
}
