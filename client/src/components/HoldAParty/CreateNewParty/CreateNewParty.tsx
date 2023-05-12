import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createNewParty } from 'redux/holdAParty/action'
import Button from '../../common/Button/Button'
import styles from './CreateNewParty.module.css'

export default function CreateNewParty() {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  return (
    <div className={styles.container} onClick={(e) => e.stopPropagation()}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          dispatch(createNewParty(name))
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
