import { useDispatch, useSelector } from 'react-redux'
import ClipLoader from 'react-spinners/ClipLoader'
import { notLoading } from 'redux/loading/action'
import { RootState } from 'store'
import styles from './Loading.module.css'

export default function Loading() {
  const dispatch = useDispatch()
  const loadingState = useSelector((state: RootState) => state.loading)
  return (
    <>
      {loadingState.isLoading && (
        <div className={styles.loading}>
          <ClipLoader color='var(--color-text-main)' />
        </div>
      )}
      {loadingState.error && (
        <div className={styles.error} onClick={() => dispatch(notLoading())}>
          <div
            className={styles.errorContent}
            onClick={(e) => e.stopPropagation()}>
            <span>Something went wrong!</span>
          </div>
        </div>
      )}
    </>
  )
}
