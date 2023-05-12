import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import styles from './BeverageHeader.module.css'

export default function BeverageHeader() {
  const [
    name,
    alcoholsSupplier,
    pack,
    averagePrice,
    price
  ] = useSelector((state: RootState) => [
    state.beverageDetails.name,
    state.beverageDetails.alcoholsSupplier,
    state.beverageDetails.pack,
    state.beverageDetails.averagePrice,
    state.beverageDetails.price
  ])
  return (
    <div className={styles.container}>
      <Helmet>
        <title>{name} | Party Build</title>
      </Helmet>
      <h3 className={styles.name}>{name}</h3>
      <div>{pack}</div>
      <div>由{alcoholsSupplier}提供</div>
      <div className={styles.price}>${price}</div>
      <div className={styles.subtitle}>
        <span>平均${averagePrice}/支</span>
      </div>
    </div>
  )
}
