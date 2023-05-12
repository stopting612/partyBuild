import React from 'react'
import styles from './OrderDetail.module.css'
import {
  AlcoholOrders,
  FoodOrders,
  PartyRoomOrder
} from 'redux/OrderDetails/state'
import { Link } from 'react-router-dom'
import defaultImg from 'assets/logo02.png'

interface OrderType {
  result: PartyRoomOrder | AlcoholOrders | (FoodOrders | null)
  pros: string
  dispatchDelete?: (data: { id: number; type: string }) => void
  orderType: string
  reduxDelete?: (id: number) => void
  showDelete: boolean
}

interface dataType {
  type: string
  id: number
}

export function OrderPartyCardMini({
  result,
  pros,
  dispatchDelete,
  reduxDelete,
  orderType,
  showDelete
}: OrderType) {
  const onDelete = (data: dataType) => {
    dispatchDelete!(data)
    reduxDelete!(data.id)
  }
  return (
    <div className={styles.container}>
      <Link to={`/${pros}/${result!.itemId}`}>
        <div
          style={{
            backgroundImage: `url(${
              result!.image !== 'http://cdn.partybuildhk.com/undefined'
                ? result!.image
                : defaultImg
            })`
          }}
          className={styles.photo}
        />
        <div className={styles.content}>
          <div className={styles.area}>
            <div className={styles.title}>{result!.name} </div>
          </div>
          <div className={styles.cardDetail}>
            <div>
              <div className={styles.price}>${result!.price} HKD</div>
            </div>
          </div>
          {showDelete && (
            <button
              className={styles.button}
              onClick={(e) => {
                e.preventDefault()
                onDelete({
                  id: result!.id,
                  type: orderType
                })
              }}>
              移除
            </button>
          )}
        </div>
      </Link>
    </div>
  )
}
