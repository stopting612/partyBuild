import ChoosePartyToAdd from 'components/PartyRoomDetails/ChoosePartyToAdd/ChoosePartyToAdd'
import InputSelect from 'components/common/InputSelect/InputSelect'
import NumberInput from 'components/common/NumberInput/NumberInput'
import { useCallback, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  addToCartToggle,
  fetchPartyRoomPrice
} from 'redux/partyRoomDetails/action'
import { history, RootState } from 'store'
import Button from '../../common/Button/Button'
import styles from './AddToCartForm.module.css'
import moment from 'moment'
import _ from 'lodash'

export interface IPartyRoomCart {
  partyRoomPerson: string
  date: Date | null
  startTime: string | null
  endTime: string | null
  partyID: number | null
}

export default function AddToCartForm(props: { id: number }) {
  const dispatch = useDispatch()
  const toggle = useSelector(
    (state: RootState) => state.partyRoomDetails.addToCartPopUp
  )
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated)
  const type = useSelector((state: RootState) => state.auth.type)
  const orderPrice = useSelector(
    (state: RootState) => state.partyRoomDetails.orderPrice
  )
  const minDate = moment(new Date()).add(3, 'd').format('YYYY-MM-DD')
  const { register, handleSubmit, setValue, getValues, control } =
    useForm<IPartyRoomCart>({
      mode: 'onChange',
      defaultValues: {
        partyRoomPerson: '1',
        date: minDate,
        startTime: null,
        endTime: null
      }
    })
  register('partyID')
  const watch = useWatch({ control })

  const callback = useCallback(
    _.debounce((watch) => {
      dispatch(
        fetchPartyRoomPrice(
          props.id,
          watch.date,
          watch.startTime,
          watch.endTime,
          watch.partyRoomPerson
        )
      )
    }, 500),
    []
  )
  useEffect(() => {
    if (
      watch.partyRoomPerson > 0 &&
      watch.date &&
      watch.startTime &&
      watch.endTime
    ) {
      callback(watch)
    }
  }, [watch.partyRoomPerson, watch.date, watch.startTime, watch.endTime])

  const zeroTo23 = Array.from(Array(24).keys())
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
          <label>人數</label>
          <NumberInput
            name='partyRoomPerson'
            id='partyRoomPerson'
            buttonColor='#FFF'
            max={99}
            register={register}
            increment={(person) =>
              Number(getValues(person)) < 99
                ? setValue('partyRoomPerson', Number(getValues(person)) + 1)
                : setValue('partyRoomPerson', 99)
            }
            decrement={(person) =>
              Number(getValues(person)) > 1
                ? setValue('partyRoomPerson', Number(getValues(person)) - 1)
                : null
            }
          />
        </div>
        <div className={styles.inputField}>
          <label>日期</label>
          <input
            type='date'
            name='date'
            min={minDate}
            required
            ref={register}
          />
        </div>
        <div className={styles.inputField}>
          <label>開始時間</label>
          <InputSelect
            name='startTime'
            register={register}
            options={zeroTo23.map((hour) => `${`0${hour}`.slice(-2)}:00`)}
            required={true}
          />
        </div>
        <div className={styles.inputField}>
          <label>結束時間</label>
          <InputSelect
            name='endTime'
            register={register}
            options={zeroTo23.map((hour) => `${`0${hour}`.slice(-2)}:00`)}
            required={true}
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
