import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLatestOrders } from 'redux/Business/action'
import { history, RootState } from 'store'
import styles from './business.module.css'

export default function LatestOrder() {
  const dispatch = useDispatch()
  const latestOrders = useSelector(
    (state: RootState) => state.business.latestOrders
  )
  useEffect(() => {
    dispatch(fetchLatestOrders())
  }, [])
  return (
    <div className={styles.container}>
      <h2>最新訂單</h2>
      <div className={styles.content}>
        <div className={styles.header}>
          <span>店舖</span>
          <span>客人名稱</span>
          <span>日期</span>
          <span>狀態</span>
        </div>
        {latestOrders.map((order) => (
          <div
            className={styles.order}
            key={order.id}
            onClick={() => history.push(`/business/orderdetail/${order.id}`)}>
            <span>{order.storeName}</span>
            <span>{order.clientName}</span>
            <span>{new Date(order.date).toLocaleDateString()}</span>
            <span
              className={`${styles.status} ${
                order.states === '待確認'
                  ? styles.statusRed
                  : order.states === '已確認'
                  ? styles.statusYellow
                  : order.states === '已完結'
                  ? styles.statusGreen
                  : styles.statusGrey
              }
              `}>
              {order.states}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
