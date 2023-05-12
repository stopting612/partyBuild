import React, { useEffect, useState } from 'react'
import styles from '../Business/BusinessOrderDetail.module.css'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { newNotification } from 'redux/notifications/action'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import Button from 'components/common/Button/Button'
interface Ievent {
  id: number
  name: string
  date: string
  startTime: string
  endTime: string
  states: string
}

interface IUser {
  name: string
  phoneNumber: string
  date: Date
  time: string
  district: string
  address: string
  specialRequirement: string
}

interface IPArtyRoomOrder {
  name: string
  price: string
  numberOfPeople: number
}
interface IFoodAlcoholOrder {
  name: string
  quantity: number
  price: string
}

interface OrderData {
  party: Ievent
  order: {
    partyRoom: IPArtyRoomOrder
    menu: IFoodAlcoholOrder[]
    alcohol: IFoodAlcoholOrder[]
  }
  user: IUser
}

export default function BussinessOrderDetail() {
  // Get order by id GET “/api/v1/copartner/order/:id
  const dispatch = useDispatch()
  const getId = useParams<{ id: string }>().id
  const orderId = parseInt(getId)
  const [list, setNewList] = useState<OrderData>()
  const handleCancel = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_SERVER}/copartner/order-states-cancel/${orderId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    const result = await res.json()
    if (res.status !== 200) {
      dispatch(newNotification(result.message))
      return
    }
    if (result.message === 'Success') {
      setNewList((state) => {
        if (state) {
          return {
            ...state,
            party: {
              ...state.party,
              states: '已取消'
            }
          }
        }
      })
    }
    dispatch(newNotification('已取消'))
  }

  const handleConfirm = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_SERVER}/copartner/order-states-confirm/${orderId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    const result = await res.json()
    if (res.status !== 200) {
      dispatch(newNotification(result.message))
      return
    }
    if (result.message === 'Success') {
      setNewList((state) => {
        if (state) {
          return {
            ...state,
            party: {
              ...state.party,
              states: '已確認'
            }
          }
        }
      })
    }
    dispatch(newNotification('已確認'))
  }

  useEffect(() => {
    async function fetchBusinessOrderDetail() {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/copartner/order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.massage))
      }
      setNewList(result.data)
    }
    fetchBusinessOrderDetail().catch((e) => {
      console.log(e)
    })
  }, [])

  const totalPrice =
    Number(list?.order.partyRoom.price ?? 0) +
    (list?.order.menu
      .map((result) => Number(result.price) ?? 0)
      .reduce((acc, cur) => acc + cur, 0) ?? 0) +
    (list?.order.alcohol
      .map((result) => Number(result.price) ?? 0)
      .reduce((acc, cur) => acc + cur, 0) ?? 0)

  const formatDate = moment(list?.party.date)
    .format('YYYY-MM-DD HH:mm:ss')
    .slice(0, 10)

  const formatStartTime = list?.party.startTime.slice(0, 5)
  const formatEndTime = list?.party.endTime.slice(0, 5)

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>訂單詳情 | Party Build</title>
      </Helmet>
      <div className={styles.title}>
        <h1>訂單詳情</h1>
      </div>
      <div className={styles.container}>
        <h2>活動名稱： {list?.party.name}</h2>
        <div>
          {list?.order.partyRoom.name !== '' && (
            <div className={styles.datePicker}>
              <div className={styles.editDate}>日期</div>
              <div className={styles.showDate}>{formatDate}</div>
            </div>
          )}
          {list?.order.partyRoom.name !== '' && (
            <div className={styles.timePicker}>
              <div className={styles.editDate}>時間</div>
              <div className={styles.showDate}>
                {formatStartTime} - {formatEndTime}
              </div>
            </div>
          )}
        </div>
        <div className={styles.priceDetail}>
          <h3>價格詳細</h3>
          {list?.order.partyRoom && (
            <div className={styles.partyRoomPriceDetail}>
              <div>
                【 {list?.order.partyRoom.name}&nbsp;】 &nbsp;&nbsp;X
                &nbsp;&nbsp;
                {list?.order.partyRoom && list.order.partyRoom.numberOfPeople}
                &nbsp;&nbsp;人
              </div>
              <div className={styles.price}>
                ${list.order.partyRoom && list.order.partyRoom.price}
              </div>
            </div>
          )}
          {list?.order.menu !== undefined &&
            list!.order.menu.map((result, index) => (
              <div key={index} className={styles.foodPriceDetail}>
                <div>
                  【 {result!.name} 】 &nbsp;&nbsp;X &nbsp;&nbsp;
                  {result!.quantity}
                </div>
                <div className={styles.price}> ${result!.price}</div>
              </div>
            ))}
          {list?.order.alcohol !== undefined &&
            list!.order.alcohol.map((result, index) => (
              <div key={index} className={styles.beveragePriceDetail}>
                <div>
                  【 {result.name} 】 &nbsp;&nbsp;X &nbsp;&nbsp;
                  {result.quantity}
                </div>
                <div className={styles.price}> ${result.price}</div>
              </div>
            ))}
          <div className={styles.totalPriceContainer}>
            總共（HKD） $ {totalPrice}
          </div>
        </div>
        <div className={styles.form}>
          <h3>聯絡人資料</h3>
          <div className={styles.inputField}>
            <div>聯絡人姓名:</div>
            <div className={styles.inputNameField}>
              {list?.user && list.user.name && list.user.name}
            </div>
          </div>
          <div className={styles.inputField}>
            <div>聯絡人電話:</div>
            <div className={styles.inputPhoneField}>
              {list?.user && list.user.phoneNumber && list.user.phoneNumber}
            </div>
          </div>
          <div className={styles.inputField}>
            <div>送貨日期:</div>
            <div className={styles.inputDateField}>
              {list?.user && list.user.date && formatDate}
            </div>
          </div>
          <div className={styles.inputField}>
            <div>送貨時間:</div>
            <div className={styles.inputTimeField}>
              {list?.user && list.user.time && list.user.time}
            </div>
          </div>
          <div className={styles.inputField}>
            <div>送貨地址:</div>
            <div className={styles.inputAddressField}>
              {list?.user && list.user.address && list.user.address}
            </div>
          </div>
          <div className={styles.inputField}>
            <div>其他要求:</div>
            <div className={styles.inputSpecialField}>
              {list?.user &&
                list.user.specialRequirement &&
                list.user.specialRequirement}
            </div>
          </div>
          {list?.party.states === '待確認' && (
            <div className={styles.buttonContainer}>
              <div className={styles.confirmButton}>
                <Button onClick={handleConfirm}>確認訂單</Button>
              </div>
              <div className={styles.cancelButton}>
                <Button onClick={handleCancel}>取消訂單</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
