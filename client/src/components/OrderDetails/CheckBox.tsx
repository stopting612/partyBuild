import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import styles from 'components/OrderDetails/CheckBox.module.css'

export function CheckBoxOption() {
  const calculatorOrder = useSelector(
    (state: RootState) => state.orderDetail.calculatorOption
  )
  const caculatorOptionByUser = useSelector(
    (state: RootState) => state.orderDetail.calculatorOption?.options
  )
  const alcoholOrderOption = useSelector(
    (state: RootState) => state.orderDetail.alcoholOrders
  )

  const foodOrderOption = useSelector(
    (state: RootState) => state.orderDetail.foodOrders
  )

  const PartyRoomOption = useSelector(
    (state: RootState) => state.orderDetail.partyRoomOrders
  )

  const [optionCheckBoxStatus, setOptionCheckboxStatus] = useState(
    caculatorOptionByUser
  )

  interface INewOption {
    name: string
    status: boolean
    price: number
    numberOfPeople: number
  }
  const countAlcoholPrice =
    alcoholOrderOption
      ?.map((result) => result.price)
      .reduce((acc, cur) => acc + cur, 0) ?? 0

  const countFoodPrice =
    foodOrderOption
      ?.map((result) => result.price)
      .reduce((acc, cur) => acc + cur, 0) ?? 0

  const newAlcoholOption: INewOption = {
    name: '飲酒',
    status: false,
    price: countAlcoholPrice,
    numberOfPeople: calculatorOrder?.numberOfAlcoholOrderPeople ?? 0
  }

  const newFoodOption: INewOption = {
    name: '食飯',
    status: false,
    price: countFoodPrice,
    numberOfPeople: calculatorOrder?.numberOfFoodOrderPeople ?? 0
  }
  const newPartyRoomOption: INewOption = {
    name: 'Party Room',
    status: false,
    price: PartyRoomOption?.price ?? 0,
    numberOfPeople: calculatorOrder?.numberOfPartyRoomOrderPeople ?? 0
  }

  const [alcoholOptionStatus, setAlcoholOptionStatus] = useState(false)
  const [foodOptionStatus, setFoodOptionStatus] = useState(false)
  const [partyRoomStatus, setPartyRoomStatus] = useState(false)
  const newList = optionCheckBoxStatus?.concat(
    {
      ...newAlcoholOption,
      status: alcoholOptionStatus
    },
    {
      ...newFoodOption,
      status: foodOptionStatus
    },
    {
      ...newPartyRoomOption,
      status: partyRoomStatus
    }
  )

  useEffect(() => {
    setOptionCheckboxStatus(optionCheckBoxStatus)
  }, [setOptionCheckboxStatus])

  // filter the true and counting the price of person
  const optionResultPrice = newList
    ?.filter((state) => state!.status)
    .map((i) => i!.price / i!.numberOfPeople)
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(1)

  return (
    <>
      <div className={styles.checkboxContainer}>
        {PartyRoomOption?.id !== 0 && (
          <div>
            {/* {alcoholOrderOption
            ?.map((result) => result.price)
            .reduce((acc, cur) => acc + cur, 0) ?? 0} */}
            <input
              onChange={(event) => {
                setPartyRoomStatus(event.target.checked)
              }}
              type='checkbox'
              id='partyRoom'
              checked={partyRoomStatus}
            />
            <label htmlFor='partyRoom'>{newPartyRoomOption.name}</label>
          </div>
        )}

        {alcoholOrderOption.length > 0 && (
          <div>
            {/* {alcoholOrderOption
            ?.map((result) => result.price)
            .reduce((acc, cur) => acc + cur, 0) ?? 0} */}
            <input
              onChange={(event) => {
                setAlcoholOptionStatus(event.target.checked)
              }}
              type='checkbox'
              id='beverage'
              checked={alcoholOptionStatus}
            />
            <label htmlFor='beverage'>{newAlcoholOption.name}</label>
          </div>
        )}
        {foodOrderOption.length > 0 && (
          <div>
            {/* {foodOrderOption
            ?.map((result) => result.price)
            .reduce((acc, cur) => acc + cur, 0) ?? 0} */}
            <input
              onChange={(event) => {
                setFoodOptionStatus(event.target.checked)
              }}
              type='checkbox'
              id='food'
              checked={foodOptionStatus}
            />
            <label htmlFor='food'>{newFoodOption.name}</label>
          </div>
        )}
        {caculatorOptionByUser?.map((i, index) => (
          <div key={index}>
            <input
              onChange={(event) => {
                setOptionCheckboxStatus(
                  caculatorOptionByUser.map((data) => {
                    if (i!.id === data!.id) {
                      data!.status = event.target.checked
                    }
                    return data
                  })
                )
              }}
              type='checkbox'
              id={`${i?.name}${index}`}
              checked={i?.status}
            />
            <label htmlFor={`${i?.name}${index}`}>{i?.name ?? ''}</label>
          </div>
        ))}
      </div>
      <div className={styles.price}> 每人 $ {optionResultPrice}</div>
    </>
  )
}
