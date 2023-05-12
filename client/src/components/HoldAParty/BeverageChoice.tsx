import CrossIcon from 'assets/CrossIcon'
import RightArrow from 'assets/RightArrow'
import { RecommendBeverageCard } from 'components/BeverageList/RecommendCard'
import Button from 'components/common/Button/Button'
import CreateNewParty from 'components/HoldAParty/CreateNewParty/CreateNewParty'
import BeverageDetails from 'pages/BeverageDetails/BeverageDetails'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startLoading, finishLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { RootState, history } from 'store'
import Header from '../common/Header/Header'
import styles from './HoldAParty.module.css'
import UserLogin from './UserLogin/UserLogin'
import UserRegister from './UserRegister/UserRegister'

export default function BeverageChoice() {
  const dispatch = useDispatch()
  const beverageChoices = useSelector(
    (state: RootState) => state.holdAParty.beverageChoices
  )
  useEffect(() => {
    if (beverageChoices.length === 0) {
      dispatch(newNotification('沒有搜尋結果'))
      dispatch(startLoading())
      dispatch(finishLoading())
      history.push('/hold-a-party/beverage')
    }
  }, [])

  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated)
  const type = useSelector((state: RootState) => state.auth.type)

  const [choiceNum, setChoiceNum] = useState(3)
  const showBeverageChoices = beverageChoices.slice(0, choiceNum)
  const [showDetails, toggleShowDetails] = useState<number | null>(null)
  const [showCreate, toggleShowCreate] = useState<boolean>(false)
  const [registerPage, setRegisterPage] = useState(false)

  return (
    <div className={styles.container}>
      <Header>揀酒類</Header>
      <div className={styles.cardContainer}>
        {showBeverageChoices.map((beverageChoice) => (
          <RecommendBeverageCard
            key={beverageChoice.id}
            getRecommendListResult={beverageChoice}
            onClickDetails={() => toggleShowDetails(beverageChoice.id)}
          />
        ))}
      </div>
      {showDetails && (
        <div
          className={styles.detailsContainer}
          onClick={() => toggleShowDetails(null)}>
          <div className={styles.details} onClick={(e) => e.stopPropagation()}>
            <BeverageDetails showCart={false} id={showDetails} />
          </div>
          <div className={styles.closeButton}>
            <CrossIcon height='20px' />
          </div>
        </div>
      )}
      {choiceNum < beverageChoices.length && (
        <div className={styles.showMoreButtonContainer}>
          <button
            className={styles.showMoreButton}
            onClick={() => setChoiceNum(choiceNum + 5)}>
            搜尋更多
          </button>
        </div>
      )}
      <div className={`${styles.buttonsContainer} ${styles.rowReverse}`}>
        <Button onClick={() => toggleShowCreate(true)}>
          <span>我要開Party</span>
          <RightArrow />
        </Button>
      </div>
      {showCreate && (
        <div
          className={styles.createNewParty}
          onClick={() => toggleShowCreate(false)}>
          {registerPage ? (
            <UserRegister setRegisterPage={setRegisterPage} />
          ) : isAuth && type === 'user' ? (
            <CreateNewParty />
          ) : (
            <UserLogin setRegisterPage={setRegisterPage} />
          )}
        </div>
      )}
    </div>
  )
}
