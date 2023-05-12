import React from 'react'
import WhatsAppIcon from '../../../assets/WhatsAppIcon'
import Button from '../Button/Button'
import styles from './ShopIcon.module.css'
import defaultImg from 'assets/logo02.png'

export default function ShopIcon(props: {
  image: string | null
  phoneNumber?: number | null
  createLike: () => void
}) {
  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src={
          props.image !== 'http://cdn.partybuildhk.com/undefined'
            ? props.image!
            : defaultImg
        }
      />
      <div className={styles.buttons}>
        <Button
          backgroundColor='#FFF'
          color='#000'
          onClick={() => window.open(`https://wa.me/852${props.phoneNumber}`)}>
          <WhatsAppIcon height='15px' />
          <span>WhatsApp 聯絡店主</span>
        </Button>
        <Button onClick={props.createLike}>收藏</Button>
      </div>
    </div>
  )
}
