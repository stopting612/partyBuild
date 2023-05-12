import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import styles from './ShippingFee.module.css'

export default function ShippingFee() {
  const shippingFees = useSelector(
    (state: RootState) => state.foodDetails.shippingFees
  )
  return (
    <div>
      <h3>運費</h3>
      <div className={styles.shippingFeeHeader}>
        <div className={styles.area}>地區</div>
        <div className={styles.shippingFee}>價錢</div>
      </div>
      {shippingFees.map((shippingFee) => (
        <div className={styles.shippingFeeContainer} key={shippingFee.area}>
          <div className={styles.area}>{shippingFee.area}</div>
          {shippingFee.price === '0.0' ? (
            <div className={styles.shippingFree}>免運費</div>
          ) : (
            <div className={styles.shippingFee}>{shippingFee.price}</div>
          )}
        </div>
      ))}
    </div>
  )
}
