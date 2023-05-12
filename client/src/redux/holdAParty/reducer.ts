import { HoldAPartyActions } from './action'
import { HoldAParty } from './state'

const initialState: HoldAParty = {
  partyDetails: {
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    partyRoomPerson: '',
    foodPerson: '',
    beveragePerson: '',
    partyRoomOrder: null,
    foodOrders: [],
    beverageOrders: []
  },
  partyRequirements: {
    location: [],
    facilities: [],
    cuisine: [],
    beverageTypes: []
  },
  partyRoomChoices: [],
  foodChoices: [],
  beverageChoices: [],
  options: {
    districts: [],
    facilities: [],
    cuisine: [],
    beverageTypes: []
  }
}

export const HoldAPartyReducer = (
  state: HoldAParty = initialState,
  action: HoldAPartyActions
): HoldAParty => {
  if (action.type === '@@holdAParty/UPDATE_OPTIONS') {
    return {
      ...state,
      options: action.options
    }
  }
  if (action.type === '@@holdAParty/UPDATE_PARTY_INFO') {
    return {
      ...state,
      partyDetails: {
        ...state.partyDetails,
        ...action.partyInfo
      }
    }
  }
  if (action.type === '@@holdAParty/UPDATE_PARTY_ROOM_REQ') {
    return {
      ...state,
      partyDetails: {
        ...state.partyDetails,
        partyRoomPerson: action.partyRoomReq.partyRoomPerson
      },
      partyRequirements: {
        ...state.partyRequirements,
        location: action.partyRoomReq.location,
        facilities: action.partyRoomReq.facilities
      }
    }
  }
  if (action.type === '@@holdAParty/LOAD_PARTY_ROOM_CHOICES') {
    return {
      ...state,
      partyRoomChoices: action.partyRoomChoices
    }
  }
  if (action.type === '@@holdAParty/ADD_PARTY_ROOM_ORDER') {
    return {
      ...state,
      partyDetails: {
        ...state.partyDetails,
        partyRoomOrder: {
          ...state.partyDetails.partyRoomOrder,
          id: action.partyRoomID
        }
      }
    }
  }
  if (action.type === '@@holdAParty/UPDATE_FOOD_REQ') {
    return {
      ...state,
      partyDetails: {
        ...state.partyDetails,
        foodPerson: action.foodReq.foodPerson
      },
      partyRequirements: {
        ...state.partyRequirements,
        cuisine: action.foodReq.cuisine
      }
    }
  }
  if (action.type === '@@holdAParty/LOAD_FOOD_CHOICES') {
    return {
      ...state,
      foodChoices: action.foodChoices
    }
  }
  if (action.type === '@@holdAParty/ADD_FOOD_ORDER') {
    const newFoodOrder = [...state.partyDetails.foodOrders!].concat(
      action.foodOrder
    )
    return {
      ...state,
      partyDetails: {
        ...state.partyDetails,
        foodOrders: newFoodOrder
      }
    }
  }
  if (action.type === '@@holdAParty/UPDATE_BEVERAGE_REQ') {
    return {
      ...state,
      partyDetails: {
        ...state.partyDetails,
        beveragePerson: action.beverageReq.beveragePerson
      },
      partyRequirements: {
        ...state.partyRequirements,
        beverageTypes: action.beverageReq.beverageTypes
      }
    }
  }
  if (action.type === '@@holdAParty/LOAD_BEVERAGE_CHOICES') {
    return {
      ...state,
      beverageChoices: action.beverageChoices
    }
  }
  if (action.type === '@@holdAParty/ADD_BEVERAGE_ORDER') {
    const newBeverageOrder = [...state.partyDetails.beverageOrders!].concat(
      action.beverageOrder
    )
    return {
      ...state,
      partyDetails: {
        ...state.partyDetails,
        beverageOrders: newBeverageOrder
      }
    }
  }
  if (action.type === '@@holdAParty/RESET') {
    return initialState
  }
  return state
}
