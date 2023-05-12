import CrossIcon from 'assets/CrossIcon'
import Button from 'components/common/Button/Button'
import NumberInput from 'components/common/NumberInput/NumberInput'
import styles from 'pages/FoodList/MoreFoodFilter.module.css'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFoodFilterOption } from 'redux/FoodList/action'
import { fetchOptions } from 'redux/holdAParty/action'
import { RootState } from 'store'

interface IFoodListFilter {
  cuisine: [],
  'people-number': number
}

export function MoreFoodFilter(props: { onToggle: () => void, onClose: () => void }) {
  const dispatch = useDispatch()
  const cuisineOptions = useSelector(
    (state: RootState) => state.holdAParty.options.cuisine
  )
  const { register, handleSubmit, getValues, setValue } = useForm<IFoodListFilter>({
    defaultValues: {
      cuisine: [],
      'people-number': 1
    }
  })

  const onSubmit = (data: IFoodListFilter) => {
    dispatch(fetchFoodFilterOption(data))
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
          <div className={styles.inputField}>
          <label>幾多人食野?</label>
          <NumberInput
            name='people-number'
            id='foodPerson'
            register={register}
            increment={(name) => setValue(name, Number(getValues(name)) + 1)}
            decrement={(name) =>
              Number(getValues(name)) > 1
                ? setValue(name, Number(getValues(name)) - 1)
                : null
            }
          />
        </div>
          <div className={styles.facility}>
            <h4>菜式</h4>
            <div className={styles.checkboxContainer}>
            {cuisineOptions.map((cuisineOptions) => (
              <div key={cuisineOptions.type}>
                <div className={styles.checkboxEach}>
                <input
                  type='checkbox'
                  id={cuisineOptions.type}
                  name='cuisine'
                  value={cuisineOptions.id}
                  ref={register}
                />
                <label htmlFor={cuisineOptions.type}>{cuisineOptions.type}</label>
              </div>
              </div>
            ))}
            </div>
          </div>
          <div className= {styles.button}><Button>搜尋</Button></div>
          <div className={styles.closeButton} onClick={props.onToggle}>
          <CrossIcon height='20px' />
        </div>
        </div>
      </form>
    </div>
  )
}
