import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  deletePartyRoomLike
} from 'redux/User/Like/action'
import { RootState } from 'store'
import { PartyRoomCardMini } from 'components/PartyRoomCard/PartyCardMini'
import styles from 'pages/User/Like/CardContainer.module.css'

export function PartyRoomLikeList() {
  const dispatch = useDispatch()
  const partyRoomLikeList = useSelector(
    (state: RootState) => state.userLikeList.partyRoom
  )

  const recordPerPage = 6
  const [page, setPage] = useState(1)
  const scrollEnd = () => {
    const innerHeight = window.innerHeight
    const pageHeight = document.body.scrollHeight
    const scrollHeight = window.scrollY
    if (
      pageHeight - (innerHeight + scrollHeight) < 50 &&
      page * recordPerPage < partyRoomLikeList.length
    ) {
      setPage((page) => page + 1)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollEnd)
    return () => {
      window.removeEventListener('scroll', scrollEnd)
    }
  }, [page, partyRoomLikeList])

  return (
    <>
      <div className={styles.container}>
        {partyRoomLikeList.length > 0 &&
          partyRoomLikeList
            .slice(0, page * recordPerPage)
            .map((result) => (
              <PartyRoomCardMini
                key={result.id}
                result={result}
                dispatchToRedux={(id: number) =>
                  dispatch(deletePartyRoomLike(result.id))
                }
              />
            ))}
      </div>
    </>
  )
}
