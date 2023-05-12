import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewParty } from 'redux/partyRoomDetails/action'
import { RootState } from 'store'
import Button from '../../common/Button/Button'
import styles from './CreateNewParty.module.css'

export default function CreateNewParty(props: { handleSubmit: any }) {
  const dispatch = useDispatch()
  const partyRoomID = useSelector((state:RootState) => state.partyRoomDetails.id)
  const [name, setName] = useState('')
  const onSubmit = (data: any) => {
    dispatch(createNewParty(name, partyRoomID!, data))
  }
  return (
    <div className={styles.container} onClick={(e) => e.stopPropagation()}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          props.handleSubmit(onSubmit)()
        }}>
        <div className={styles.input}>
          <label>命名你的Party</label>
          <input
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            pattern=".*\S+.*"
          />
        </div>
        <div>
          <Button type='submit'>我要開Party</Button>
        </div>
      </form>
    </div>
  )
}
