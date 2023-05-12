import { RootState, ThunkDispatch } from 'store'
import { OrderDetails, Option } from 'redux/OrderDetails/state'
import { newNotification } from 'redux/notifications/action'
import { error, finishLoading, startLoading } from 'redux/loading/action'

export function getOrderDetail(result: OrderDetails) {
  return {
    type: '@@getOrderDetail' as const,
    result
  }
}

export function updateCalculatorOption(calculatorOption: Option) {
  return {
    type: '@@getOrderDetail/UPDATE_CACULATOR' as const,
    calculatorOption
  }
}

export function updateNumberOfFoodOrderPeople(numberOfFoodOrderPeople: number) {
  return {
    type: '@@getOrderDetail/UPDATE_NUMBER_OF_FOOD_ORDER_PEOPLE' as const,
    numberOfFoodOrderPeople: numberOfFoodOrderPeople
  }
}

export function addCalculatorOption(option: Option) {
  return {
    type: '@@getOrderDetail/ADD_CACULATOROPTION' as const,
    option
  }
}

export function deleteCalculatorOption(optionID: number) {
  return {
    type: '@@getOrderDetail/DELETE_CACULATOROPTION' as const,
    optionID
  }
}

export function updateNumberOfAlcoholPeople(
  numberOfAlcoholOrderPeople: number
) {
  return {
    type: '@@getOrderDetail/UPDATE_NUMBER_OF_AlCOLHOL_PEOPLE' as const,
    numberOfAlcoholOrderPeople
  }
}

export function updateNumberOfPartyRoomPeople(
  numberOfPartyRoomOrderPeople: number
) {
  return {
    type: '@@getOrderDetail/UPDATE_NUMBER_OF_PARTYROOM_PEOPLE' as const,
    numberOfPartyRoomOrderPeople
  }
}

export function updateAlcoholStatus(status: boolean) {
  return {
    type: '@@getOrderDetail/UPDATE_ALCOHOL_STATUS' as const,
    status
  }
}

export function updateEventStartTime(startTime: string) {
  return {
    type: '@@getOrderDetail/UPDATE_STARTTIME' as const,
    startTime
  }
}

export function updateEventEndTime(endTime: string) {
  return {
    type: '@@getOrderDetail/UPDATE_ENDTIME' as const,
    endTime
  }
}
export function updateEventStartDate(startDate: string) {
  return {
    type: '@@getOrderDetail/UPDATE_STARTDATE' as const,
    startDate
  }
}

export function deletePartyRoom(partyRoomID: number) {
  return {
    type: '@@getOrderDetail/DELETE_PARTYROOM' as const,
    partyRoomID
  }
}

export function deleteAlcoholOrder(alcoholID: number) {
  return {
    type: '@@getOrderDetail/DELETE_AlCOHOLORDER' as const,
    alcoholID
  }
}
export function deleteFoodOrder(foodID: number) {
  return {
    type: '@@getOrderDetail/DELETE_FOODORDER' as const,
    foodID
  }
}

export type GetOrderDetailActions =
  | ReturnType<typeof getOrderDetail>
  | ReturnType<typeof updateCalculatorOption>
  | ReturnType<typeof addCalculatorOption>
  | ReturnType<typeof deleteCalculatorOption>
  | ReturnType<typeof updateNumberOfFoodOrderPeople>
  | ReturnType<typeof updateNumberOfAlcoholPeople>
  | ReturnType<typeof updateNumberOfPartyRoomPeople>
  | ReturnType<typeof updateAlcoholStatus>
  | ReturnType<typeof updateEventStartTime>
  | ReturnType<typeof updateEventEndTime>
  | ReturnType<typeof updateEventStartDate>
  | ReturnType<typeof deletePartyRoom>
  | ReturnType<typeof deleteAlcoholOrder>
  | ReturnType<typeof deleteFoodOrder>

export function fetchGetOrderDetail(id: number) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/shopping-basket/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getOrderDetail(result.data))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function deleteUserOrder(data: { type: string; id: number }) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/order`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderType: data.type,
            orderId: data.id
          })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(newNotification('成功移除'))
      }
    } catch {
      dispatch(error())
    }
  }
}

export function createNewCalculatorOption(
  name: string,
  price: number,
  shoppingBasketId: number
) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/calculator-option`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, price, shoppingBasketId })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        return
      }
      dispatch(addCalculatorOption(result.data))
    } catch {
      dispatch(error())
    }
  }
}

export function fetchUpdateDefaultCalculator(id: number) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    dispatch(startLoading())
    try {
      const data = getState().orderDetail.calculatorOption
      const newOptionSet = data.options.map((item) => ({
        ...item,
        status: false
      }))
      const dataSet = {
        numberOfPartyRoomOrderPeople: data.numberOfPartyRoomOrderPeople,
        numberOfAlcoholOrderPeople: data.numberOfAlcoholOrderPeople,
        numberOffoodOrderPeople: data.numberOfFoodOrderPeople,
        options: newOptionSet
      }
      const updateData = { shoppingBasketId: id, calculatorData: dataSet }
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/calculator`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(newNotification('儲存成功'))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function getWhatsappShareLink(shoppingId: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/share-link/${shoppingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (res.status !== 200) {
        const result = await res.json()
        dispatch(newNotification(result.message))
      }
    } catch {
      dispatch(error())
    }
  }
}

export function onlyReadPage(token: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/sharing?token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getOrderDetail(result.data))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function updatePartyStartDate(date: Date, id: number) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    const dateString = date.toISOString()
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/shopping-basket/date`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ date: dateString, shoppingBasketId: id })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(updateEventStartDate(dateString))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function updatePartyStartTime(date: string, shoppingBasketId: number) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/shopping-basket/start-time`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ startTime: date, shoppingBasketId })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(updateEventStartTime(date))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function updatePartyEndTime(date: string, shoppingBasketId: number) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/shopping-basket/end-time`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ endTime: date, shoppingBasketId })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(updateEventEndTime(date))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}
