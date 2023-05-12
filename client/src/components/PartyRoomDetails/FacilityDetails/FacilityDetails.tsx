import CrossIcon from 'assets/CrossIcon'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import styles from './FacilityDetails.module.css'
export default function FacilityDetails(props: { onToggle: () => void }) {
  const facilityDetails = useSelector(
    (state: RootState) => state.partyRoomDetails.facilitiesDetails
  )
  return (
    <div className={styles.container} onClick={props.onToggle}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h3>設施詳情</h3>
        <ul>
          {facilityDetails.map((facilityDetail: string, index) => {
            return facilityDetail && <li key={index}>{facilityDetail}</li>
          })}
        </ul>
        <div className={styles.closeButton} onClick={props.onToggle}>
          <CrossIcon height='20px' />
        </div>
      </div>
    </div>
  )
}
