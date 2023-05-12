import { BusinessOrderListActions } from './action'

export interface IOrderList {
  id: number
  storeName: string
  clientName: string
  date: string
  startTime: string | Date
  endTime: string | Date
  numberOfMember: number
  states: string
  // eslint-disable-next-line camelcase
  special_requirement: string
  name: string
}

export interface OrderLists {
  count: number
  partyRoomOrders: IOrderList[]
}

const initialState: OrderLists = {
  count: 0,
  partyRoomOrders: []
}

export const businessOrderListReducer = (
  state: OrderLists = initialState,
  action: BusinessOrderListActions
): OrderLists => {
  if (action.type === '@@GetBusinessOrderList') {
    return {
      ...state,
      ...action.result
    }
  }
  if (action.type === '@@ConfirmBusinessOrderList') {
    const newList = state.partyRoomOrders.map((item) => {
      if (item.id !== action.id) {
        return item
      }
      return {
        ...item,
        states: '已確認'
      }
    })
    return {
      ...state,
      partyRoomOrders: newList
    }
  }
  if (action.type === '@@CancelBusinessOrderList') {
    const newList = state.partyRoomOrders.map((item) => {
      if (item.id !== action.id) {
        return item
      }
      return {
        ...item,
        states: '已取消'
      }
    })
    return {
      ...state,
      partyRoomOrders: newList
    }
  }
  return state
}
