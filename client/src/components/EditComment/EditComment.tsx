import styles from 'components/EditComment/EditComment.module.css'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import Button from 'components/common/Button/Button'
import {
  fetchGetMyComment,
  updateAlcoholComment,
  updateAlcoholRating,
  updateComment,
  updateFoodComment,
  updateFoodRating,
  updatePartyRoomComment,
  updatePartyRoomRating
} from 'redux/EditComment/action'
import { CommentContainer } from 'components/common/CommentContainer/CommentContainer'

export function EditComment(props: { id: number; onToggle: () => void }) {
  const dispatch = useDispatch()

  const partyComment = useSelector(
    (state: RootState) => state.getuserComment.partyRoom
  )

  const foodComment = useSelector(
    (state: RootState) => state.getuserComment.foods
  )
  const alcoholComment = useSelector(
    (state: RootState) => state.getuserComment.alcohols
  )

  useEffect(() => {
    dispatch(fetchGetMyComment(props.id))
  }, [])

  return (
    <>
      <div className={styles.container} onClick= {props.onToggle}>
        <div
          className={styles.content}
          onClick={(e) => {
            e.stopPropagation()
          }}>
          <div className={styles.title}>
            <h2>為活動評分</h2>
          </div>
          <form>
            <div className={styles.commentContainer}>
              {partyComment.id !== 0 && (
                <CommentContainer
                  commentValue={partyComment.comment}
                  result={partyComment}
                  dispatchComment={(comment: string) =>
                    dispatch(updatePartyRoomComment(comment))
                  }
                  dispatchRedux={(rating: number) =>
                    dispatch(updatePartyRoomRating(rating))
                  }
                />
              )}
              {foodComment.length > 0 &&
                foodComment.map((item) => (
                  <CommentContainer
                    commentValue={item.comment}
                    key={item.id}
                    result={item}
                    dispatchComment={(comment: string) =>
                      dispatch(updateFoodComment(item.id, comment))
                    }
                    dispatchRedux={(rating: number) =>
                      dispatch(updateFoodRating(item.id, rating))
                    }
                  />
                ))}
              {alcoholComment.length > 0 &&
                alcoholComment.map((item) => (
                  <CommentContainer
                    commentValue={item.comment}
                    key={item.id}
                    result={item}
                    dispatchComment={(comment: string) =>
                      dispatch(updateAlcoholComment(item.id, comment))
                    }
                    dispatchRedux={(rating: number) =>
                      dispatch(updateAlcoholRating(item.id, rating))
                    }
                  />
                ))}
            </div>
          </form>
          <div
            className={styles.btn}
            >
            <Button onClick={(e) => {
              e.preventDefault()
              dispatch(updateComment())
              props.onToggle()
            }}>Save</Button>
          </div>
        </div>
      </div>
    </>
  )
}
