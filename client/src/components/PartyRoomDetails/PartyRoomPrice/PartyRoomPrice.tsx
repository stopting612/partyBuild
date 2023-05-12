import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import styles from './PartyRoomPrice.module.css'

export default function PartyRoomPrice() {
  const prices = useSelector((state: RootState) => state.partyRoomDetails.price)
  const minNumberOfConsumers = useSelector((state: RootState) => state.partyRoomDetails.minNumberOfPeople)
  const priceOfOvertime = useSelector((state: RootState) => state.partyRoomDetails.priceOfOvertime)

  return (
    <div>
      <h3>收費</h3>
      <table className={styles.priceTable}>
        <thead>
          <tr>
            <th>時段</th>
            <th>星期一至四</th>
            <th>星期五至日﹑公眾假期及公眾假期前夕</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price, index) => (
            <tr key={index}>
              <td>
                {price.startTime.slice(0, -3)}-{price.endTime.slice(0, -3)}
              </td>
              <td>每位${price.weekdayPrice} / 4小時</td>
              <td>每位${price.weekendPrice} / 4小時</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <p>最低消費${minNumberOfConsumers}位</p>
        <p>加鐘每人${priceOfOvertime}/位</p>
      </div>
    </div>
  )
}
