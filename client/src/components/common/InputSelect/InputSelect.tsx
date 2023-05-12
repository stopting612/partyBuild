import { ChangeEvent } from 'react'
import styles from './InputSelect.module.css'

export default function InputSelect(props: {
  name: string
  register: any
  options: any[]
  value?: any
  required?: boolean
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <select
      name={props.name}
      required={props.required}
      ref={props.register}
      value={props.value}
      className={styles.select}
      onChange={props.onChange}
      disabled={props.disabled}>
      {props.options.map((value) =>
        value.value
? (
          <option key={value.id} value={value.id}>
            {value.value}
          </option>
        )
: (
          <option key={value} value={value}>
            {value}
          </option>
        )
      )}
    </select>
  )
}
