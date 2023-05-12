import styles from 'pages/User/PartyHistory/PartyHistory.module.css'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGetHistoryShopptingList as fetchGetHistoryShoppingList } from 'redux/User/PartyHistory/action'
import { RootState } from 'store'
import { ShoppingHistoryList } from 'components/User/ShoppingHistoryList'
import Header from 'components/common/Header/Header'
import { Helmet } from 'react-helmet'
import Pagination from 'components/common/Pagination/Pagination'

export default function PartyHistory() {
  const basketHistoryList = useSelector(
    (state: RootState) => state.shoppingBasket.shoppingBaskets
  )
  const count = useSelector((state: RootState) => state.shoppingBasket.count)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchGetHistoryShoppingList())
  }, [])
  const recordPerPage = 10
  const pages = Array.from(
    Array(Math.ceil(count / recordPerPage)).keys(),
    (x) => x + 1
  )
  return (
    <>
      <Helmet>
        <title>訂單紀錄 | Party Build</title>
      </Helmet>
      <div className={styles.bigContainer}>
        <Header>訂單紀錄</Header>
        <div className={styles.titleContainer}>
          <div className={styles.acticityName}>活動名稱</div>
          <div className={styles.activityDate}>日期</div>
          <div className={styles.activityTime}>時間</div>
          <div className={styles.activityStatus}>狀態</div>
          <div className={styles.activityComment}>評分</div>
        </div>
        <div className={styles.container}>
          {basketHistoryList.map((i) => (
            <ShoppingHistoryList key={i.id} result={i} />
          ))}
        </div>
        {pages.length > 1 && (
          <Pagination
            pages={pages}
            fetchHandler={(e) =>
              fetchGetHistoryShoppingList(Number(e.target.value))
            }
          />
        )}
      </div>
    </>
  )
}
