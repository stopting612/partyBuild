import styles from 'components/OrderDetails/ShowCalculator.module.css'
import React from 'react'
import { OrderDetails } from 'redux/OrderDetails/state'

interface OrderType {
  result: OrderDetails
}

export function ShowCalculatorDetail({ result }: OrderType) {
  return (
    <>
      {result.partyRoomOrders?.id !== 0 && (
        <div className={styles.container}>
          <div className={styles.activtiyname}> Party Room</div>
          <div className={styles.activityPerPerson}> Total $
            {(result.partyRoomOrders!.price / (result.calculatorOption.numberOfPartyRoomOrderPeople | 0)).toFixed(1)}
          </div>
        </div>
      )}
      {result.partyRoomOrders?.id !== 0 && result.alcoholOrders.length > 0 && (
      <div className={styles.container}>
        <div className={styles.activtiyname}> Party Room + 飲酒</div>
        <div className={styles.activityPerPerson}> Total $
          {(result.partyRoomOrders!.price / (result.calculatorOption.numberOfPartyRoomOrderPeople | 0) +
            (result.alcoholOrders
              .map((result) => result.price)
              .reduce((acc, cur) => acc + cur, 0) ?? 1) /
              (result.calculatorOption?.numberOfAlcoholOrderPeople ?? 1)).toFixed(1)}
        </div>
      </div>)}
      {result.partyRoomOrders?.id !== 0 && result.foodOrders.length > 0 && (
         <div className={styles.container}>
         <div className={styles.activtiyname}> Party Room + 食飯</div>
         <div className={styles.activityPerPerson}> Total $
           {(result.partyRoomOrders!.price / (result.calculatorOption.numberOfPartyRoomOrderPeople | 0) +
             (result.foodOrders
               .map((result) => result!.price)
               .reduce((acc, cur) => acc + cur, 0) ?? 1) /
               (result.calculatorOption?.numberOfAlcoholOrderPeople ?? 1)).toFixed(2)}
         </div>
       </div>
      )}
      {result.alcoholOrders.length > 0 && result.foodOrders.length > 0 && result.partyRoomOrders?.id !== 0 && (
        <div className={styles.container}>
          <div className={styles.activtiyname}> Party Room + 飲酒 + 食飯</div>
          <div className={styles.activityPerPerson}> Total $
            {(result.partyRoomOrders!.price / (result.calculatorOption.numberOfPartyRoomOrderPeople | 0) +
              (result.alcoholOrders
                .map((result) => result.price)
                .reduce((acc, cur) => acc + cur, 0) ?? 0) /
                (result.calculatorOption?.numberOfAlcoholOrderPeople ?? 0) +
              (result.foodOrders
                .map((result) => result!.price)
                .reduce((acc, cur) => acc + cur, 0) ?? 0) /
                (result.calculatorOption?.numberOfFoodOrderPeople ?? 1)).toFixed(1)}
          </div>
        </div>
      )}
      {result.partyRoomOrders?.id === 0 && result.foodOrders.length > 0 && (
        <div className={styles.container}>
          <div className={styles.activtiyname}> 只叫到會</div>
          <div className={styles.activityPerPerson}> Total $
            {Number((result.foodOrders
                .map((result) => result!.price)
                .reduce((acc, cur) => acc + cur, 0) ?? 0) /
                (result.calculatorOption.numberOfFoodOrderPeople ?? 1)).toFixed(1)}
          </div>
        </div>
      )}
      {result.partyRoomOrders?.id === 0 && result.foodOrders.length > 0 && result.alcoholOrders.length > 0 && (
        <div className={styles.container}>
          <div className={styles.activtiyname}> 到會 + 飲酒</div>
          <div className={styles.activityPerPerson}> Total $
          { ((result.alcoholOrders
                .map((result) => result.price)
                .reduce((acc, cur) => acc + cur, 0) ?? 0) /
                (result.calculatorOption?.numberOfAlcoholOrderPeople ?? 0) +
              (result.foodOrders
                .map((result) => result!.price)
                .reduce((acc, cur) => acc + cur, 0) ?? 0) /
                (result.calculatorOption?.numberOfFoodOrderPeople ?? 1)).toFixed(1)}
          </div>
        </div>
      )}
      {result.partyRoomOrders?.id === 0 && result.alcoholOrders.length > 0 && (
        <div className={styles.container}>
          <div className={styles.activtiyname}> 飲酒</div>
          <div className={styles.activityPerPerson}> Total $
            {((result.alcoholOrders
                .map((result) => result.price)
                .reduce((acc, cur) => acc + cur, 0) ?? 0) /
                (result.calculatorOption?.numberOfAlcoholOrderPeople ?? 0)).toFixed(1)}
          </div>
        </div>
      )}
    </>
  )
}
