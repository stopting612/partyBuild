import { Link } from 'react-router-dom'
import { ShoppingBasket } from 'redux/User/PartyHistory/reducer'
import moment from 'moment'
import styles from 'components/User/MyParty/MyParty.module.css'
import React from 'react'
import DeleteIcon from 'components/common/DeteleIcon/deleteIcon'
import { fetchDeleteMyPartyList } from 'redux/User/Myparty/action'
import { useDispatch } from 'react-redux'

interface IShoppingHistoryList {
  result: ShoppingBasket
}

export function MyPartyList({ result }: IShoppingHistoryList) {
  const date = new Date(result.date)
  const formatDate = moment(date).format('YYYY-MM-DD HH:mm:ss').slice(0, 10)
  const formatStartTime = moment(result.startTime).format('LT')
  const formatEndTime = moment(result.endTime).format('LT')
  const dispatch = useDispatch()

  const onDelete = (id: number) => {
    dispatch(fetchDeleteMyPartyList(id))
  }
  return (
    <>
      <Link to={`/orderdetail/${result.id}`}>
        <div className={styles.activityContainer}>
          <div className={styles.activityName}>{result.name}</div>
          <div className={styles.activityDate}>
            {result.date ? formatDate : '未設定日期'}
          </div>
          <div className={styles.activityTime}>
            {result.startTime && result.endTime
              ? `${formatStartTime} - ${formatEndTime}`
              : '未設定時間'}
          </div>
          <div
            className={styles.deleteIcon}
            onClick={(e) => {
              e.preventDefault()
              onDelete(result.id)
            }}>
            <DeleteIcon
              height={'20px'}
              color={'var(--color-background-main)'}
            />
          </div>
        </div>
      </Link>
    </>
  )
}
