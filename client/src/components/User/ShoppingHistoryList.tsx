import { Link } from 'react-router-dom'
import { ShoppingBasket } from 'redux/User/PartyHistory/reducer'
import moment from 'moment'
import styles from 'components/User/ShoppingHistoryList.module.css'
import EditCommentIcon from 'components/common/EditCommentIcon/EditCommentIcon'
import React, { useState } from 'react'
import { EditComment } from 'components/EditComment/EditComment'

interface IShoppingHistoryList {
  result: ShoppingBasket
}

export function ShoppingHistoryList({ result }: IShoppingHistoryList) {
  const date = new Date(result.date)
  const formatDate = moment(date).format('YYYY-MM-DD HH:mm:ss').slice(0, 10)
  const formatStartTime = moment(result.startTime).format('LT')
  const formatEndTime = moment(result.endTime).format('LT')
  const [showComment, setShowComment] = useState(false)

  const onToggle = (e: any) => {
    e.preventDefault()
    setShowComment(!showComment)
  }
  return (
    <>
      <Link to={`/orderdetail/${result.id}`}>
        <div className={styles.activityContainer}>
          <div className={styles.activityName}>
            <span>{result.name}</span>
          </div>
          <div className={styles.activityDate}>
            <span>{result.date ? formatDate : '未設定日期'}</span>
          </div>
          <div className={styles.activityTime}>
            {result.startTime && result.endTime
              ? `${formatStartTime} - ${formatEndTime}`
              : '未設定時間'}
          </div>
          {result.date && moment(result.date).isAfter(new Date()) && (
            <div className={styles.activityPaid}>
              <span>已付款</span>
            </div>
          )}
          {result.date && moment(result.date).isBefore(new Date()) && (
            <div className={styles.activityDone}>
              <span>已完成</span>
            </div>
          )}
          {result.date === '' && (
            <div className={styles.activityDone}>
              <span>已完成</span>
            </div>
          )}
          <div className={styles.comment} onClick={onToggle}>
            <div className={styles.commentIcon}>
              <span>
                <EditCommentIcon height={'20px'} />
              </span>
            </div>
          </div>
        </div>
      </Link>
      {showComment && (
        <EditComment
          id={result.id}
          onToggle={() => {
            setShowComment(!showComment)
          }}
        />
      )}
    </>
  )
}
