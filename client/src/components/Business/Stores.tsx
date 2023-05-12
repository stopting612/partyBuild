import Button from 'components/common/Button/Button'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchStoreList } from 'redux/Business/action'
import { history, RootState } from 'store'
import styles from './business.module.css'

export default function Stores() {
  const dispatch = useDispatch()
  const storeList = useSelector((state: RootState) => state.business.storeList)
  useEffect(() => {
    dispatch(fetchStoreList())
  }, [])
  return (
    <div className={styles.container}>
      <h2>店舖一覽</h2>
      <div className={styles.content}>
        {storeList.map((store) => (
          <div key={store.id}>
            <span>{store.name}</span>
            <Button
              onClick={() => {
                history.push(`/business/branch?branch=${store.id}`)
              }}>
              店舖狀態
            </Button>
            <Link to={`/business/branch/${store.id}`}>
              <Button>更改資料</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
