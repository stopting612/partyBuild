import styles from '../../pages/styles/PartyList.module.css'
import { RecommendBeverageCard } from 'components/BeverageList/RecommendCard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import React, { useEffect, useState } from 'react'
import { fetchRecommendBeverage } from 'redux/RecommendBeverge/action'
import { BeverageCardMini } from 'components/BeverageList/MiniCard'
import {
  deleteBeverageLike,
  fetchGetBeverageList,
  sortingBeverageByPriceAndAvgRating,
  sortingBeverageByWord
} from 'redux/BeverageList/action'
import { Helmet } from 'react-helmet'
import { FilterButton } from 'components/common/FilterButton/FilterButton'
import { MoreBeverageFilter } from './MoreBeverageFilter'
import { SearchBar } from 'components/common/SearchBar/SearchBar'

export default function PartyRoomList() {
  const recommendBeverageList = useSelector(
    (state: RootState) => state.recommendBeverage
  )
  const BeverageList = useSelector(
    (state: RootState) => state.BeverageList.beverageLists
  )
  const dispatch = useDispatch()
  const [moreFilter, setMoreFilter] = useState(false)
  const [activeFilter, setActiveFilter] = useState('')

  useEffect(() => {
    dispatch(fetchRecommendBeverage())
    dispatch(fetchGetBeverageList())
  }, [])

  return (
    <>
      <Helmet>
        <title>酒類一覽 | Party Build</title>
      </Helmet>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <h1>酒類一覽</h1>
        </div>
        <span className={styles.underline} />
        <div className={styles.filterContainer}>
          <div className={styles.moreFilterContainer}>
            <FilterButton
              active={activeFilter === 'price' ? 'active' : ''}
              name={'價格'}
              onClick={() => {
                setActiveFilter('price')
                dispatch(sortingBeverageByPriceAndAvgRating('price'))
              }}
            />
            <FilterButton
              active={activeFilter === 'rating' ? 'active' : ''}
              name={'最高評分'}
              onClick={() => {
                setActiveFilter('rating')
                dispatch(sortingBeverageByPriceAndAvgRating('avgRating'))
              }}
            />
            <FilterButton
              name={'更多篩選條件'}
              onClick={() => {
                setMoreFilter(!moreFilter)
              }}
            />
            {moreFilter && (
              <MoreBeverageFilter
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
                dispatch(sortingBeverageByWord(data))
              }
            />
          </div>
        </div>
        <div className={styles.container}>
          {recommendBeverageList.id && (
            <div className={styles.mainContainer}>
              <RecommendBeverageCard
                getRecommendListResult={recommendBeverageList}
                canPreorder={false}
                canDeliver={false}
              />
            </div>
          )}
          <div className={styles.partyRoomListContainer}>
            <div className={styles.miniContainer}>
              {BeverageList.map((result) => (
                <BeverageCardMini
                  key={result.id}
                  result={result}
                  dispatchToRedux={(id: number) =>
                    dispatch(deleteBeverageLike(result.id))
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
