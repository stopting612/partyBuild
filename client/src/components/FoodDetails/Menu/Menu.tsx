import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import DishCard from '../DishCard/DishCard'
import styles from './Menu.module.css'

export default function Menu() {
  const dishes = useSelector((state: RootState) => state.foodDetails.foods)
  return (
    <div>
      <h3>套餐包括以下食物</h3>
      <div className={styles.cardContainer}>
        {dishes.map((dish, index) => (
          <DishCard dish={dish} key={index} />
        ))}
      </div>
    </div>
  )
}
