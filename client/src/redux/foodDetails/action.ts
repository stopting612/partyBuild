import { push } from 'connected-react-router'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { ThunkDispatch } from 'store'
import { FoodDetails } from './reducer'

export function loadFoodDetails(result: FoodDetails) {
  return {
    type: '@@foodDetails/LOAD_FOOD_DETAILS' as const,
    result
  }
}

export function updateFoodOrderPrice(orderPrice: number) {
  return {
    type: '@@foodDetails/UPDATE_FOOD_ORDER_PRICE' as const,
    orderPrice
  }
}

export function addToCartToggle() {
  return {
    type: '@@foodDetails/ADD_TO_CART_TOGGLE' as const
  }
}

export type FoodDetailsActions = ReturnType<
  typeof loadFoodDetails | typeof updateFoodOrderPrice | typeof addToCartToggle
>

export function fetchFoodDetails(id: number) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/restaurant/menu/${id}`
      )
      if (res.status !== 200) {
        dispatch(push('/food'))
      } else {
        const result = await res.json()
        dispatch(loadFoodDetails(result.data))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function fetchFoodPrice(id: number, quantity: number, areaID: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/restaurant/menu-price/?id=${id}&quantity=${quantity}&shipping_fee_id=${areaID}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        return
      }
      dispatch(updateFoodOrderPrice(result.data.price))
    } catch {
      dispatch(error())
    }
  }
}

export function addToParty(
  menuId: number,
  shoppingBagId: number,
  shippingFeeId: number,
  quantity: number
) {
  return async (dispatch: ThunkDispatch) => {
    const reqBody = {
      menuId,
      shoppingBagId,
      shippingFeeId,
      quantity
    }
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/add-food-order`,
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
    area: number
  }
) {
  return async (dispatch: ThunkDispatch) => {
    const reqBody = {
      name: name,
      food: [
        {
          id: id,
          quantity: data.quantity,
          shippingFeeId: data.area
        }
      ]
    }
    dispatch(startLoading())
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
