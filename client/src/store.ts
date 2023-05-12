import {
  CallHistoryMethodAction,
  connectRouter,
  routerMiddleware,
  RouterState
} from 'connected-react-router'
import { createBrowserHistory } from 'history'
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Reducer
} from 'redux'
import thunk, { ThunkDispatch as OldThunkDispatch } from 'redux-thunk'
import {
  BeverageDetails,
  beverageDetailsReducer
} from 'redux/beverageDetails/reducer'
import { Comments, commentsReducer } from 'redux/comment/reducer'
import { FoodDetails, foodDetailsReducer } from 'redux/foodDetails/reducer'
import {
  PartyRoomDetails,
  partyRoomDetailsReducer
} from 'redux/partyRoomDetails/reducer'
import {
  RecommendPartyRoomList,
  recommendPartyRoomListReducer
} from 'redux/RecommendPartyRoomList/reducer'
import {
  getPartyRoomListReducer,
  PartyRoomList
} from 'redux/PartyRoomList/reducer'
import {
  RecommendRestaurant,
  RecommendRestaurantRoomReducer
} from 'redux/RecommendRestaurantRoom/reducer'
import { FoodState, getFoodListReducer } from 'redux/FoodList/reducer'
import {
  RecommendBeverage,
  RecommendBevergeReducer
} from 'redux/RecommendBeverge/reducer'
import { BeverageState, getBeverageReducer } from 'redux/BeverageList/reducer'
import { getOrderDetailsReducer } from 'redux/OrderDetails/reducer'

import { OrderDetails } from 'redux/OrderDetails/state'
import { HoldAParty } from 'redux/holdAParty/state'
import { HoldAPartyReducer } from 'redux/holdAParty/reducer'
import { authReducer, AuthState } from 'redux/auth/reducer'
import {
  IShoppingBasket,
  GetHistoryShoppingBasketReducer
} from 'redux/User/PartyHistory/reducer'
import { UserLikeList, getUserLikeReducer } from 'redux/User/Like/reducer'
import { getMyPartyReducer } from 'redux/User/Myparty/reducer'
import { loadingReducer, LoadingState } from 'redux/loading/reducer'
import { businessReducer } from 'redux/Business/reducer'
import { getUserCommentReducer, UserComment } from 'redux/EditComment/reducer'
import { adminReducer, AdminState } from 'redux/admin/reducer'
import {
  notificationReducer,
  NotificationState
} from 'redux/notifications/reducer'
import { checkoutReducer, CheckoutState } from 'redux/checkout/reducer'
import {
  businessOrderListReducer,
  OrderLists
} from 'redux/BusinessOrderList/reducer'
import { settingsReducer, SettingsState } from 'redux/User/settings/reducer'
import { BusinessState } from 'redux/Business/state'

export const history = createBrowserHistory()

export type ThunkDispatch = OldThunkDispatch<RootState, null, AnyAction>

export interface RootState {
  router: RouterState
  auth: AuthState
  partyRoomDetails: PartyRoomDetails
  foodDetails: FoodDetails
  beverageDetails: BeverageDetails
  recommendPartyRoomList: RecommendPartyRoomList
  partyRoomList: PartyRoomList
  comments: Comments
  recommendRestaurant: RecommendRestaurant
  foodLists: FoodState
  recommendBeverage: RecommendBeverage
  BeverageList: BeverageState
  orderDetail: OrderDetails
  checkout: CheckoutState
  holdAParty: HoldAParty
  shoppingBasket: IShoppingBasket
  userLikeList: UserLikeList
  myPartyList: IShoppingBasket
  business: BusinessState
  admin: AdminState
  loading: LoadingState
  getuserComment: UserComment
  notifications: NotificationState
  businessOrderList: OrderLists
  settings: SettingsState
}

const appReducer = combineReducers<RootState>({
  router: connectRouter(history),
  auth: authReducer,
  partyRoomDetails: partyRoomDetailsReducer,
  recommendPartyRoomList: recommendPartyRoomListReducer,
  partyRoomList: getPartyRoomListReducer,
  foodDetails: foodDetailsReducer,
  beverageDetails: beverageDetailsReducer,
  comments: commentsReducer,
  recommendRestaurant: RecommendRestaurantRoomReducer,
  foodLists: getFoodListReducer,
  recommendBeverage: RecommendBevergeReducer,
  BeverageList: getBeverageReducer,
  orderDetail: getOrderDetailsReducer,
  checkout: checkoutReducer,
  holdAParty: HoldAPartyReducer,
  shoppingBasket: GetHistoryShoppingBasketReducer,
  userLikeList: getUserLikeReducer,
  myPartyList: getMyPartyReducer,
  business: businessReducer,
  loading: loadingReducer,
  getuserComment: getUserCommentReducer,
  admin: adminReducer,
  notifications: notificationReducer,
  businessOrderList: businessOrderListReducer,
  settings: settingsReducer
})

export function logoutSuccess() {
  return {
    type: '@@store/LOGOUT_SUCCESS' as const
  }
}

const rootReducer: Reducer<RootState, IRootAction> = (state, action) => {
  if (action.type === '@@store/LOGOUT_SUCCESS') {
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}

type IRootAction = CallHistoryMethodAction | ReturnType<typeof logoutSuccess>

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default createStore<RootState, IRootAction, {}, {}>(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history))
  )
)
