import Button from 'components/common/Button/Button'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import CheckedIcon from '../../common/CheckedIcon/CheckedIcon'
import styles from './PartyRoomFacility.module.css'

export default function PartyRoomFacility(props: { onToggle: () => void }) {
  const facilities = useSelector(
    (state: RootState) => state.partyRoomDetails.facilities
  )

  return (
    <div>
      <h3>場地設施</h3>
      <ul className={styles.facilityList}>
        {facilities.map((facility) => (
          <li className={styles.facility} key={facility.id}>
            <span className={styles.facilityItem}>{facility.name}</span>
            <span className={facility.isAvailable ? '' : styles.notAvailable}>
              <CheckedIcon checked={facility.isAvailable} height={'20px'} />
            </span>
          </li>
        ))}
        <div className={styles.buttonContainer}>
          <Button onClick={props.onToggle}>更多設施詳情</Button>
        </div>
      </ul>
    </div>
  )
}
