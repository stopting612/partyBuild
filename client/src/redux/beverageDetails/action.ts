import { push } from 'connected-react-router'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { ThunkDispatch } from 'store'
import { BeverageDetails } from './reducer'

export function loadBeverageDetails(result: BeverageDetails) {
  return {
    type: '@@beverageDetails/LOAD_BEVERAGE_DETAILS' as const,
    result
  }
}

export function updateBeverageOrderPrice(orderPrice: number) {
  return {
    type: '@@beverageDetails/UPDATE_BEVERAGE_ORDER_PRICE' as const,
    orderPrice
  }
}

export function addToCartToggle() {
  return {
    type: '@@beverageDetails/ADD_TO_CART_TOGGLE' as const
  }
}

export type BeverageDetailsActions = ReturnType<
  | typeof loadBeverageDetails
  | typeof updateBeverageOrderPrice
  | typeof addToCartToggle
>

export function fetchBeverageDetails(id: number) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/alcohol/${id}`
      )
      if (res.status !== 200) {
        dispatch(push('/beverage'))
      } else {
        const result = await res.json()
        dispatch(loadBeverageDetails(result.data))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function fetchBeveragePrice(id: number, quantity: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/alcohol/price/?id=${id}&quantity=${quantity}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        return
      }
      dispatch(updateBeverageOrderPrice(result.data.price))
    } catch {
      dispatch(error())
    }
  }
}

export function addToParty(
  alcoholId: number,
  shoppingBagId: number,
  quantity: number
) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    const reqBody = {
      alcoholId,
      shoppingBagId,
      quantity
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/add-alcohol-order`,
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
        dispatch(addToCartToggle())
        dispatch(newNotification('成功加入購物車!'))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function createNewParty(
  name: string,
  id: number,
  data: {
    quantity: number
  }
) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    const reqBody = {
      name: name,
      alcohol: [
        {
          id: id,
          quantity: data.quantity
        }
      ]
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
        dispatch(addToCartToggle())
        dispatch(newNotification('成功加入購物車!'))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}
