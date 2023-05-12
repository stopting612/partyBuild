import Button from 'components/common/Button/Button'
import Header from 'components/common/Header/Header'
import InputSelect from 'components/common/InputSelect/InputSelect'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editOpenTime, loadErrorMessage, resetErrorMessage } from 'redux/Business/action'
import { OpenTime } from 'redux/Business/state'
import { RootState } from 'store'
import styles from './BusinessEditSlot.module.css'

export interface Timeslot {
  date: string
  startTime: string
  endTime: string
}

export default function BusinessEditSlot(props: {
  editSlot: OpenTime
  onClick: () => void
}) {
  const dispatch = useDispatch()
  const minDate = moment(new Date()).add(3, 'd').format('YYYY-MM-DD')
  const [timeslot, setTimeslot] = useState<OpenTime>({
    id: props.editSlot.id,
    date: moment(props.editSlot.date)
      .format('YYYY-MM-DD'),
    startTime: moment(props.editSlot.startTime)
    .format('HH:mm'),
    endTime: moment(props.editSlot.endTime)
    .format('HH:mm'),
    isBook: props.editSlot.isBook
  })
  const errorMessage = useSelector(
    (state: RootState) => state.business.errorMessage
  )
  const zeroTo23 = Array.from(Array(24).keys())

  const onSubmit = () => {
    if (timeslot.isBook) {
      return
    }
    if (
      (timeslot.startTime || timeslot.endTime) &&
      (!timeslot.date || !timeslot.startTime || !timeslot.endTime)
    ) {
      return dispatch(loadErrorMessage('請填寫完整日期時段'))
    }
    dispatch(editOpenTime(timeslot, props.onClick))
  }

  useEffect(() => {
    return () => {
      dispatch(resetErrorMessage())
    }
  }, [])

  return (
    <div className={styles.background} onClick={props.onClick}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <Header>修改時段</Header>
        <div className={styles.header}>
          <span>日期</span>
          <span>時段開始</span>
          <span>時段結束</span>
        </div>
        <div className={styles.content}>
          <input
            type='date'
            name='date'
            value={timeslot.date}
            min={minDate}
            required
            onChange={(e) => setTimeslot({ ...timeslot, date: e.target.value })}
          />
          <InputSelect
            name='startTime'
            register={null}
            options={zeroTo23.map((hour) => `${`0${hour}`.slice(-2)}:00`)}
            value={timeslot.startTime}
            required={true}
            onChange={(e) =>
              setTimeslot({ ...timeslot, startTime: e.target.value })
            }
          />
          <InputSelect
            name='endTime'
            register={null}
            options={zeroTo23.map((hour) => `${`0${hour}`.slice(-2)}:00`)}
            value={timeslot.endTime}
            required={true}
            onChange={(e) =>
              setTimeslot({ ...timeslot, endTime: e.target.value })
            }
          />
        </div>
        <div className={styles.error}>{errorMessage}</div>
        <div className={styles.buttonContainer}>
          <Button onClick={onSubmit}>儲存</Button>
        </div>
      </div>
    </div>
  )
}
