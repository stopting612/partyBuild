import React from 'react'
import styles from '../styles/MiniCard.module.css'
import LikeIcon from '../LikeIcon'
import CommentIcon from '../CommentStar'
import { Link } from 'react-router-dom'
import { BeverageList } from 'redux/BeverageList/reducer'
import { useDispatch } from 'react-redux'
import { createBeverageLike } from 'redux/BeverageList/action'

interface MiniBeverageCard {
  result: BeverageList
  dispatchToRedux?: (id: number) => void
}

export function BeverageCardMini({
  result,
  dispatchToRedux
}: MiniBeverageCard) {
  const dispatch = useDispatch()
  const onLike = (e: any) => {
    e.preventDefault()
    if (result.isFavorite) {
      dispatchToRedux!(result.id)
    } else {
      dispatch(createBeverageLike(result.id))
    }
  }
  return (
    <div className={styles.container}>
      <Link to={`/beverage/${result.id}`}>
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
            {result.numberOfRating === '0' && (
              <div className={styles.commentContainer}>未有評論 </div>
            )}
            {result.numberOfRating !== '0' && (
              <div className={styles.commentContainer}>
                <CommentIcon height={'15px'} width={'20px'} />
                {result.avgRating}({result.numberOfRating})則評論
              </div>
            )}
            <div className={styles.price}>
              平均{result.averagePrice}HKD/ 一支 ({result.pack})
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
