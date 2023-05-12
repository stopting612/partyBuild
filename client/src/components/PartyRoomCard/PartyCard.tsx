import styles from './PartyCard.module.css'
import React from 'react'
import CommentIcon from '../CommentStar'
import { RecommendPartyRoomList } from 'redux/RecommendPartyRoomList/reducer'
import { Link, useLocation } from 'react-router-dom'
import Button from '../common/Button/Button'
import defaultImg from 'assets/logo02.png'

interface IPartyRoomCard {
  canPreOrder?: boolean
  canDeliver?: boolean
  getRecommendListResult: RecommendPartyRoomList
  onSubmit?: () => void
  onClickDetails?: () => void
}
export function PartyRoomCard({
  canPreOrder: canPreorder,
  canDeliver,
  getRecommendListResult,
  onSubmit,
  onClickDetails
}: IPartyRoomCard) {
  const location = useLocation()
  return (
    <div className={styles.container}>
      <div
        style={{
          backgroundImage: `url(${
            getRecommendListResult.image !==
            'http://cdn.partybuildhk.com/undefined'
              ? getRecommendListResult.image
              : defaultImg
          })`
        }}
        className={styles.photo}
      />
      <div className={styles.cardContent}>
        <h2>{getRecommendListResult.name}</h2>
        <p>{getRecommendListResult.introduction}</p>
        <div className={styles.location}>{getRecommendListResult.district}</div>
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
              最低${getRecommendListResult.price}HKD/每位
            </div>
          </div>
          <div>
            {location.pathname !== '/hold-a-party/party-room-choice' ? (
              <>
                {canPreorder && <div>需三天前預訂</div>}
                {canDeliver && <div>免運費</div>}
                <div className={styles.detailButton}>
                  <Link to={`/party-room/${getRecommendListResult.id}`}>
                    <Button>詳情</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className={styles.orderButtons}>
                  <Button onClick={onSubmit}>選擇場地</Button>
                  <Button onClick={onClickDetails}>詳情</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
