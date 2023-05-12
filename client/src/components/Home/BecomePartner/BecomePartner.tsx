import React from 'react'
import styles from './BecomePartner.module.css'
import photo from '../../../assets/04.jpg'
import { Link } from 'react-router-dom'

export default function BecomePartner() {
  return (
  <Link to = {'/become-copartner'} className={styles.container}>
    <div className={styles.container}>
      <h2>成為店主</h2>
      <img src = {photo}/>
    </div>
    </Link>
  )
}
