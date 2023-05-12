import React, { ChangeEvent } from 'react'
import InputSelect from 'components/common/InputSelect/InputSelect'
import moment from 'moment'

interface IEditTime {
  time: string
  dispatchTime: (date: string) => void
}

export function EditTime({ time, dispatchTime }: IEditTime) {
  const changeTime = (e:ChangeEvent<HTMLSelectElement>) => {
    const startTime = Number(e.target.value.split(':')[0])
    const newDate = new Date()
    newDate.setUTCHours(startTime - 8)
    newDate.setMinutes(0)
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)
    dispatchTime(newDate.toISOString())
    }
    const zeroTo23 = Array.from(Array(24).keys())
  return (
  //   <DatePicker
  //   selected={new Date(time)}
  //   onChange={changetime}
  //   showTimeSelect
  //   showTimeSelectOnly
  //   timeIntervals={60}
  //   timeCaption="Time"
  //   dateFormat="hh:mm"
  // />
  <InputSelect
            name='startTime'
            register={null}
            onChange={changeTime}
            options={zeroTo23.map((hour) => `${`0${hour}`.slice(-2)}:00`)}
            required={true}
            value= {moment(time).format('HH:mm')}
          />
  )
}
