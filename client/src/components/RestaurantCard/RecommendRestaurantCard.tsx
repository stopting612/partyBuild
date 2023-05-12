import styles from './RecommendRestaurantCard.module.css'
import CommentIcon from '../CommentStar'
import { RecommendRestaurant } from 'redux/RecommendRestaurantRoom/reducer'
import { Link, useLocation } from 'react-router-dom'
import Button from '../common/Button/Button'
import Quantity from './Quantity'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addFoodOrder } from 'redux/holdAParty/action'

interface RestaurantCard {
  getRecommendListResult: RecommendRestaurant
  canPreorder?: boolean
  canDeliver?: boolean
  onClickDetails?: () => void
}

export function RecommendRestaurantCard({
  getRecommendListResult,
  canPreorder,
  canDeliver,
  onClickDetails
}: RestaurantCard) {
  if (!getRecommendListResult.id) {
    return <></>
  }
  const location = useLocation()
  const [shippingFee, setShippingFee] = useState<number>(
    getRecommendListResult.shippingFees
      ? getRecommendListResult.shippingFees[0].id
      : 0
  )
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch()
  return (
    <div className={styles.container}>
      <div
        style={{ backgroundImage: `url(${getRecommendListResult.image})` }}
        className={styles.photo}
      />
      <div className={styles.cardContent}>
        <h2>{getRecommendListResult.name}</h2>
        <p>{getRecommendListResult.introduction}</p>
        <div className={styles.cardDetail}>
          <div>
            <div className={styles.commentContainer}>
              <div className={styles.commentIcon}>
                <CommentIcon height={'15px'} width={'20px'} />
              </div>
              <div className={styles.avgRating}>
                {getRecommendListResult.avgRating}
              </div>
              <div className={styles.numberRating}>
                ({getRecommendListResult.numberOfRating})則評倫
              </div>
            </div>
            <div className={styles.price}>
              最低${getRecommendListResult.price}HKD
            </div>
          </div>
          <div className={styles.buttonsContainer}>
            {location.pathname !== '/hold-a-party/food-choice' ? (
              <div className={styles.detailButton}>
                <Link to={`/food/${getRecommendListResult.id}`}>
                  <Button>詳情</Button>
                </Link>
              </div>
            ) : (
              <Quantity
                shippingFees={getRecommendListResult.shippingFees!}
                shippingFee={shippingFee ?? ''}
                setShippingFee={setShippingFee}
                quantity={quantity}
                setQuantity={setQuantity}
                onSubmit={() => {
                  dispatch(
                    addFoodOrder({
                      id: getRecommendListResult.id!,
                      quantity: quantity,
                      shippingFeeId: shippingFee!
                    })
                  )
                }}
                onClickDetails={onClickDetails}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
