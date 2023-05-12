import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, history } from 'store'
import Header from '../common/Header/Header'
import styles from './HoldAParty.module.css'
import { RecommendRestaurantCard } from 'components/RestaurantCard/RecommendRestaurantCard'
import FoodDetails from 'pages/FoodDetails/FoodDetails'
import CrossIcon from 'assets/CrossIcon'
import RightArrow from 'assets/RightArrow'
import Button from 'components/common/Button/Button'
import { newNotification } from 'redux/notifications/action'
import { startLoading, finishLoading } from 'redux/loading/action'

export default function FoodChoice() {
  const dispatch = useDispatch()
  const foodChoices = useSelector(
    (state: RootState) => state.holdAParty.foodChoices
  )
  useEffect(() => {
    if (foodChoices.length === 0) {
      dispatch(newNotification('沒有搜尋結果'))
      dispatch(startLoading())
      dispatch(finishLoading())
      history.push('/hold-a-party/food')
    }
  }, [])

  const [choiceNum, setChoiceNum] = useState(3)
  const showFoodChoices = foodChoices.slice(0, choiceNum)
  const [showDetails, toggleShowDetails] = useState<number | null>(null)
  return (
    <div className={styles.container}>
      <Header>揀到會</Header>
      <div className={styles.cardContainer}>
        {showFoodChoices.map((foodChoices) => (
          <RecommendRestaurantCard
            key={foodChoices.id}
            getRecommendListResult={foodChoices}
            onClickDetails={() => toggleShowDetails(foodChoices.id)}
          />
        ))}
      </div>
      {showDetails && (
        <div
          className={styles.detailsContainer}
          onClick={() => toggleShowDetails(null)}>
          <div className={styles.details} onClick={(e) => e.stopPropagation()}>
            <FoodDetails showCart={false} id={showDetails} />
          </div>
          <div className={styles.closeButton}>
            <CrossIcon height='20px' />
          </div>
        </div>
      )}
      {choiceNum < foodChoices.length && (
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
          onClick={() => history.push('/hold-a-party/beverage')}>
          之後再揀到會
        </button>
        <Button onClick={() => history.push('/hold-a-party/beverage')}>
          <span>揀到會</span>
          <RightArrow />
        </Button>
      </div>
    </div>
  )
}
