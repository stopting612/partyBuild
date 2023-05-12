import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserIcon } from 'redux/auth/action'
import { RootState } from 'store'
import styles from './UserIcon.module.css'
import dummy from 'assets/logo01.png'

export default function UserIcon(props: { userPanel?: boolean }) {
  const dispatch = useDispatch()
  const name = useSelector((state: RootState) => state.auth.name)
  const profilePic = useSelector((state: RootState) => state.auth.profilePic)
  useEffect(() => {
    dispatch(fetchUserIcon())
  }, [])
  return (
    <div
      className={
        props.userPanel
          ? `${styles.container} ${styles.userPanel}`
          : styles.container
      }>
      <div
        className={
          props.userPanel
            ? `${styles.image} ${styles.userPanelImage}`
            : styles.image
        }>
        <img
          src={
            profilePic
              ? `${process.env.REACT_APP_CDN_HOSTNAME}/${profilePic}`
              : dummy
          }
        />
      </div>
      <div
        className={
          props.userPanel ? `${styles.name} ${styles.userPanel}` : styles.name
        }>
        {name}
      </div>
    </div>
  )
}
