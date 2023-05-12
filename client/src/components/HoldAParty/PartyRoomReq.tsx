import React from 'react'
import { useLocation } from 'react-router'
import Header from '../common/Header/Header'
import styles from './HoldAParty.module.css'
import { useForm } from 'react-hook-form'
import Button from 'components/common/Button/Button'
import RightArrow from 'assets/RightArrow'
import NumberInput from 'components/common/NumberInput/NumberInput'
import { history, RootState } from 'store'
import InputSelect from 'components/common/InputSelect/InputSelect'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import {
  fetchPartyRoomChoices,
  updatePartyInfo,
  updatePartyRoomReq
} from 'redux/holdAParty/action'
import moment from 'moment'

interface IPartyRoomReq {
  partyRoomPerson: string
  date: string
  startTime: string
  endTime: string
  location: string[]
  facilities: string[]
}

export default function PartyRoomReq() {
  const dispatch = useDispatch()
  const { partyRoomPerson, date, startTime, endTime } = useSelector(
    (state: RootState) => state.holdAParty.partyDetails,
    shallowEqual
  )
  const { location, facilities } = useSelector(
    (state: RootState) => state.holdAParty.partyRequirements,
    shallowEqual
  )
  const districtOptions = useSelector(
    (state: RootState) => state.holdAParty.options.districts
  )
  const facilityOptions = useSelector(
    (state: RootState) => state.holdAParty.options.facilities
  )

  const searchParams = new URLSearchParams(useLocation().search.slice(1))
  const {
    register,
    handleSubmit,
    getValues,
    setValue
  } = useForm<IPartyRoomReq>({
    defaultValues: {
      partyRoomPerson: partyRoomPerson || searchParams.get('person') || '1',
      date: date || searchParams.get('date') || '',
      startTime: startTime ?? '',
      endTime: endTime ?? '',
      location: location,
      facilities: facilities
    }
  })
  const onSubmit = (data: IPartyRoomReq) => {
    dispatch(
      updatePartyInfo({
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime
      })
    )
    dispatch(
      updatePartyRoomReq({
        partyRoomPerson: data.partyRoomPerson,
        location: data.location,
        facilities: data.facilities
      })
    )
    dispatch(fetchPartyRoomChoices())
  }
  const zeroTo23 = Array.from(Array(24).keys())
  const minDate = moment(new Date()).add(3, 'd').format('YYYY-MM-DD')
  return (
    <>
      <div className={styles.container}>
        <Header>場地要求</Header>
        {/* <img src ={photo} /> */}
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputField}>
            <label>幾多人?</label>
            <NumberInput
              name='partyRoomPerson'
              id='partyRoomPerson'
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
            <label>幾時開Party?</label>
            <input
              type='date'
              name='date'
              min={minDate}
              required
              ref={register}
            />
          </div>
          <div className={styles.inputField}>
            <label htmlFor='start'>開始時間</label>
            <InputSelect
              name='startTime'
              register={register}
              options={zeroTo23.map((hour) => `${`0${hour}`.slice(-2)}:00`)}
              required={true}
            />
          </div>
          <div className={styles.inputField}>
            <label htmlFor='end'>結束時間</label>
            <InputSelect
              name='endTime'
              register={register}
              options={zeroTo23.map((hour) => `${`0${hour}`.slice(-2)}:00`)}
              required={true}
            />
          </div>
          <div className={styles.optionsField}>
            <legend>邊區好?</legend>
            <div className={styles.options}>
              {districtOptions.map((districtOption) => (
                <div key={districtOption.id}>
                  <input
                    type='checkbox'
                    id={districtOption.name}
                    name='location'
                    value={districtOption.id}
                    ref={register}
                  />
                  <label htmlFor={districtOption.name}>
                    {districtOption.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.optionsField}>
            <legend>要咩設施?</legend>
            <div className={styles.options}>
              {facilityOptions.map((facilityOption) => (
                <div key={facilityOption.id}>
                  <input
                    type='checkbox'
                    id={facilityOption.type}
                    name='facilities'
                    value={facilityOption.id}
                    ref={register}
                  />
                  <label htmlFor={facilityOption.type}>
                    {facilityOption.type}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.buttonsContainer}>
            <button
              type='button'
              className={styles.skipButton}
              onClick={() => history.push('/hold-a-party/food')}>
              之後再揀場地
            </button>
            <Button type='submit'>
              <span>揀場地</span>
              <RightArrow />
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
