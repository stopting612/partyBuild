import React, { useState } from 'react'
import styles from './CreatePartyBar.module.css'
import { history } from 'store'
import Button from 'components/common/Button/Button'
import NumberInput from 'components/common/NumberInput/NumberInput'
import moment from 'moment'

export default function CreatePartyBar() {
  const minDate = moment(new Date()).add(3, 'd').format('YYYY-MM-DD')
  const [person, setPerson] = useState(1)
  const [date, setDate] = useState(minDate)
  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault()
        history.push(`/hold-a-party/party-room?person=${person}&date=${date}`)
      }}>
      <div className={styles.inputContainer}>
        <div className={styles.personInput}>
          <label htmlFor='person'>幾多人?</label>
          <NumberInput
            name='person'
            id='person'
            value={person}
            onChange={(e) => setPerson(Number(e.target.value))}
            increment={() =>
              setPerson((person) => (person < 99 ? person + 1 : person))
            }
            decrement={() =>
              setPerson((person) => (person > 1 ? person - 1 : 1))
            }
          />
        </div>
        <div className={styles.dateInput}>
          <label htmlFor='party-date'>幾時開Party?</label>
          <input
            type='date'
            name='party-date'
            id='party-date'
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button type='submit'>我要開Party</Button>
      </div>
    </form>
  )
}
