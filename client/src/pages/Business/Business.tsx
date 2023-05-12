import LatestOrder from 'components/Business/LatestOrder'
import Stores from 'components/Business/Stores'
import TodayOrder from 'components/Business/TodayOrder'
import { Helmet } from 'react-helmet'
import styles from './Business.module.css'

export default function Business() {
  return (
    <>
      <Helmet>
        <title>店主總覽 | Party Build</title>
      </Helmet>
      <div className={styles.background}>
        <div className={styles.container}>
          <div>
            <TodayOrder />
            <LatestOrder />
          </div>
          <div>
            <Stores />
            {/* <Data /> */}
          </div>
        </div>
      </div>
    </>
  )
}
