import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from 'components/common/Navbars/LikePageNavbar.module.css'

export default function LikePageNavbar() {
  return (
    <>
      <div className={styles.navBarContainer}>
        <ul>
          <li>
            <NavLink
              to='/user/like/party-room'
              activeStyle={{
                padding: '7px 0',
                borderBottom: '3px solid var(--color-text-main)'
              }}>
              PartyRoom
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/user/like/food-list'
              activeStyle={{
                padding: '7px 0',
                borderBottom: '3px solid var(--color-text-main)'
              }}>
              到會
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/user/like/beverage-list'
              activeStyle={{
                padding: '7px 0',
                borderBottom: '3px solid var(--color-text-main)'
              }}>
              酒類
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  )
}
