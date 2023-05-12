import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../common/Header/Header'
import { addPartyRoomOrder } from 'redux/holdAParty/action'
import { history, RootState } from 'store'
import { PartyRoomCard } from 'components/PartyRoomCard/PartyCard'
import PartyRoomDetails from 'pages/PartyRoomDetails/PartyRoomDetails'
import styles from './HoldAParty.module.css'
import CrossIcon from 'assets/CrossIcon'
import { newNotification } from 'redux/notifications/action'
import { finishLoading, startLoading } from 'redux/loading/action'

export default function PartyRoomChoice() {
  const dispatch = useDispatch()
  const partyRoomChoices = useSelector(
    (state: RootState) => state.holdAParty.partyRoomChoices
  )
  useEffect(() => {
    if (partyRoomChoices.length === 0) {
      dispatch(newNotification('沒有搜尋結果'))
      dispatch(startLoading())
      dispatch(finishLoading())
      history.push('/hold-a-party/party-room')
    }
  }, [])
  const [choiceNum, setChoiceNum] = useState(3)
  const showPartyRoomChoices = partyRoomChoices.slice(0, choiceNum)
  const [showDetails, toggleShowDetails] = useState<number | null>(null)
  return (
    <div className={styles.container}>
      <Header>揀場地</Header>
      <div className={styles.cardContainer}>
        {showPartyRoomChoices.map((partyRoomChoice) => (
          <PartyRoomCard
            key={partyRoomChoice.id}
            getRecommendListResult={partyRoomChoice}
            onSubmit={() => {
              dispatch(addPartyRoomOrder(partyRoomChoice.id))
              history.push('/hold-a-party/food')
            }}
            onClickDetails={() => toggleShowDetails(partyRoomChoice.id)}
          />
        ))}
      </div>
      {showDetails && (
        <div
          className={styles.detailsContainer}
          onClick={() => toggleShowDetails(null)}>
          <div className={styles.details} onClick={(e) => e.stopPropagation()}>
            <PartyRoomDetails showCart={false} id={showDetails} />
          </div>
          <div className={styles.closeButton}>
            <CrossIcon height='20px' />
          </div>
        </div>
      )}
      {choiceNum < partyRoomChoices.length && (
        <div className={styles.showMoreButtonContainer}>
          <button
            className={styles.showMoreButton}
            onClick={() => setChoiceNum(choiceNum + 5)}>
            搜尋更多
          </button>
        </div>
      )}
      <div className={styles.buttonsContainer}>
        <button
          className={styles.skipButton}
          onClick={() => history.push('/hold-a-party/food')}>
          之後再揀場地
        </button>
      </div>
    </div>
  )
}
