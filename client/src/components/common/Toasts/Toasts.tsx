import { useSelector } from 'react-redux'
import { RootState } from 'store'
import styles from './Toasts.module.css'

export default function Toasts() {
  const messages = useSelector(
    (state: RootState) => state.notifications.messages
  )
  return (
    <div className={styles.container}>
      {messages.map((message, i) => (
        <div className={styles.message} key={i}>
          <span>{message}</span>
        </div>
      ))}
    </div>
  )
}
