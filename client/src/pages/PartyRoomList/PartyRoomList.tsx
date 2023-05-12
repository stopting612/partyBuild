import { PartyRoomCard } from 'components/PartyRoomCard/PartyCard'
import styles from '../../pages/styles/PartyList.module.css'
import { PartyRoomCardMini } from 'components/PartyRoomCard/PartyCardMini'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import React, { useEffect, useState } from 'react'
import { fetchRecommendDetail } from 'redux/RecommendPartyRoomList/action'
import {
  deletePartyRoomLike,
  fetchGetPartyRoomList,
  sortingPartyRoomByRatingAndPrice,
  sortingPartyRoomByWord
} from 'redux/PartyRoomList/action'
import { Helmet } from 'react-helmet'
import { FilterButton } from 'components/common/FilterButton/FilterButton'
import { MorePartyRoomFilter } from './MorePartyFilter'
import { SearchBar } from 'components/common/SearchBar/SearchBar'

export default function PartyRoomList() {
  const recommendPartyRoomList = useSelector(
    (state: RootState) => state.recommendPartyRoomList
  )
  const partyRoomList = useSelector(
    (state: RootState) => state.partyRoomList.partyRooms
  )

  const dispatch = useDispatch()
  const [moreFilter, setMoreFilter] = useState(false)
  const [activeFilter, setActiveFilter] = useState('')

  useEffect(() => {
    dispatch(fetchRecommendDetail())
    dispatch(fetchGetPartyRoomList())
  }, [])

  return (
    <>
      <Helmet>
        <title>Party Room 一覽 | Party Build</title>
      </Helmet>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <h1>PARTY ROOM 一覽</h1>
        </div>
        <span className={styles.underline} />
        <div className={styles.filterContainer}>
          <div className={styles.moreFilterContainer}>
            <FilterButton
              active={activeFilter === 'price' ? 'active' : ''}
              name={'價格'}
              onClick={() => {
                setActiveFilter('price')
                dispatch(sortingPartyRoomByRatingAndPrice('price'))
              }}
            />
            <FilterButton
              active={activeFilter === 'rating' ? 'active' : ''}
              name={'最高評分'}
              onClick={() => {
                setActiveFilter('rating')
                dispatch(sortingPartyRoomByRatingAndPrice('avgRating'))
              }}
            />
            <FilterButton
              name={'更多篩選條件'}
              onClick={() => {
                setMoreFilter(!moreFilter)
              }}
            />
            {moreFilter && (
              <MorePartyRoomFilter
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
                dispatch(sortingPartyRoomByWord(data))
              }
            />
          </div>
        </div>
        <div className={styles.container}>
          {recommendPartyRoomList.id && (
            <div className={styles.mainContainer}>
              <PartyRoomCard getRecommendListResult={recommendPartyRoomList} />
            </div>
          )}
          <div className={styles.partyRoomListContainer}>
            <div className={styles.miniContainer}>
              {partyRoomList.map((result) => (
                <PartyRoomCardMini
                  key={result.id}
                  result={result}
                  dispatchToRedux={(id: number) =>
                    dispatch(deletePartyRoomLike(result.id))
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
