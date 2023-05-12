import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import styles from './PartyRoomHeader.module.css'

export default function PartyRoomHeader() {
  const [
    name,
    area,
    maxNumberOfPeople,
    minNumberOfPeople,
    address
  ] = useSelector((state: RootState) => [
    state.partyRoomDetails.name,
    state.partyRoomDetails.area,
    state.partyRoomDetails.maxNumberOfPeople,
    state.partyRoomDetails.minNumberOfPeople,
    state.partyRoomDetails.address
  ])
  return (
    <div className={styles.container}>
      <Helmet>
        <title>{name} | Party Build</title>
      </Helmet>
      <h3 className={styles.name}>{name}</h3>
      <div>地址: {address}</div>
      <div className={styles.info}>
        <span>{area} 平方尺</span>
        <span>
          適合{minNumberOfPeople}至{maxNumberOfPeople}人
        </span>
      </div>
    </div>
  )
}
