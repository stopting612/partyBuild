import React, { useEffect } from 'react'
import styles from './Calculator.module.css'
import NumberInput from 'components/common/NumberInput/NumberInput'

interface ICalculatorOfOrderDetail {
  name: string
  price: number
  // numberOfPeople?: number
  dispatchRedux: (person: number) => void
  person: number
}

export function CalculatorOfOrderDetail({
  name,
  price,
  // numberOfPeople,
  dispatchRedux,
  person
}: ICalculatorOfOrderDetail) {
  // const [person, setPerson] = useState(0)

  useEffect(() => {
    if (!person) return
    dispatchRedux(person)
  }, [person])

  // useEffect(() => {
  //   dispatch(person)
  // }, [person])

  return (
    <div className={styles.partyRoomCounter}>
      <div className={styles.name}>{name}</div>
      <div className='partyRoomPrice '>{''}${price}</div>
      <div className={styles.partyRoomPerson}>
        <NumberInput
          id='1'
          name='123'
          value={person ?? 1}
          // onChange={(e) => dispatch(Number(e.target.value))}
          increment={() => dispatchRedux(person + 1) }
          decrement={
            person > 1
              ? () => dispatchRedux(person - 1)
              : () => dispatchRedux(1)
          }
        />
      </div>
      <div className='PartyRoomPriceByPerson '>
        {' '}
        $ {(price / person).toFixed(1)}
      </div>
    </div>
  )
}
