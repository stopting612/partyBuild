import React from 'react'
import styles from './ViewAll.module.css'
import foodphoto from '../../../assets/FoodPartyPhoto.jpg'
import alcoholphoto from '../../../assets/alcoholPhoto.jpg'
import partyRoomphoto from '../../../assets/partyRoomParty012.jpg'
import { Link } from 'react-router-dom'

export default function ViewAll() {
  return (
    <div className={styles.container}>
      <h2>盡情瀏覽</h2>
      <div className={styles.cardContainer}>
        <div className={styles.box}>
          <Link to={'/party-room'}>
            <div className={styles.title}>
              <h2>PartyRoom</h2>
            </div>
            <img src={partyRoomphoto} />
          </Link>
        </div>
        <div className={styles.box}>
          <Link to={'/food'}>
            <div className={styles.title}>
              <h2>到會</h2>
            </div>
            <img src={foodphoto} />
          </Link>
        </div>
        <div className={styles.box}>
          <Link to={'/beverage'}>
            <div className={styles.title}>
              <h2>酒類</h2>
            </div>
            <img src={alcoholphoto} />
          </Link>
        </div>
      </div>
    </div>
  )
}
