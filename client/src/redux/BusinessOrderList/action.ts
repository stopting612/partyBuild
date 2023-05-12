import { newNotification } from 'redux/notifications/action'
import { ThunkDispatch } from 'store'
import { OrderLists } from './reducer'

export function getOrderListToRedux(result: OrderLists) {
  return {
    type: '@@GetBusinessOrderList' as const,
    result
  }
}

export function confirmOrderListToRedux(id: number) {
  return {
    type: '@@ConfirmBusinessOrderList' as const,
    id
  }
}

export function cancelOrderListToRedux(id : number) {
  return {
    type: '@@CancelBusinessOrderList' as const,
    id
  }
}
export type BusinessOrderListActions =
  | ReturnType<typeof getOrderListToRedux>
  | ReturnType<typeof confirmOrderListToRedux>
  | ReturnType<typeof cancelOrderListToRedux>

export function fetchOrdersList(page: number = 1) {
  return async (dispatch: ThunkDispatch) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_SERVER}/copartner/detail-orders/${page}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    const result = await res.json()
    if (res.status !== 200) {
      dispatch(newNotification(result.message))
      return
    }
    dispatch(getOrderListToRedux(result.data))
  }
}

// Update Order states PUT “/api/v1/copartner/order-states-confirm/:id”
export function fetchConfirmStatus(id:number) {
  return async (dispatch: ThunkDispatch) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_SERVER}/copartner/order-states-confirm/${id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    const result = await res.json()
    if (res.status !== 200) {
      dispatch(newNotification(result.message))
      return
    }
    dispatch(confirmOrderListToRedux(id))
  }
}

// Cancel Order states: PUT “/api/v1/copartner/order-states-cancel/:id”

export function fetchCancelStatus(id:number) {
  return async (dispatch: ThunkDispatch) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_SERVER}/copartner/order-states-cancel/${id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    const result = await res.json()
    if (res.status !== 200) {
      dispatch(newNotification(result.message))
      return
    }
    dispatch(newNotification('已取消'))
    dispatch(cancelOrderListToRedux(id))
  }
}
