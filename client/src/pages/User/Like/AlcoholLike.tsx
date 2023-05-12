import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBeverageLike } from 'redux/User/Like/action'
import { RootState } from 'store'
import { BeverageCardMini } from 'components/BeverageList/MiniCard'
import styles from 'pages/User/Like/CardContainer.module.css'

export function AlcoholLikeList() {
  const dispatch = useDispatch()
  const AlcoholLikeList = useSelector(
    (state: RootState) => state.userLikeList.alcoholList
  )

  const recordPerPage = 6
  const [page, setPage] = useState(1)
  const scrollEnd = () => {
    const innerHeight = window.innerHeight
    const pageHeight = document.body.scrollHeight
    const scrollHeight = window.scrollY
    if (
      pageHeight - (innerHeight + scrollHeight) < 50 &&
      page * recordPerPage < AlcoholLikeList.length
    ) {
      setPage((page) => page + 1)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollEnd)
    return () => {
      window.removeEventListener('scroll', scrollEnd)
    }
  }, [page, AlcoholLikeList])

  return (
    <>
      <div className={styles.container}>
        {AlcoholLikeList.length > 0 &&
          AlcoholLikeList.slice(0, page * recordPerPage).map((result) => (
            <BeverageCardMini
              key={result.id}
              result={result}
              dispatchToRedux={(id: number) =>
                dispatch(deleteBeverageLike(result.id))
              }
            />
          ))}
      </div>
    </>
  )
}
