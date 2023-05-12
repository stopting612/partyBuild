import React from 'react'
import styles from '../styles/MiniCard.module.css'
import LikeIcon from '../LikeIcon'
import CommentIcon from '../CommentStar'
import { PartyRoom } from 'redux/PartyRoomList/reducer'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createPartyRoomLike } from 'redux/PartyRoomList/action'
import defaultImg from 'assets/logo02.png'

interface PartyRoomCard {
  result: PartyRoom
  dispatchToRedux?: (id: number) => void
}

export function PartyRoomCardMini({ result, dispatchToRedux }: PartyRoomCard) {
  const dispatch = useDispatch()
  const onLike = (e: any) => {
    e.preventDefault()
    if (result.isFavorite) {
      dispatchToRedux!(result.id)
    } else {
      dispatch(createPartyRoomLike(result.id))
    }
  }
  return (
    <div className={styles.container}>
      <Link to={`/party-room/${result.id}`}>
        <div
          style={{
            backgroundImage: `url(${
              result.image !== 'http://cdn.partybuildhk.com/undefined'
                ? result.image
                : defaultImg
            })`
          }}
          className={styles.photo}
        />
        <div className={styles.content}>
          <div className={styles.area}>
            <div className={styles.title}>{result.name} </div>
            <div className={styles.location}> {result.district} </div>
            <div className={styles.likeButton} onClick={onLike}>
              {result.isFavorite !== undefined && (
                <LikeIcon
                  liked={result.isFavorite}
                  height={'25px'}
                  width={'35px'}
                />
              )}
            </div>
          </div>

        <div className={styles.cardDetail}>
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
            <div className={styles.price}>最低${result.price} HKD/ 每位</div>
          </div>
        </div>
      </Link>
    </div>
  )
}
