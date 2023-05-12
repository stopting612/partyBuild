import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import styles from './OrderDetail.module.css'
import {
  fetchGetOrderDetail,
  updateNumberOfFoodOrderPeople,
  updateNumberOfAlcoholPeople,
  updateNumberOfPartyRoomPeople,
  deleteCalculatorOption,
  deleteUserOrder,
  deletePartyRoom,
  deleteFoodOrder,
  deleteAlcoholOrder,
  createNewCalculatorOption,
  fetchUpdateDefaultCalculator,
  updatePartyStartDate,
  updatePartyStartTime,
  updatePartyEndTime
} from 'redux/OrderDetails/action'
import { OrderPartyCardMini } from 'components/OrderDetails/OrderDetailCard'
import { CalculatorOfOrderDetail } from 'components/OrderDetails/Calculator'
import AddIcon from '../../components/common/AddIcon/AddIcon'
import { EditCalcutor } from 'components/OrderDetails/EditCalcutor'
import { ShowCalculatorDetail } from 'components/OrderDetails/ShowCalculator'
import { CheckBoxOption } from 'components/OrderDetails/CheckBox'
import { EditDate } from 'components/OrderDetails/EditDate'
import { EditTime } from 'components/OrderDetails/EditTime'
import { Link, useParams } from 'react-router-dom'
import Button from 'components/common/Button/Button'
import { WhatsappButton } from 'components/common/WhatsAppButton/WhatsappButton'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { ShareLinkIcon } from 'components/common/SharelinkIcon/ShareLinkIcon'
import { Helmet } from 'react-helmet'
import { newNotification } from 'redux/notifications/action'
import moment from 'moment'

