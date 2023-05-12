import React from 'react'
import styles from './Button.module.css'

export default function Button(props: {
  children: React.ReactNode
  color?: string
  backgroundColor?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'submit' | 'button'
  disabled?: boolean
}) {
  return (
    <button
      className={
        props.disabled
          ? `${styles.button} ${styles.disabled}`
          : `${styles.button}`
      }
      onClick={props.onClick}
      type={props.type}
      style={{
        color: `${props.color}`,
        backgroundColor: `${props.backgroundColor}`
      }}
      disabled={props.disabled}>
      <span className={styles.content}>{props.children}</span>
    </button>
  )
}
