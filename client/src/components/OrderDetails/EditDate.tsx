import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { addDays } from 'date-fns'

interface IEditDate {
  startDate: string
  dispatchDate: (date: Date) => void
}

export function EditDate({ startDate: startdate, dispatchDate }: IEditDate) {
  const openTimeList = useSelector((state: RootState) => state.orderDetail.partyRoomOrders?.openTime)
  const changeDate = (date: Date) => {
    dispatchDate(date)
    }

  return (
    <DatePicker
      selected={new Date(startdate)}
      minDate={addDays(new Date(), 3)}
      onChange={changeDate}
      includeDates={openTimeList?.map((i) => new Date(i))}
      withPortal
    />
  )
}
