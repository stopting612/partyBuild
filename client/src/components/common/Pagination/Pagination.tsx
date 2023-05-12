import React from 'react'
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from 'store'
import InputSelect from '../InputSelect/InputSelect'
import styles from './Pagination.module.css'

export default function Pagination(props: {
  pages: number[]
  fetchHandler: (e: React.ChangeEvent<HTMLSelectElement>) => (dispatch: ThunkDispatch) => void
}) {
  const dispatch = useDispatch()
  return (
    <div className={styles.page}>
      <span>頁數 </span>
      <InputSelect
        name='page'
        register={null}
        options={props.pages}
        onChange={(e) => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
          dispatch(props.fetchHandler(e))
        }}
      />
    </div>
  )
}
