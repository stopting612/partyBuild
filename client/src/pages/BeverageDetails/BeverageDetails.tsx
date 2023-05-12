import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import AddToCartForm from '../../components/BeverageDetails/AddToCartForm/AddToCartForm'
import ShopIcon from '../../components/common/ShopIcon/ShopIcon'
import styles from '../styles/ShopDetails.module.css'
import CommentList from '../../components/comment/CommentList'
import { history, RootState } from 'store'
import { fetchBeverageDetails } from 'redux/beverageDetails/action'
import BeverageHeader from 'components/BeverageDetails/BeverageHeader/BeverageHeader'
import BeverageIntro from 'components/BeverageDetails/BeverageIntro/BeverageIntro'
import { fetchComments, resetComments } from 'redux/comment/action'
import { createBeverageLike } from 'redux/BeverageList/action'

export default function BeverageDetails(props: {
  showCart?: boolean
  id?: number
}) {
  const id = useParams<{ id: string }>().id ?? props.id
  const dispatch = useDispatch()
  const beverageImage = useSelector(
    (state: RootState) => state.beverageDetails.image
  )

  useEffect(() => {
    if (isNaN(Number(id))) {
      history.push('/food')
    } else {
      dispatch(fetchBeverageDetails(Number(id)))
      dispatch(fetchComments('beverage', Number(id)))
    }
    return () => {
      dispatch(resetComments())
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.section}>
          <div>
            <ShopIcon
              image={beverageImage}
              createLike={() => {
                dispatch(createBeverageLike(Number(id)))
              }}
            />
          </div>
          <div>
            <BeverageHeader />
            {props.showCart && <AddToCartForm id={Number(id)} />}
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <BeverageIntro />
      </div>
      <div className={styles.section}>
        <CommentList />
      </div>
    </div>
  )
}

BeverageDetails.defaultProps = {
  showCart: true
}
