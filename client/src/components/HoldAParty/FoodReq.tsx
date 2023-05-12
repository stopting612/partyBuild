import React from 'react'
import Header from '../common/Header/Header'
import styles from './HoldAParty.module.css'
import NumberInput from 'components/common/NumberInput/NumberInput'
import Button from 'components/common/Button/Button'
import RightArrow from 'assets/RightArrow'
import { history, RootState } from 'store'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { fetchFoodChoices, updateFoodReq } from 'redux/holdAParty/action'

interface IFoodReq {
  foodPerson: string
  cuisine: string[]
}

export default function FoodReq() {
  const dispatch = useDispatch()
  const cuisineOptions = useSelector(
    (state: RootState) => state.holdAParty.options.cuisine
  )
  const foodPerson = useSelector(
    (state: RootState) => state.holdAParty.partyDetails.foodPerson
  )
  const cuisine = useSelector(
    (state: RootState) => state.holdAParty.partyRequirements.cuisine
  )
  const { register, handleSubmit, getValues, setValue } = useForm<IFoodReq>({
    defaultValues: {
      foodPerson: foodPerson || '1',
      cuisine: cuisine
    }
  })

  const onSubmit = (data: IFoodReq) => {
    dispatch(updateFoodReq(data))
    dispatch(fetchFoodChoices())
  }

  return (
    <div className={styles.container}>
      <Header>到會要求</Header>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputField}>
          <label>幾多人食野?</label>
          <NumberInput
            name='foodPerson'
            id='foodPerson'
            max={99}
            register={register}
            increment={(person) =>
              Number(getValues(person)) < 99
                ? setValue('foodPerson', Number(getValues(person)) + 1)
                : setValue('foodPerson', 99)
            }
            decrement={(person) =>
              Number(getValues(person)) > 1
                ? setValue('foodPerson', Number(getValues(person)) - 1)
                : null
            }
          />
        </div>
        <div className={styles.optionsField}>
          <legend>要咩菜式?</legend>
          <div className={styles.options}>
            {cuisineOptions.map((cuisineOption) => (
              <div key={cuisineOption.type}>
                <input
                  type='checkbox'
                  id={cuisineOption.type}
                  name='cuisine'
                  value={cuisineOption.id}
                  ref={register}
                />
                <label htmlFor={cuisineOption.type}>{cuisineOption.type}</label>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <button
            type='button'
            className={styles.skipButton}
            onClick={() => history.push('/hold-a-party/beverage')}>
            之後再揀到會
          </button>
          <Button type='submit'>
            <span>揀到會</span>
            <RightArrow />
          </Button>
        </div>
      </form>
    </div>
  )
}
