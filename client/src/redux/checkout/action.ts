import { ThunkDispatch } from 'store'
import { Stripe } from '@stripe/stripe-js'
import { CheckoutState } from './reducer'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { push } from 'connected-react-router'

export function loadCheckoutState(result: {
  address: string
  date: string
  startTime: string
}) {
  return {
    type: '@@checkout/LOAD_CHECKOUT_STATE' as const,
    result
  }
}

export type CheckoutActions = ReturnType<typeof loadCheckoutState>

export function fetchPaymentInfo(id: number) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/shopping-basket-payment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        dispatch(push('/user/my-party'))
      } else {
        dispatch(loadCheckoutState(result.data))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function createPayment(
  data: CheckoutState,
  stripePromise: Promise<Stripe | null>
) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      // Get Stripe.js instance
      const stripe = await stripePromise

      if (stripe) {
        // Call your backend to create the Checkout Session
        const res = await fetch(
          `${process.env.REACT_APP_API_SERVER}/users/create-payment`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
          }
        )
        const session = await res.json()
        if (res.status !== 200) {
          dispatch(newNotification(session.message))
        } else {
          // When the customer clicks on the button, redirect them to Checkout.
          const result = await stripe.redirectToCheckout({
            sessionId: session.data.id
          })
          if (result.error) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
            dispatch(newNotification(result.error.message || ''))
          }
        }
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}
