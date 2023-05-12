import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import styles from './FoodHeader.module.css'

export default function FoodHeader() {
  const [
    name,
    restaurant,
    minNumberOfPeople,
    maxNumberOfPeople,
    price
  ] = useSelector((state: RootState) => [
    state.foodDetails.name,
    state.foodDetails.restaurant,
    state.foodDetails.minNumberOfPeople,
    state.foodDetails.maxNumberOfPeople,
    state.foodDetails.price
  ])
  return (
    <div className={styles.container}>
      <Helmet>
        <title>{name} | Party Build</title>
      </Helmet>
      <h3 className={styles.name}>{name}</h3>
      <div>由{restaurant}提供</div>
      <div className={styles.subtitle}>
        ☑️ <span>持牌食物製造廠 Licensed Food Factory</span>
      </div>
      <div className={styles.price}>${price}/份</div>
      <div className={styles.info}>
        適合{minNumberOfPeople}至{maxNumberOfPeople}人
      </div>
    </div>
  )
}
