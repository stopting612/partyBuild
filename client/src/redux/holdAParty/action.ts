import { push } from 'connected-react-router'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { RootState, ThunkDispatch } from 'store'
import {
  BeverageChoice,
  BeverageOrder,
  FoodChoice,
  FoodOrder,
  Options,
  PartyInfo,
  PartyRoomChoice
} from './state'

export function updateOptions(options: Options) {
  return {
    type: '@@holdAParty/UPDATE_OPTIONS' as const,
    options
  }
}

export function updatePartyInfo(partyInfo: PartyInfo) {
  return {
    type: '@@holdAParty/UPDATE_PARTY_INFO' as const,
    partyInfo
  }
}

export function updatePartyRoomReq(partyRoomReq: {
  partyRoomPerson: string
  location: string[]
  facilities: string[]
}) {
  return {
    type: '@@holdAParty/UPDATE_PARTY_ROOM_REQ' as const,
    partyRoomReq
  }
}

export function loadPartyRoomChoices(partyRoomChoices: PartyRoomChoice[]) {
  return {
    type: '@@holdAParty/LOAD_PARTY_ROOM_CHOICES' as const,
    partyRoomChoices
  }
}

export function addPartyRoomOrder(partyRoomID: number) {
  return {
    type: '@@holdAParty/ADD_PARTY_ROOM_ORDER' as const,
    partyRoomID
  }
}

export function updateFoodReq(foodReq: {
  foodPerson: string
  cuisine: string[]
}) {
  return {
    type: '@@holdAParty/UPDATE_FOOD_REQ' as const,
    foodReq
  }
}

export function loadFoodChoices(foodChoices: FoodChoice[]) {
  return {
    type: '@@holdAParty/LOAD_FOOD_CHOICES' as const,
    foodChoices
  }
}

export function addFoodOrder(foodOrder: FoodOrder) {
  return {
    type: '@@holdAParty/ADD_FOOD_ORDER' as const,
    foodOrder
  }
}

export function updateBeverageReq(beverageReq: {
  beveragePerson: string
  beverageTypes: string[]
}) {
  return {
    type: '@@holdAParty/UPDATE_BEVERAGE_REQ' as const,
    beverageReq
  }
}

export function loadBeverageChoices(beverageChoices: BeverageChoice[]) {
  return {
    type: '@@holdAParty/LOAD_BEVERAGE_CHOICES' as const,
    beverageChoices
  }
}

export function addBeverageOrder(beverageOrder: BeverageOrder) {
  return {
    type: '@@holdAParty/ADD_BEVERAGE_ORDER' as const,
    beverageOrder
  }
}

export function reset() {
  return {
    type: '@@holdAParty/RESET' as const
  }
}

export type HoldAPartyActions = ReturnType<
  | typeof updateOptions
  | typeof updatePartyInfo
  | typeof updatePartyRoomReq
  | typeof loadPartyRoomChoices
  | typeof addPartyRoomOrder
  | typeof updateFoodReq
  | typeof loadFoodChoices
  | typeof addFoodOrder
  | typeof updateBeverageReq
  | typeof loadBeverageChoices
  | typeof addBeverageOrder
  | typeof reset
>

export function fetchOptions() {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const resDistricts = await fetch(
        `${process.env.REACT_APP_API_SERVER}/party-room/districts`
      )
      const resFacilities = await fetch(
        `${process.env.REACT_APP_API_SERVER}/party-room/facility-type`
      )
      const resCuisine = await fetch(
        `${process.env.REACT_APP_API_SERVER}/restaurant/cuisine-type`
      )
      const resBeverageTypes = await fetch(
        `${process.env.REACT_APP_API_SERVER}/alcohol/types`
      )
      const districts = (await resDistricts.json())?.data.districts
      const facilities = (await resFacilities.json())?.data.facilityTypes
      const cuisine = (await resCuisine.json())?.data.cuisineTypes
      const beverageTypes = (await resBeverageTypes.json())?.data.types
      if (resDistricts.status !== 200) {
        dispatch(newNotification(districts.message))
      }
      if (resFacilities.status !== 200) {
        dispatch(newNotification(facilities.message))
      }
      if (resCuisine.status !== 200) {
        dispatch(newNotification(cuisine.message))
      }
      if (resBeverageTypes.status !== 200) {
        dispatch(newNotification(beverageTypes.message))
      }
      if (districts && facilities && cuisine && beverageTypes) {
        const result = {
          districts,
          facilities,
          cuisine,
          beverageTypes
        }
        dispatch(updateOptions(result))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function fetchPartyRoomChoices() {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    dispatch(startLoading())
    const holdAPartyState = getState().holdAParty
    const { partyRoomPerson, date, startTime, endTime } =
      holdAPartyState.partyDetails
    const { location, facilities } = holdAPartyState.partyRequirements
    try {
      const res = await fetch(
        `${
          process.env.REACT_APP_API_SERVER
        }/new-party/party-room/?people-number=${partyRoomPerson}&date=${date}&start=${startTime}&end=${endTime}
        &districts=${encodeURIComponent(JSON.stringify(location))}
        &facility=${encodeURIComponent(JSON.stringify(facilities))}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(loadPartyRoomChoices(result.data.partyRooms))
        if (result.data.partyRooms.length) {
          dispatch(push('/hold-a-party/party-room-choice'))
        } else {
          dispatch(newNotification('沒有搜尋結果'))
        }
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function fetchFoodChoices() {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    dispatch(startLoading())
    const holdAPartyState = getState().holdAParty
    const foodPerson = holdAPartyState.partyDetails.foodPerson
    const cuisine = holdAPartyState.partyRequirements.cuisine
    try {
      const res = await fetch(
        `${
          process.env.REACT_APP_API_SERVER
        }/new-party/menus/?people-number=${foodPerson}
        &cuisine=${encodeURIComponent(JSON.stringify(cuisine))}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(loadFoodChoices(result.data.menus))
        if (result.data.menus.length) {
          dispatch(push('/hold-a-party/food-choice'))
        } else {
          dispatch(newNotification('沒有搜尋結果'))
        }
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function fetchBeverageChoices() {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    dispatch(startLoading())
    const holdAPartyState = getState().holdAParty
    const beverageTypes = holdAPartyState.partyRequirements.beverageTypes
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/new-party/alcohols/
        ?type=${encodeURIComponent(JSON.stringify(beverageTypes))}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(loadBeverageChoices(result.data.alcohols))
        if (result.data.alcohols.length) {
          dispatch(push('/hold-a-party/beverage-choice'))
        } else {
          dispatch(newNotification('沒有搜尋結果'))
        }
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function createNewParty(name: string) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    const partyDetailsState = getState().holdAParty.partyDetails
    const reqBody = {
      name: name,
      partyRoom: {
        id: partyDetailsState.partyRoomOrder?.id,
        numberOfPeople: Number(partyDetailsState.partyRoomPerson),
        date: partyDetailsState.date,
        startTime: partyDetailsState.startTime,
        endTime: partyDetailsState.endTime
      },
      food: partyDetailsState.foodOrders,
      foodPerson: partyDetailsState.foodPerson,
      alcohol: partyDetailsState.beverageOrders,
      alcoholPerson: partyDetailsState.beveragePerson
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/new-shopping-basket`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(reqBody)
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(push(`/orderdetail/${result.data.shoppingBasket.id}`))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}
