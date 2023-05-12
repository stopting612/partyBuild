import React, { useEffect, useState } from 'react'
import styles from './EditCalcutor.module.css'
import NumberInput from 'components/common/NumberInput/NumberInput'
import DeleteIcon from 'components/common/DeteleIcon/deleteIcon'
import { Option } from 'redux/OrderDetails/state'
import { useDispatch } from 'react-redux'
import { updateCalculatorOption } from 'redux/OrderDetails/action'

export interface IEditCalcutor {
  id: number
  name: string
  price: number
  numberOfPeople: number
  onDelete: () => void
}

export function EditCalcutor({
  name,
  price,
  numberOfPeople,
  id,
  onDelete
}: IEditCalcutor) {
  const [person, setPerson] = useState(0)
  const [priceChange, setPrice] = useState(0)
  const dispatch = useDispatch()

  const data: Option = {
    id: id,
    name: name,
    price: priceChange,
    numberOfPeople: person,
    status: false
  }

  useEffect(() => {
    if (!numberOfPeople) return
    setPerson(numberOfPeople)
  }, [numberOfPeople])

  useEffect(() => {
    if (!price) return
    setPrice(price)
  }, [price])

  useEffect(() => {
    dispatch(updateCalculatorOption(data))
  }, [person, priceChange])

  return (
    <div className={styles.partyRoomCounter}>
      <div className={styles.partyRoomname}>{name}</div>
      <div className={styles.partyRoomPrice}>
        <input
          type='number '
          value={priceChange}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <div className={styles.partyRoomPerson}>
        <NumberInput
          id='1'
          name='123'
          value={person}
          onChange={(e) => setPerson(Number(e.target.value))}
          increment={() => setPerson((person) => person + 1)}
          decrement={
            person > 1
              ? () => setPerson((person) => person - 1)
              : () => setPerson(1)
          }
        />
      </div>
      <div className='PartyRoomPriceByPerson '>
        {' '}
        $ {(price / person).toFixed(1)}
      </div>
      <div className={styles.deleteButton} onClick={onDelete}>
        <DeleteIcon height={'20px'} color={'#255, 255, 255'} />
      </div>
    </div>
  )
}
