import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import styles from './PartyRoomIntro.module.css'

export default function PartyRoomIntro() {
  const introduction = useSelector((state: RootState) => state.partyRoomDetails.introduction)
  return (
    <div className={styles.container}>
      <h3>場地簡介</h3>
      <p className={styles.content}>{introduction}</p>
    </div>
  )
}
