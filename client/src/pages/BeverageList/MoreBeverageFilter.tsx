import CrossIcon from 'assets/CrossIcon'
import Button from 'components/common/Button/Button'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBeverageOption } from 'redux/BeverageList/action'
import { fetchOptions } from 'redux/holdAParty/action'
import { RootState } from 'store'
import styles from './MoreBeverageFilter.module.css'

interface IBeverageFilter {
  type: []
}

export function MoreBeverageFilter(props: {
  onToggle: () => void
  onClose: () => void
}) {
  const dispatch = useDispatch()

  const { register, handleSubmit } = useForm<IBeverageFilter>({
    defaultValues: {
      type: []
    }
  })
  const beverageTypes = useSelector(
    (state: RootState) => state.holdAParty.options.beverageTypes
  )
  const onSubmit = (data: IBeverageFilter) => {
    dispatch(fetchBeverageOption(data))
    props.onClose()
  }
  useEffect(() => {
    dispatch(fetchOptions())
  }, [])
  return (
    <div className={styles.container} onClick={props.onClose}>
      <form onSubmit={handleSubmit(onSubmit)} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <div className={styles.title}>
            <h3>更多篩選條件</h3>
          </div>
          <div className={styles.district}>
            <h4>地區</h4>
            <div className={styles.checkboxContainer}>
              {beverageTypes.map((beverageType) => (
                <div key={beverageType.name}>
                  <input
                    type='checkbox'
                    id={beverageType.name}
                    name='type'
                    value={beverageType.id}
                    ref={register}
                  />
                  <label htmlFor={beverageType.name}>{beverageType.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.button}>
            <Button>搜尋</Button>
          </div>
          <div className={styles.closeButton} onClick={props.onToggle}>
            <CrossIcon height='20px' />
          </div>
        </div>
      </form>
    </div>
  )
}
