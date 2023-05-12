import Button from 'components/common/Button/Button'
import Header from 'components/common/Header/Header'
import InputSelect from 'components/common/InputSelect/InputSelect'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addOpenTime,
  loadErrorMessage,
  resetErrorMessage
} from 'redux/Business/action'
import { RootState } from 'store'
import styles from './BusinessAddSlot.module.css'

export interface Timeslot {
  date: string
  startTime: string
  endTime: string
}

export default function BusinessAddSlot(props: { onClick: () => void }) {
  const dispatch = useDispatch()
  const minDate = moment(new Date()).add(3, 'd').format('YYYY-MM-DD')
  const timeslot5 = [
    { date: '', startTime: '', endTime: '' },
    { date: '', startTime: '', endTime: '' },
    { date: '', startTime: '', endTime: '' },
    { date: '', startTime: '', endTime: '' },
    { date: '', startTime: '', endTime: '' }
  ]
  const [timeslots, setTimeslots] = useState<Timeslot[]>(timeslot5)
  const errorMessage = useSelector(
    (state: RootState) => state.business.errorMessage
  )
  const zeroTo23 = Array.from(Array(24).keys())

  const onSubmit = () => {
    for (const timeslot of timeslots) {
      if (
        (timeslot.startTime || timeslot.endTime) &&
        (!timeslot.date || !timeslot.startTime || !timeslot.endTime)
      ) {
        return dispatch(loadErrorMessage('請填寫完整日期時段'))
      }
    }
    dispatch(addOpenTime(timeslots, props.onClick))
  }

  useEffect(() => {
    return () => {
      dispatch(resetErrorMessage())
    }
  }, [])

  return (
    <div className={styles.background} onClick={props.onClick}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <Header>新增時段</Header>
        <div className={styles.header}>
          <span>日期</span>
          <span>時段開始</span>
          <span>時段結束</span>
        </div>
        {timeslots.map((timeslot, index) => (
          <div className={styles.content} key={index}>
            <input
              type='date'
              name='date'
              value={timeslot.date}
              min={minDate}
              required
              onChange={(e) =>
                setTimeslots(
                  timeslots.map((timeslot, i) =>
                    i === index
                      ? { ...timeslot, date: e.target.value }
                      : timeslot
                  )
                )
              }
            />
            <InputSelect
              name='startTime'
              register={null}
              options={([{ id: '', value: '選擇時間' }] as any[]).concat(
                zeroTo23.map((hour) => `${`0${hour}`.slice(-2)}:00`)
              )}
              required={true}
              onChange={(e) =>
                setTimeslots(
                  timeslots.map((timeslot, i) =>
                    i === index
                      ? { ...timeslot, startTime: e.target.value }
                      : timeslot
                  )
                )
              }
            />
            <InputSelect
              name='endTime'
              register={null}
              options={([{ id: 'default', value: '選擇時間' }] as any[]).concat(
                zeroTo23.map((hour) => `${`0${hour}`.slice(-2)}:00`)
              )}
              required={true}
              onChange={(e) =>
                setTimeslots(
                  timeslots.map((timeslot, i) =>
                    i === index
                      ? { ...timeslot, endTime: e.target.value }
                      : timeslot
                  )
                )
              }
            />
          </div>
        ))}
        <div className={styles.moreSlots}>
          <div
            onClick={() =>
              setTimeslots(
                timeslots.concat({ date: '', startTime: '', endTime: '' })
              )
            }>
            新增更多
          </div>
        </div>
        <div className={styles.error}>{errorMessage}</div>
        <div className={styles.buttonContainer}>
          <Button onClick={onSubmit}>儲存</Button>
        </div>
      </div>
    </div>
  )
}
