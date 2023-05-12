import { FaStar } from 'react-icons/fa'
import styles from 'components/common/CommentContainer/CommentContainer.module.css'
import { useState } from 'react'
import { Comment } from 'redux/EditComment/reducer'

interface IcommentContainer {
  dispatchRedux: (rating: number, id?: number) => void
  result: Comment
  dispatchComment: (comment: string, id?: number) => void
  commentValue: string
}

export function CommentContainer({
  dispatchRedux,
  result,
  dispatchComment,
  commentValue
}: IcommentContainer) {
  const [hover, setHover] = useState(0)
  return (
    <>
      <div className={styles.partyComment}>
        <div className={styles.name}>
          <h3>活動: {result.name}</h3>
        </div>
        <div className={styles.starContainer}>
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1
            return (
              <label key={index}>
                <input
                  type='radio'
                  name='rating'
                  value={ratingValue}
                  onClick={() => dispatchRedux(ratingValue)}
                />
                <FaStar
                  className={styles.star}
                  color={
                    ratingValue <= Math.max(result.rating, hover)
                      ? '#ffc107'
                      : '#e4e5e9'
                  }
                  size={30}
                  onMouseEnter={() => {
                    setHover(ratingValue)
                  }}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            )
          })}
        </div>
        <p>按一下評分</p>
        <div className={styles.commentTxt}>
          <div className={styles.group}>
            <label>
              <textarea
                name='text'
                rows={5}
                placeholder='comment'
                value={commentValue}
                onChange={(e) => dispatchComment(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
