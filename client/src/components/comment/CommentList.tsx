import Button from 'components/common/Button/Button'
import StartIcon from 'components/common/StarIcon/StarIcon'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import styles from './CommentList.module.css'

export default function CommentList(props: { loadMoreComment?: () => void }) {
  const comments = useSelector((state: RootState) => state.comments)
  return (
    <div>
      <h3>
        {String(comments.numberOfRating) !== '0' ? (
          <>
            <StartIcon addStart={true} height='15px' /> {comments.avgRating}
          </>
        ) : (
          '未有評價'
        )}
        ({comments.numberOfRating ?? 0}則評價)
      </h3>
      {comments.ratings.map((comment) => (
        <div key={comment.id} className={styles.commentContainer}>
          <div className={styles.commentHeader}>
            <span>{comment.name}</span>
            <span>
              <StartIcon addStart={true} height='15px' />{' '}
              {comment.rating.toFixed(2)}
            </span>
            <span>{new Date(comment.ratingDate).toLocaleDateString()}</span>
          </div>
          <p className={styles.comment}>{comment.comment}</p>
        </div>
      ))}
      {comments.ratings.length < (comments.numberOfRating ?? 0) && (
        <Button color='var(--color-text-main)' backgroundColor='var(--color-background-main)' onClick={props.loadMoreComment}>
          更多評價
        </Button>
      )}
    </div>
  )
}
