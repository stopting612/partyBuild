import { Helmet } from 'react-helmet'
import BecomePartner from '../../components/Home/BecomePartner/BecomePartner'
import CreatePartyBar from '../../components/Home/CreatePartyBar/CreatePartyBar'
import HotPick from '../../components/Home/HotPick/HotPick'
import MainImage from '../../components/Home/MainImage/MainImage'
import ViewAll from '../../components/Home/ViewAll/ViewAll'
import styles from './Home.module.css'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>輕鬆開Party | Party Build</title>
      </Helmet>
      <section className={styles.mainImageContainer}>
        <div>
          <CreatePartyBar />
          <MainImage />
        </div>
      </section>
      <div className={styles.container}>
        <section>
          <HotPick />
        </section>
        <section>
          <BecomePartner />
        </section>
        <section className={styles.viewAll}>
          <ViewAll />
        </section>
      </div>
    </>
  )
}
