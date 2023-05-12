import _ from 'lodash'
import { useCallback, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  addToCartToggle,
  fetchBeveragePrice
} from 'redux/beverageDetails/action'
import { history, RootState } from 'store'
import Button from '../../common/Button/Button'
import NumberInput from '../../common/NumberInput/NumberInput'
import ChoosePartyToAdd from '../ChoosePartyToAdd/ChoosePartyToAdd'
import styles from './AddToCartForm.module.css'

export interface ICart {
  quantity: number
  partyID: number | null
}

export default function AddToCartForm(props: { id: number }) {
  const dispatch = useDispatch()
  const toggle = useSelector(
    (state: RootState) => state.beverageDetails.addToCartPopUp
  )
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated)
  const type = useSelector((state: RootState) => state.auth.type)
  const orderPrice = useSelector(
    (state: RootState) => state.beverageDetails.orderPrice
  )
  const { register, handleSubmit, setValue, getValues, control } =
    useForm<ICart>({
      defaultValues: {
        quantity: 1
      }
    })
  register('partyID')

  const watch = useWatch({ control })
  const callback = useCallback(
    _.debounce((watch) => {
      dispatch(fetchBeveragePrice(props.id, watch.quantity))
    }, 500),
    []
  )
  useEffect(() => {
    if (watch.quantity > 0) {
      callback(watch)
    }
  }, [watch.quantity])

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          if (isAuth && type === 'user') {
            dispatch(addToCartToggle())
          } else {
            history.push('/login')
          }
        }}>
        <div className={styles.inputField}>
          <label>數量：</label>
          <NumberInput
            name='quantity'
            id='quantity'
            buttonColor='#FFF'
            max={99}
            register={register}
            increment={(person) =>
              Number(getValues(person)) < 99
                ? setValue('quantity', Number(getValues(person)) + 1)
                : setValue('quantity', 99)
            }
            decrement={(person) =>
              Number(getValues(person)) > 1
                ? setValue('quantity', Number(getValues(person)) - 1)
                : null
            }
          />
        </div>
        <div className={styles.addToButtonContainer}>
          <div className={styles.orderPrice}>
            預算價格:${orderPrice ? orderPrice.toFixed(2) : 0}
          </div>
          <Button type='submit'>加入購物車</Button>
        </div>
      </form>
      {toggle && (
        <div
          className={styles.choosePartyToAdd}
          onClick={() => dispatch(addToCartToggle())}>
          <ChoosePartyToAdd setValue={setValue} handleSubmit={handleSubmit} />
        </div>
      )}
    </div>
  )
}
