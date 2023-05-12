import React from 'react'
import styles from './Header.module.css'

export default function Header(props: { children: string }) {
  return (
    <div className={styles.container}>
      <h2>{props.children}</h2>
    </div>
  )
}
