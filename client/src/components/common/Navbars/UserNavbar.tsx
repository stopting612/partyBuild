import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { logout } from 'redux/auth/action'
import { RootState } from 'store'
import UserIcon from '../UserIcon/UserIcon'
import styles from './UserNavbar.module.css'

export default function UserNavbar() {
  const dispatch = useDispatch()
  const accountType = useSelector((state: RootState) => state.auth.type)

  return (
    <div className={styles.navbar}>
      <div className={styles.userIcon}>
        <UserIcon userPanel={true} />
      </div>
      <div className={styles.navListContainer}>
        <ul className={styles.navList}>
          {accountType === 'user' && (
            <>
              <li>
                <NavLink
                  to='/user/my-party'
                  activeStyle={{
                    borderRight: '5px solid var(--color-text-main)'
                  }}>
                  我的Party
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/user/party-history'
                  activeStyle={{
                    borderRight: '5px solid var(--color-text-main)'
                  }}>
                  訂單紀錄
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/user/like/party-room'
                  activeStyle={{
                    borderRight: '5px solid var(--color-text-main)'
                  }}
                  isActive={(match, location) => {
                    return (
                      location.pathname === '/user/like/party-room' ||
                      location.pathname === '/user/like/beverage-list' ||
                      location.pathname === '/user/like/food-list'
                    )
                  }}>
                  我的收藏
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink
              to='/user/settings'
              activeStyle={{ borderRight: '5px solid var(--color-text-main)' }}>
              設定
            </NavLink>
          </li>
          <li>
            <NavLink to='/' onClick={() => dispatch(logout())}>
              登出
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}
