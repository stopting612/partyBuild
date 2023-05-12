import logo from '../../../assets/logo02.png'
import styles from './Logo.module.css'

export default function Logo() {
  return (
    <div className={styles.logo}>
      <img src={logo} alt='logo' />
      <span>Party Build</span>
    </div>
  )
}
