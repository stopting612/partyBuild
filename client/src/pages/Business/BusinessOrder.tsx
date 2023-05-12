import Button from 'components/common/Button/Button'
import Pagination from 'components/common/Pagination/Pagination'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  fetchCancelStatus,
  fetchConfirmStatus,
  fetchOrdersList
} from 'redux/BusinessOrderList/action'
import { RootState } from 'store'
import styles from './BusinessOrder.module.css'
export default function BusinessOrder() {
  const dispatch = useDispatch()
  const handleConfirm = (id: number) => {
    dispatch(fetchConfirmStatus(id))
  }

  const handleCancel = (id: number) => {
    dispatch(fetchCancelStatus(id))
  }

  useEffect(() => {
    dispatch(fetchOrdersList())
  }, [])

  const orderDetail = useSelector(
    (state: RootState) => state.businessOrderList.partyRoomOrders
  )
  const count = useSelector((state: RootState) => state.businessOrderList.count)
  const pages = Array.from(Array(Math.ceil(count / 10)).keys(), (x) => x + 1)
  return (
    <>
      <Helmet>
        <title>訂單管理 | Party Build</title>
      </Helmet>
      <div className={styles.background}>
        <div className={styles.container}>
          {/* <div className={styles.filter}>
            <span>Filter</span>
          </div>
          <div className={styles.sort}>
            <span>Sort</span>
          </div> */}
          <div className={styles.content}>
            <div className={styles.header}>
              <span>店舖</span>
              <span className={styles.noWrap}>客人名稱</span>
              <span>日期</span>
              <span>時間</span>
              <span className={styles.person}>人數</span>
              <span className={styles.status}>狀態</span>
            </div>
            {orderDetail.length > 0 &&
              orderDetail.map((item) => (
                <div key={item.id} className={styles.bigContainer}>
                  <Link to={`/business/orderdetail/${item.id}`}>
                    <div className={styles.statusContainer}>
                      <span className={styles.store}>{item.storeName}</span>
                      <span className={styles.customer}>{item.clientName}</span>
                      <span className={styles.date}>{new Date(item.date).toLocaleDateString()}</span>
                      <span className={styles.time}>
                        {`${item.startTime.toLocaleString().slice(0, 5)} -
                        ${item.endTime.toLocaleString().slice(0, 5)}`}
                      </span>
                      <span className={styles.person}>
                        {item.numberOfMember}
                      </span>
                      {/* <span className={styles.status}>{item.states}</span> */}
                      {item.states === '待確認' && (
                        <span
                          className={`${styles.status} ${styles.statusRed}`}>
                          待確認
                        </span>
                      )}
                      {item.states === '已確認' && (
                        <span
                          className={`${styles.status} ${styles.statusYellow}`}>
                          已確認
                        </span>
                      )}
                      {item.states === '已完結' && (
                        <span
                          className={`${styles.status} ${styles.statusGreen}`}>
                          已完結
                        </span>
                      )}
                      {item.states === '已取消' && (
                        <span
                          className={`${styles.status} ${styles.statusGrey}`}>
                          已取消
                        </span>
                      )}
                    </div>
                    <div className={styles.specialContainer}>
                      <div className={styles.specialRequest}>
                        <span>特別要求:</span>
                        <br />
                        <span>
                          {item.special_requirement || '沒有特別要求'}
                        </span>
                      </div>
                      {item.states === '待確認' && (
                        <div className={styles.buttonContainer}>
                          <div className={styles.confirmButton}>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                handleConfirm(item.id)
                              }}>
                              確認
                            </Button>
                          </div>
                          <div className={styles.cancelButton}>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                handleCancel(item.id)
                              }}>
                              取消
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            {pages.length > 1 && (
              <Pagination
                pages={pages}
                fetchHandler={(e) => fetchOrdersList(Number(e.target.value))}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