export default function OrderDetail() {
  const dispatch = useDispatch()

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
  const totalPrice =
    (partyRoomOrderDetail?.price ?? 0) +
    (foodOrderDetail
      ?.map((result) => result?.price ?? 0)
      .reduce((acc, cur) => acc + cur, 0) ?? 0) +
    (alcoholOrderDetail
      ?.map((result) => result.price)
      .reduce((acc, cur) => acc + cur, 0) ?? 0)
  // for calculator
  const foodOrderDetailPrice =
    foodOrderDetail
      ?.map((result) => result?.price ?? 0)
      .reduce((acc, cur) => acc + cur, 0) ?? 0

  const alcoholOrderDetailPrice =
    alcoholOrderDetail
      ?.map((result) => result.price)
      .reduce((acc, cur) => acc + cur, 0) ?? 0
  // for add new activity by user
  const [activityWord, setActivityWord] = useState('')
  const [addPrice, setAddPrice] = useState(0)
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

  const addActivity = useSelector(
    (state: RootState) => state.orderDetail.calculatorOption.options
  )
  const id = useParams<{ id: string }>().id

  const onAdd = () => {
    dispatch(createNewCalculatorOption(activityWord, addPrice, parseInt(id)))
    setActivityWord('')
    setAddPrice(0)
  }

  const upDateOption = () => {
    dispatch(fetchUpdateDefaultCalculator(parseInt(id)))
  }
  const [showBoard, setShowBoard] = useState(false)

  const [token, setToken] = useState('')

  const onShare = async () => {
    setShowBoard(!showBoard)
    const whatappsToken = await fetch(
      `${process.env.REACT_APP_API_SERVER}/users/share-link/${parseInt(id)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    const result = await whatappsToken.json()
    if (whatappsToken.status !== 200) {
      dispatch(newNotification(result.message))
    }
    setToken(result.data.token)
  }
  useEffect(() => {
    dispatch(fetchGetOrderDetail(parseInt(id)))
  }, [])
  return (
    <>
      <Helmet>
        <title>預訂頁面 | Party Build</title>
      </Helmet>
      {/* {partyRoomOrderDetail? partyRoomOrderDetail.map() :} */}
      {eventDetail.isPay && (
        <div className={styles.title}>
          <h1>訂單詳情</h1>
        </div>
      )}
      {eventDetail.isPay === false && (
        <div className={styles.title}>
          <h1>預訂頁面</h1>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.chooseConatiner}>
          <h4>活動名稱： {eventDetail.name}</h4>
          {partyRoomOrderDetail?.id !== 0 && eventDetail.isPay === false && (
            <div className={styles.datepicker}>
              <div className={styles.editDate}>日期</div>
              <div className={styles.showDate}>
                <EditDate
                  startDate={eventDetail.date}
                  dispatchDate={(date: Date) =>
                    dispatch(updatePartyStartDate(date, parseInt(id)))
                  }
                />
              </div>
            </div>
          )}
          {partyRoomOrderDetail?.id !== 0 && eventDetail.isPay && (
            <div className={styles.datepicker}>
              <div className={styles.editDate}>訂單日期:</div>
              <div className={styles.showDate}>
                {moment(eventDetail.date).format('YYYY-MM-DD')}
              </div>
            </div>
          )}
          {partyRoomOrderDetail?.id !== 0 && eventDetail.isPay === false && (
            <div className={styles.datepicker}>
              <div className={styles.editDate}>時間:</div>
              <div className={styles.showDate}>
                <EditTime
                  time={eventDetail.startTime}
                  dispatchTime={(date: string) =>
                    dispatch(updatePartyStartTime(date, parseInt(id)))
                  }
                />
                <span>&nbsp;-&nbsp;</span>
                <EditTime
                  time={eventDetail.endTime}
                  dispatchTime={(date: string) =>
                    dispatch(updatePartyEndTime(date, parseInt(id)))
                  }
                />
              </div>
            </div>
          )}
          {partyRoomOrderDetail?.id !== 0 && eventDetail.isPay && (
            <div className={styles.datepicker}>
              <div className={styles.editDate}>訂單時間:</div>
              <div className={styles.showDate}>
                {moment(eventDetail.startTime).format('LT')} -{' '}
                {moment(eventDetail.endTime).format('LT')}
              </div>
              <div className={styles.editDate}>送貨日期：</div>
              <div className={styles.showDate}>
                {moment(eventDetail.deliveryDate).format('YYYY-MM-DD')}
              </div>
              <div className={styles.editDate}>送貨時間：</div>
              <div className={styles.showDate}>{eventDetail.deliveryTime}</div>
              <div className={styles.editDate}>送貨地址：</div>
              <div className={styles.showDate}>
                {eventDetail.deliveryAddress}
              </div>
              <div className={styles.editDate}>聯絡人姓名：</div>
              <div className={styles.showDate}>{eventDetail.contactName}</div>
              <div className={styles.editDate}>聯絡人電話：</div>
              <div className={styles.showDate}>
                {eventDetail.contactPhoneNumber}
              </div>
            </div>
          )}
        </div>
        <div className={styles.showOrderCard}>
          {partyRoomOrderDetail!.id !== 0 ? (
            <OrderPartyCardMini
              showDelete={true}
              pros='party-room'
              result={partyRoomOrderDetail}
              orderType={'partyRoom'}
              dispatchDelete={(data: { id: number; type: string }) =>
                dispatch(deleteUserOrder(data))
              }
              reduxDelete={(id: number) => dispatch(deletePartyRoom(id))}
            />
          ) : (
            ''
          )}
          {foodOrderDetail.length > 0
            ? foodOrderDetail.map((result) => (
                <OrderPartyCardMini
                  showDelete={true}
                  key={result.id}
                  pros='food'
                  result={result}
                  orderType='food'
                  dispatchDelete={(data: { id: number; type: string }) =>
                    dispatch(deleteUserOrder(data))
                  }
                  reduxDelete={(id: number) => dispatch(deleteFoodOrder(id))}
                />
              ))
            : null}
          {alcoholOrderDetail
            ? alcoholOrderDetail.map((result) => (
                <OrderPartyCardMini
                  showDelete={true}
                  key={result.id}
                  pros='beverage'
                  result={result}
                  orderType='alcohol'
                  dispatchDelete={(data: { id: number; type: string }) =>
                    dispatch(deleteUserOrder(data))
                  }
                  reduxDelete={(id: number) => dispatch(deleteAlcoholOrder(id))}
                />
              ))
            : null}
        </div>
        {/* <span className={styles.underline} /> */}
        <div className={styles.priceDetail}>
          <h2>價格詳細</h2>
          {partyRoomOrderDetail?.id !== 0 && (
            <div className={styles.partyRoomPriceDetail}>
              【 {partyRoomOrderDetail!.name}&nbsp;】 &nbsp;&nbsp;X &nbsp;&nbsp;
              {partyRoomOrderDetail && eventDetail.numberOfPeople}
              &nbsp;&nbsp;人
              <div className={styles.price}>
                ${partyRoomOrderDetail && Number(partyRoomOrderDetail.price)}
              </div>
            </div>
          )}
          {foodOrderDetail.length > 0
            ? foodOrderDetail.map((result) => (
                <div key={result.id} className={styles.partyRoomPriceDetail}>
                  【 {result!.name} 】 &nbsp;&nbsp;X &nbsp;&nbsp;
                  {result!.quantity}
                  <div className={styles.price}> ${Number(result!.price)}</div>
                </div>
              ))
            : null}
          {alcoholOrderDetail
            ? alcoholOrderDetail.map((result) => (
                <div key={result.id} className={styles.partyRoomPriceDetail}>
                  【 {result.name} 】 &nbsp;&nbsp;X &nbsp;&nbsp;{' '}
                  {result.quantity}
                  <div className={styles.price}> ${Number(result.price)}</div>
                </div>
              ))
            : null}
          <div className={styles.totalPricecontainer}>總共 HK${totalPrice}</div>
        </div>
      </div>
      {/* <span className={styles.underline} /> */}
      <div className={styles.calculator}>
        <h3>計算人頭價錢</h3>
        <div className={styles.calculatorContainer}>
          <div className={styles.titleContainer}>
            <div className='activty '>活動</div>
            <div className='activtyPrice '>價錢</div>
            <div className={styles.activtyPerson}>人數</div>
            <div className={styles.activtyPriceByPerson}>每人</div>
          </div>
        </div>
        <div className={styles.defaultContainer}>
          {partyRoomOrderDetail?.id !== 0 && (
            <div className={styles.partyRoomCalculator}>
              <CalculatorOfOrderDetail
                name='Party Room'
                person={partyRoomPersonOfNumber}
                price={partyRoomOrderDetail!.price}
                dispatchRedux={(person: number) =>
                  dispatch(updateNumberOfPartyRoomPeople(person))
                }
              />
            </div>
          )}
          {foodOrderDetail.length > 0 && (
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
        </div>
        <div className={styles.addActivityContainer}>
          {addActivity.map((i, index) =>
            i ? (
              <EditCalcutor
                key={i.id}
                name={i.name}
                numberOfPeople={i.numberOfPeople}
                price={i!.price}
                id={i.id!}
                onDelete={() => {
                  dispatch(deleteCalculatorOption(i.id!))
                }}
              />
            ) : null
          )}
        </div>
        <div className={styles.createIcon}>
          <div className={styles.createContainer}>
            <div className={styles.addActitity}>
              <input
                type='text'
                placeholder='新增活動名稱 '
                value={activityWord}
                onChange={(event) => setActivityWord(event.currentTarget.value)}
              />
            </div>
            <div className={styles.addPriceContainer}>
              <div className={styles.addPrice}>
                <input
                  type='number'
                  value={addPrice}
                  onChange={(event) =>
                    setAddPrice(parseInt(event.currentTarget.value))
                  }
                  placeholder='價錢'
                />
              </div>
              <div className={styles.addIconConatiner} onClick={onAdd}>
                <AddIcon height={'20px'} />
              </div>
            </div>
            <div className={styles.activtyPerson} />
            <div />
          </div>
          <div className={styles.saveAllOption}>
            <Button onClick={upDateOption}>儲存</Button>
          </div>
          <span className={styles.underline} />
        </div>
      </div>
      <div className={styles.showActivityDetail}>
        <div className={styles.activityContainer}>
          <ShowCalculatorDetail result={OrderDetail} />
        </div>
        <div className={styles.checkBoxContainer}>
          <h3>自選項目</h3>
          <CheckBoxOption />
        </div>
        <div className={styles.btnContainer}>
          <div className={styles.whatsAppBtn}>
            <WhatsappButton
              onClick={() => {
                onShare()
              }}
            />{' '}
          </div>
          {eventDetail.isPay === false && (
            <div className={styles.paymentButton}>
              <Link to={`/checkout/${parseInt(id)}`}>
                {' '}
                <Button>確定付款</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {showBoard && token && (
        <div
          className={styles.whatsappContainer}
          onClick={() => setShowBoard(!showBoard)}>
          <div
            className={styles.whatsapp}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}>
            <div className={styles.shareTitle}>
              <ShareLinkIcon height={'23px'} color='#61dafb' />
              <div className={styles.whatsAppTitile}>傳送連結</div>
            </div>
            <div
              className={
                styles.linkContainer
              }>{`${process.env.REACT_APP_FRONTEND_HOSTNAME}/only-read-order-detail/${token}`}</div>
            <div className={styles.copyContainer}>
              <CopyToClipboard
                text={`${process.env.REACT_APP_FRONTEND_HOSTNAME}/only-read-order-detail/${token}`}>
                <Button
                  onClick={() => {
                    setShowBoard(false)
                    dispatch(newNotification('成功複製連結'))
                  }}>
                  複製連結
                </Button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
