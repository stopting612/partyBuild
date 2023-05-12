import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTodayOrders } from 'redux/Business/action'
import { history, RootState } from 'store'
import styles from './business.module.css'

export default function TodayOrder() {
  const dispatch = useDispatch()
  const todayOrders = useSelector(
    (state: RootState) => state.business.todayOrders
  )
  useEffect(() => {
    dispatch(fetchTodayOrders())
  }, [])
  return (
    <div className={styles.container}>
      <h2>今日訂單</h2>
      <div className={styles.content}>
        <div className={styles.header}>
          <span>店舖</span>
          <span>客人名稱</span>
          <span>日期</span>
          <span>開始時間</span>
        </div>
        {todayOrders.map((order) => (
          <div
            className={styles.order}
            key={order.id}
            onClick={() => history.push(`/business/orderdetail/${order.id}`)}>
            <span>{order.storeName}</span>
            <span>{order.clientName}</span>
            <span>{new Date(order.date).toLocaleDateString()}</span>
            <span>
              {new Date(order.startTime).toLocaleTimeString().slice(0, -3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
