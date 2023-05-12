import moment from 'moment'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import {
  onlyReadPage,
  updateNumberOfAlcoholPeople,
  updateNumberOfFoodOrderPeople,
  updateNumberOfPartyRoomPeople
} from 'redux/OrderDetails/action'
import { RootState } from 'store'
import styles from './OrderDetail.module.css'
import { OrderPartyCardMini } from 'components/OrderDetails/OrderDetailCard'
import { CalculatorOfOrderDetail } from 'components/OrderDetails/Calculator'
import { ShowCalculatorDetail } from 'components/OrderDetails/ShowCalculator'
import { CheckBoxOption } from 'components/OrderDetails/CheckBox'
import { Helmet } from 'react-helmet'

export default function OnlyReadOrderDetail() {
  const dispatch = useDispatch()
  const token = useParams<{ token: string }>().token
  const OrderDetail = useSelector((state: RootState) => state.orderDetail)
  const eventDetail = useSelector((state: RootState) => state.orderDetail.event)

  const partyRoomOrderDetail = useSelector(
    (state: RootState) => state.orderDetail.partyRoomOrders
  )
  const foodOrderDetail = useSelector(
    (state: RootState) => state.orderDetail.foodOrders
  )
  const alcoholOrderDetail = useSelector(
    (state: RootState) => state.orderDetail.alcoholOrders
  )

  const optionActivity = useSelector(
    (state: RootState) => state.orderDetail.calculatorOption
  )
  const totalPrice =
    (partyRoomOrderDetail?.price ?? 0) +
    (foodOrderDetail
      ?.map((result) => result?.price ?? 0)
      .reduce((acc, cur) => acc + cur, 0) ?? 0) +
    (alcoholOrderDetail
      ?.map((result) => result.price)
      .reduce((acc, cur) => acc + cur, 0) ?? 0)

  const foodOrderDetailPrice =
    foodOrderDetail
      ?.map((result) => result?.price ?? 0)
      .reduce((acc, cur) => acc + cur, 0) ?? 0

  const alcoholOrderDetailPrice =
    alcoholOrderDetail
      ?.map((result) => result.price)
      .reduce((acc, cur) => acc + cur, 0) ?? 0

  const partyRoomPersonOfNumber = useSelector(
    (state: RootState) =>
      state.orderDetail.calculatorOption.numberOfPartyRoomOrderPeople
  )
  const alcoholPersonOfNumber = useSelector(
    (state: RootState) =>
      state.orderDetail.calculatorOption.numberOfAlcoholOrderPeople
  )
  const foodPersonOfNumber = useSelector(
    (state: RootState) =>
      state.orderDetail.calculatorOption.numberOfFoodOrderPeople
  )

  const formatDate = moment(eventDetail.date)
    .format('YYYY-MM-DD HH:mm:ss')
    .slice(0, 10)
  const formatStartTime = moment(eventDetail.startTime).format('LT')
  const fomatendTime = moment(eventDetail.endTime).format('LT')

  useEffect(() => {
    dispatch(onlyReadPage(token))
  }, [])
  return (
    <>
      <Helmet>
        <title>預訂頁面 | Party Build</title>
      </Helmet>
      <div className={styles.title}>
        <h1>預訂頁面</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.chooseConatiner}>
          <h4>活動名稱：{eventDetail.name}</h4>
          {partyRoomOrderDetail?.id !== 0 ? (
            <div className={styles.datepicker}>
              <div className={styles.editDate}>日期</div>
              <div className={styles.showDate}>{formatDate}</div>
            </div>
          ) : (
            ''
          )}
          {partyRoomOrderDetail?.id !== 0 ? (
            <div className={styles.datepicker}>
              <div className={styles.editDate}>時間</div>
              <div className={styles.showDate}>
                {formatStartTime}-{fomatendTime}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className={styles.showOrderCard}>
          {partyRoomOrderDetail!.id !== 0 ? (
            <OrderPartyCardMini
              showDelete={false}
              pros='party-room'
              result={partyRoomOrderDetail}
              orderType={'partyRoom'}
            />
          ) : (
            ''
          )}
          {foodOrderDetail.length > 0
            ? foodOrderDetail.map((result) => (
                <OrderPartyCardMini
                  showDelete={false}
                  key={result.id}
                  pros='food'
                  result={result}
                  orderType='food'
                />
              ))
            : null}
          {alcoholOrderDetail
            ? alcoholOrderDetail.map((result) => (
                <OrderPartyCardMini
                  showDelete={false}
                  key={result.id}
                  pros='beverage'
                  result={result}
                  orderType='alcohol'
                />
              ))
            : null}
        </div>
        <div className={styles.priceDetail}>
          <h2>價格詳細</h2>
          {partyRoomOrderDetail?.id !== 0 && (
            <div className={styles.partyRoomPriceDetail}>
              【 {partyRoomOrderDetail!.name}】 X{' '}
              {partyRoomOrderDetail && eventDetail.numberOfPeople} 人
              <div className='price'>
                ${partyRoomOrderDetail && partyRoomOrderDetail.price}
              </div>
            </div>
          )}
          {foodOrderDetail.length > 0
            ? foodOrderDetail.map((result) => (
                <div key={result.id} className={styles.partyRoomPriceDetail}>
                  【 {result!.name} 】 X {result!.quantity}
                  <div className='price'> ${result!.price}</div>
                </div>
              ))
            : null}
          {alcoholOrderDetail
            ? alcoholOrderDetail.map((result) => (
                <div key={result.id} className={styles.partyRoomPriceDetail}>
                  【 {result.name} 】 X {result.quantity}
                  <div className='price'> ${result.price}</div>
                </div>
              ))
            : null}
          <div className={styles.totalPricecontainer}>
            總共（HKD） $ {totalPrice}
          </div>
        </div>
      </div>
      <div className={styles.calculator}>
        <h3>計算人頭價錢</h3>
        <div className={styles.calculatorContainer}>
          <div className={styles.titleContaniner}>
            <div className='activty '>活動</div>
            <div className='activtyPrice '>價錢</div>
            <div className='activtyPerson '>人數</div>
            <div className='activtyPriceByPerson '>每人</div>
          </div>
        </div>
        <div className={styles.defaultContainer}>
          {partyRoomOrderDetail?.id !== 0 && (
            <div className={styles.partyRoomCalculator}>
            <CalculatorOfOrderDetail
                name='PartyRoom'
                person={partyRoomPersonOfNumber}
                price={partyRoomOrderDetail!.price}
                dispatchRedux={(person: number) =>
                  dispatch(updateNumberOfPartyRoomPeople(person))
                }
              />
            </div>
          )}
          {foodOrderDetail && (
            <div className={styles.foodCalculator}>
            <CalculatorOfOrderDetail
                name='食飯到會'
                person={foodPersonOfNumber}
                price={foodOrderDetailPrice}
                dispatchRedux={(person: number) =>
                  dispatch(updateNumberOfFoodOrderPeople(person))
                }
              />
            </div>
          )}
          {alcoholOrderDetail.length > 0 && (
            <div className={styles.alcoholCalculator}>
            <CalculatorOfOrderDetail
                name='飲酒'
                person={alcoholPersonOfNumber}
                price={alcoholOrderDetailPrice}
                dispatchRedux={(person: number) =>
                  dispatch(updateNumberOfAlcoholPeople(person))
                }
              />
            </div>
          )}
          <div className={styles.addActivityContainer}>
            {optionActivity.options.length > 0 &&
              optionActivity.options.map((item) => (
                <CalculatorOfOrderDetail
                  key={item!.id}
                  name={item!.name}
                  person={item!.numberOfPeople}
                  price={item!.price}
                  dispatchRedux={(person: number) =>
                    dispatch(updateNumberOfAlcoholPeople(person))
                  }
                />
              ))}
          </div>
        </div>
      </div>
      <div className={styles.showActivityDetail}>
        <span className={styles.underline} />
        <div className={styles.activityContainer}>
          <ShowCalculatorDetail result={OrderDetail} />
        </div>
        <CheckBoxOption />
      </div>
    </>
  )
}
