import React from 'react'
import styles from '../styles/ColorTheme.module.css'

export default function ColorTheme() {
  return (
    <div className={styles.container}>
      <div className={styles.textMain}>
        <span>--color-text-main (#61dafb)</span>
      </div>
      <div className={styles.backgroundMain}>
        <span>--color-background-main (#282c34)</span>
      </div>
      <div className={styles.backgroundSecondary}>
        <span>--color-background-secondary (#20232a)</span>
      </div>
      <div className={styles.commentText}>
        <span>--color-comment</span>
      </div>
      <div className={styles.hover}>
        <span>--color-hover</span>
      </div>
      <div className={styles.price}>
        <span>--color-price</span>
      </div>
    </div>
  )
}
