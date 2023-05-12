import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import styles from './PartyRoomNotice.module.css'

export default function PartyRoomNotice() {
  const importantMatter = useSelector(
    (state: RootState) => state.partyRoomDetails.importantMatter
  )
  return (
    <div>
      <h3>重要事項</h3>
      {importantMatter.map((item, index) => (
        <p key={index} className={styles.content}>
          {item}
        </p>
      ))}
    </div>
  )
}
