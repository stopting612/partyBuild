import React from 'react'
import styles from './DishCard.module.css'

export default function DishCard({
  dish
}: {
  dish: { name: string; quantity: number; image: string }
}) {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={dish.image} />
      </div>
      <div>{dish.name}</div>
      <div>{dish.quantity}份</div>
    </div>
  )
}
