import styles from 'components/common/WhatsAppButton/WhatsappButton.module.css'
import React from 'react'
import { WhatsappIcon } from '../whatsappIcon'

interface IFilter {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function WhatsappButton({ onClick }: IFilter) {
  return (
    <button className={styles.button} onClick={onClick}>
      <div className={styles.icon}>
        <WhatsappIcon height={'18px'} />
      </div>{' '}
      Whatsapp詳情比朋友
    </button>
  )
}
