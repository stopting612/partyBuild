import React from 'react'
import styles from '../styles/MiniCard.module.css'
import LikeIcon from '../LikeIcon'
import CommentIcon from '../CommentStar'
import { Link } from 'react-router-dom'
import { FoodList } from 'redux/FoodList/reducer'
import { useDispatch } from 'react-redux'
import { createFoodListLike } from 'redux/FoodList/action'

interface MiniFoodCard {
  result: FoodList
  dispatchToRedux?: (id: number) => void
}

export function FoodCardMini({ result, dispatchToRedux }: MiniFoodCard) {
  const dispatch = useDispatch()
  const onLike = (e: any) => {
    e.preventDefault()
    if (result.isFavorite) {
      dispatchToRedux!(result.id)
    } else {
      dispatch(createFoodListLike(result.id))
    }
  }
  return (
    <div className={styles.container}>
      <Link to={`/food/${result.id}`}>
        <div
          style={{ backgroundImage: `url(${result.image})` }}
          className={styles.photo}
        />
        <div className={styles.content}>
          <div className={styles.area}>
            <div className={styles.title}>{result.name} </div>
            {result.isFavorite !== undefined && (
              <div className={styles.likeButton} onClick={onLike}>
                <LikeIcon
                  liked={result.isFavorite}
                  height={'25px'}
                  width={'35px'}
                />
              </div>
            )}
          </div>

          <div className={styles.cardDetail}>
            <div>
            {result.numberOfRating === '0' && (
              <div className={styles.commentContainer}>
                未有評論{' '}
              </div>
            )}
            {result.numberOfRating !== '0' && (
              <div className={styles.commentContainer}>
                <CommentIcon height={'15px'} width={'20px'} />
                {result.avgRating}({result.numberOfRating})則評論
              </div>
            )}
              <div className={styles.price}>最低${result.price} HKD</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
