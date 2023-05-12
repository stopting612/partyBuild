import { GetOrderDetailActions } from './action'
import { OrderDetails } from './state'

export const initialState: OrderDetails = {
  event: {
    date: '2021-04-25T06:00:00.000Z',
    startTime: '2021-04-25T06:00:00.000Z',
    endTime: '2021-04-25T11:00:00.000Z',
    numberOfPeople: 0,
    isPay: true,
    name: '',
    deliveryAddress: null,
    deliveryDate: null,
    deliveryTime: null,
    contactName: null,
    contactPhoneNumber: null
  },
  partyRoomOrders: {
    id: 0,
    name: '',
    price: 0,
    image: '',
    itemId: 0,
    openTime: []
  },
  alcoholOrders: [],
  foodOrders: [],
  calculatorOption: {
    numberOfAlcoholOrderPeople: 1,
    numberOfFoodOrderPeople: 0,
    numberOfPartyRoomOrderPeople: 0,
    options: []
  }
}

export const getOrderDetailsReducer = (
  state: OrderDetails = initialState,
  action: GetOrderDetailActions
): OrderDetails => {
  if (action.type === '@@getOrderDetail/UPDATE_CACULATOR') {
    const newList = state.calculatorOption.options.map((item) => {
      if (item!.id !== action.calculatorOption.id) {
        return item
      }
      return action.calculatorOption
    })
    return {
      ...state,
      calculatorOption: {
        ...state.calculatorOption,
        options: newList
      }
    }
  } else if (action.type === '@@getOrderDetail/ADD_CACULATOROPTION') {
    const newCalculatorOption = [...state.calculatorOption?.options!].concat(
      action.option
    )
    return {
      ...state,
      calculatorOption: {
        ...state.calculatorOption,
        options: newCalculatorOption
      }
    }
  } else if (action.type === '@@getOrderDetail/DELETE_CACULATOROPTION') {
    // const newOptions = [...state.calculatorOption.options]
    // newOptions[action.optionID] = null
    const newOptions = state.calculatorOption.options.filter(
      (i) => i?.id !== action.optionID
    )
    return {
      ...state,
      calculatorOption: {
        ...state.calculatorOption,
        options: newOptions
      }
    }
  } else if (action.type === '@@getOrderDetail/UPDATE_STARTTIME') {
    return {
      ...state,
      event: {
        ...state.event,
        startTime: action.startTime
      }
    }
  } else if (action.type === '@@getOrderDetail/UPDATE_ENDTIME') {
    return {
      ...state,
      event: {
        ...state.event,
        endTime: action.endTime
      }
    }
  } else if (action.type === '@@getOrderDetail/DELETE_PARTYROOM') {
    return {
      ...state,
      partyRoomOrders: initialState.partyRoomOrders
    }
  } else if (
    action.type === '@@getOrderDetail/UPDATE_NUMBER_OF_FOOD_ORDER_PEOPLE'
  ) {
    return {
      ...state,
      calculatorOption: {
        ...state.calculatorOption,
        numberOfFoodOrderPeople: action.numberOfFoodOrderPeople
      }
    }
  } else if (
    action.type === '@@getOrderDetail/UPDATE_NUMBER_OF_AlCOLHOL_PEOPLE'
  ) {
    return {
      ...state,
      calculatorOption: {
        ...state.calculatorOption,
        numberOfAlcoholOrderPeople: action.numberOfAlcoholOrderPeople
      }
    }
  } else if (action.type === '@@getOrderDetail/UPDATE_STARTDATE') {
    return {
      ...state,
      event: {
        ...state.event,
        date: action.startDate
      }
    }
  } else if (action.type === '@@getOrderDetail/DELETE_AlCOHOLORDER') {
    const newList = state.alcoholOrders.filter(
      (order) => order.id !== action.alcoholID
    )
    return {
      ...state,
      alcoholOrders: newList
    }
  } else if (action.type === '@@getOrderDetail/DELETE_FOODORDER') {
    const newList = state.foodOrders.filter(
      (order) => order.id !== action.foodID
    )
    return {
      ...state,
      foodOrders: newList
    }
  } else if (
    action.type === '@@getOrderDetail/UPDATE_NUMBER_OF_PARTYROOM_PEOPLE'
  ) {
    return {
      ...state,
      calculatorOption: {
        ...state.calculatorOption,
        numberOfPartyRoomOrderPeople: action.numberOfPartyRoomOrderPeople
      }
    }
  } else if (action.type === '@@getOrderDetail') {
    return {
      ...state,
      ...action.result
    }
  }
  return state
}
