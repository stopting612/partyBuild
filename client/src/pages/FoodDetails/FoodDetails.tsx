import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import AddToCartForm from '../../components/FoodDetails/AddToCartForm/AddToCartForm'
import ShopIcon from '../../components/common/ShopIcon/ShopIcon'
import styles from '../styles/ShopDetails.module.css'
import CommentList from '../../components/comment/CommentList'
import ShippingFee from 'components/FoodDetails/ShippingFee/ShippingFee'
import { fetchFoodDetails } from 'redux/foodDetails/action'
import FoodHeader from 'components/FoodDetails/FoodHeader/FoodHeader'
import { history, RootState } from 'store'
import Menu from 'components/FoodDetails/Menu/Menu'
import { fetchComments, resetComments } from 'redux/comment/action'
import { createFoodListLike } from 'redux/FoodList/action'

export default function FoodDetails(props: {
  showCart?: boolean
  id?: number
}) {
  const id = useParams<{ id: string }>().id ?? props.id
  const dispatch = useDispatch()
  const foodImage = useSelector((state: RootState) => state.foodDetails.image)
  const commentPage = useSelector((state: RootState) => state.comments.page)

  useEffect(() => {
    if (isNaN(Number(id))) {
      history.push('/food')
    } else {
      dispatch(fetchFoodDetails(Number(id)))
      dispatch(fetchComments('food', Number(id)))
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
              image={foodImage}
              createLike={() => {
                dispatch(createFoodListLike(Number(id)))
              }}
            />
          </div>
          <div>
            <FoodHeader />
            {props.showCart && <AddToCartForm id={Number(id)} />}
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <Menu />
      </div>
      <div className={styles.section}>
        <ShippingFee />
      </div>
      <div className={styles.section}>
        <CommentList
          loadMoreComment={() =>
            dispatch(fetchComments('food', Number(id), commentPage))
          }
        />
      </div>
    </div>
  )
}

FoodDetails.defaultProps = {
  showCart: true
}
