import React, { useEffect, useState } from 'react'
import styles from '../../pages/styles/PartyList.module.css'
import { RecommendRestaurantCard } from 'components/RestaurantCard/RecommendRestaurantCard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { fetchRecommendRestaurant } from 'redux/RecommendRestaurantRoom/action'
import {
  deleteFoodListLike,
  fetchGetFoodList,
  sortingFoodbyPriceAndAvgRating as sortingFoodByPriceAndAvgRating,
  sortingFoodByWord
} from 'redux/FoodList/action'
import { FoodCardMini } from 'components/RestaurantCard/MiniCard'
import { Helmet } from 'react-helmet'
import { FilterButton } from 'components/common/FilterButton/FilterButton'
import { MoreFoodFilter } from './MoreFoodFilter'
import { SearchBar } from 'components/common/SearchBar/SearchBar'

export default function RestaurantList() {
  const recommendRestaurant = useSelector(
    (state: RootState) => state.recommendRestaurant
  )
  const [activeFilter, setActiveFilter] = useState('')
  const foodList = useSelector((state: RootState) => state.foodLists.foodLists)
  const dispatch = useDispatch()
  const [moreFilter, setMoreFilter] = useState(false)

  useEffect(() => {
    dispatch(fetchRecommendRestaurant())
    dispatch(fetchGetFoodList())
  }, [])
  return (
    <>
      <Helmet>
        <title>到會一覽 | Party Build</title>
      </Helmet>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <h1>到會一覽</h1>
        </div>
        <span className={styles.underline} />
        <div className={styles.filterContainer}>
          <div className={styles.moreFilterContainer}>
            <FilterButton
              active={activeFilter === 'price' ? 'active' : ''}
              name={'價格'}
              onClick={() => {
                setActiveFilter('price')
                dispatch(sortingFoodByPriceAndAvgRating('price'))
              }}
            />
            <FilterButton
              active={activeFilter === 'rating' ? 'active' : ''}
              name={'最高評分'}
              onClick={() => {
                setActiveFilter('rating')
                dispatch(sortingFoodByPriceAndAvgRating('avgRating'))
              }}
            />
            <FilterButton
              name={'更多篩選條件'}
              onClick={() => {
                setMoreFilter(!moreFilter)
              }}
            />
            {moreFilter && (
              <MoreFoodFilter
                onToggle={() => {
                  setMoreFilter(!moreFilter)
                }}
                onClose={() => {
                  setMoreFilter(false)
                  setActiveFilter('')
                }}
              />
            )}
          </div>
          <div className={styles.searchBarContainer}>
            <SearchBar
              dispatchServer={(data: { type: string }) =>
                dispatch(sortingFoodByWord(data))
              }
            />
          </div>
        </div>
        <div className={styles.container}>
          {recommendRestaurant.id && (
            <div className={styles.mainContainer}>
              <RecommendRestaurantCard
                getRecommendListResult={recommendRestaurant}
                canDeliver={recommendRestaurant.shippingFree}
              />
            </div>
          )}
          <div className={styles.partyRoomListContainer}>
            <div className={styles.miniContainer}>
              {foodList.map((result) => (
                <FoodCardMini
                  key={result.id}
                  result={result}
                  dispatchToRedux={(id: number) =>
                    dispatch(deleteFoodListLike(result.id))
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
