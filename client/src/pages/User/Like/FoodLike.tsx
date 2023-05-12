import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUserFoodList } from 'redux/User/Like/action'
import { RootState } from 'store'
import { FoodCardMini } from 'components/RestaurantCard/MiniCard'
import styles from 'pages/User/Like/CardContainer.module.css'

export function FoodLikeList() {
  const dispatch = useDispatch()
  const FoodLikeList = useSelector(
    (state: RootState) => state.userLikeList.foodList
  )

  const recordPerPage = 6
  const [page, setPage] = useState(1)
  const scrollEnd = () => {
    const innerHeight = window.innerHeight
    const pageHeight = document.body.scrollHeight
    const scrollHeight = window.scrollY
    if (
      pageHeight - (innerHeight + scrollHeight) < 50 &&
      page * recordPerPage < FoodLikeList.length
    ) {
      setPage((page) => page + 1)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollEnd)
    return () => {
      window.removeEventListener('scroll', scrollEnd)
    }
  }, [page, FoodLikeList])

  return (
    <>
      <div className={styles.container}>
        {FoodLikeList.length > 0 &&
          FoodLikeList.slice(0, page * recordPerPage).map((result) => (
            <FoodCardMini
              key={result.id}
              result={result}
              dispatchToRedux={(id: number) =>
                dispatch(deleteUserFoodList(result.id))
              }
            />
          ))}
      </div>
    </>
  )
}
