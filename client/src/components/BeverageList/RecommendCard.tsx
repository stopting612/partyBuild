import styles from './RecommendCard.module.css'
import CommentIcon from '../CommentStar'
import { RecommendBeverage } from 'redux/RecommendBeverge/reducer'
import { Link, useLocation } from 'react-router-dom'
import Button from '../common/Button/Button'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Quantity from 'components/RestaurantCard/Quantity'
import { addBeverageOrder } from 'redux/holdAParty/action'

interface BeverageCard {
  getRecommendListResult: RecommendBeverage
  canPreorder?: boolean
  canDeliver?: boolean
  onClickDetails?: () => void
}

export function RecommendBeverageCard({
  getRecommendListResult,
  canPreorder,
  canDeliver,
  onClickDetails
}: BeverageCard) {
  if (!getRecommendListResult.id) {
    return <></>
  }
  const location = useLocation()
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
              平均{getRecommendListResult.averagePrice}HKD/一支 （
              {getRecommendListResult.pack})
            </div>
          </div>
          <div className={styles.buttonsContainer}>
            {location.pathname !== '/hold-a-party/beverage-choice' ? (
              <>
                {canPreorder && <div>需三天前預訂</div>}
                {canDeliver && <div>免運費</div>}
                <div className={styles.detailButton}>
                  <Link to={`/beverage/${getRecommendListResult.id}`}>
                    <Button>詳情</Button>
                  </Link>
                </div>
              </>
            ) : (
              <Quantity
                quantity={quantity}
                setQuantity={setQuantity}
                onSubmit={() => {
                  dispatch(
                    addBeverageOrder({
                      id: getRecommendListResult.id!,
                      quantity: quantity
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
