import React from 'react'
import styles from './MainImage.module.css'
import { useWindowSize } from '../../../utils/useWindowSize'
import photo from '../../../assets/mainphoto.jpg'
import smallPhoto from '../../../assets/smallMainPhoto.jpeg'

export default function MainImage() {
  const [windowWidth] = useWindowSize()
  return (
    <div className={styles.mainImage}>
      {windowWidth >= 800 && (
        <img src= {photo} />
      )}
      {windowWidth < 800 && (
        <img src= {smallPhoto} />
      )}
    </div>
  )
}
