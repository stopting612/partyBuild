import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Header from 'components/common/Header/Header'
import styles from 'pages/User/MyParty/MyPartyList.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { fetchGetMyPartyList } from 'redux/User/Myparty/action'
import { MyPartyList } from 'components/User/MyParty/MyParty'
export default function MyParty() {
  const myPartyList = useSelector(
    (state: RootState) => state.myPartyList.shoppingBaskets
  )
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchGetMyPartyList())
  }, [])

  return (
    <div>
      <Helmet>
        <title>我的Party | Party Build</title>
      </Helmet>
      <div className={styles.bigContainer}>
        <Header>購物清單</Header>
        <div className={styles.titleContainer}>
          <div className={styles.acticityName}>舉辦活動名稱</div>
          <div className={styles.activityDate}>日期</div>
          <div className={styles.activityTime}>時間</div>
          <div className={styles.placeholder} />
        </div>
        <div className={styles.container}>
          {myPartyList.map((i) => (
            <MyPartyList key={i.id} result={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
