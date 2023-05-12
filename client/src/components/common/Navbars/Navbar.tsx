import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'
import Logo from '../Logo/Logo'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import UserIcon from '../UserIcon/UserIcon'
import HamburgerIcon from 'assets/HamburgerIcon'

interface NavLinkContent {
  name: string
  path: string
  condition?: boolean
}

export default function Navbar() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const accountType = useSelector((state: RootState) => state.auth.type)
  const [toggle, setToggle] = useState(false)
  const navLinks: NavLinkContent[] = [
    // General Routes
    {
      name: '主頁',
      path: '/',
      condition: !isAuthenticated || accountType === 'user'
    },
    {
      name: 'Party Room一覽',
      path: '/party-room',
      condition: !isAuthenticated || accountType === 'user'
    },
    {
      name: '到會一覽',
      path: '/food',
      condition: !isAuthenticated || accountType === 'user'
    },
    {
      name: '酒類一覽',
      path: '/beverage',
      condition: !isAuthenticated || accountType === 'user'
    },
    {
      name: '我的Party',
      path: '/user/my-party',
      condition: isAuthenticated && accountType === 'user'
    },
    // Business Routes
    { name: '登入 / 註冊', path: '/login', condition: !isAuthenticated },
    {
      name: '總覽',
      path: '/business',
      condition: isAuthenticated && accountType === 'business'
    },
    {
      name: '訂單管理',
      path: '/business/order',
      condition: isAuthenticated && accountType === 'business'
    },
    {
      name: '店舖管理',
      path: '/business/branch',
      condition: isAuthenticated && accountType === 'business'
    },
    {
      name: '數據分析',
      path: '/business/data',
      condition: isAuthenticated && accountType === 'business'
    },
    // Admin Routes
    {
      name: '申請一覽',
      path: '/admin/account-applications',
      condition: isAuthenticated && accountType === 'admin'
    },
    {
      name: '註冊店主',
      path: '/admin/register-business',
      condition: isAuthenticated && accountType === 'admin'
    },
    {
      name: '登記店舖',
      path: '/admin/register-store',
      condition: isAuthenticated && accountType === 'admin'
    },
    {
      name: '修改店舖資料',
      path: '/admin/edit-store',
      condition: isAuthenticated && accountType === 'admin'
    }
  ]

  const createNavLink = (navLink: NavLinkContent) => {
    if (navLink.condition || navLink.condition === undefined) {
      return (
        <li key={navLink.name}>
          <NavLink
            activeStyle={{
              color: 'var(--color-text-main)',
              borderBottom: '2px solid var(--color-text-main)'
            }}
            exact
            to={navLink.path}
            onClick={() => setToggle(false)}>
            {navLink.name}
          </NavLink>
        </li>
      )
    }
  }

  return (
    <div className={styles.navbar}>
      <Link to='/'>
        <Logo />
      </Link>
      <div className={styles.navListContainer}>
        <ul
          className={
            toggle ? styles.navList : `${styles.navList} ${styles.hidden}`
          }>
          {navLinks.map((navLink) => createNavLink(navLink))}
        </ul>
        {isAuthenticated && (
          <div className={styles.userIcon} onClick={() => setToggle(false)}>
            <div>
              {accountType === 'user'
? (
                <NavLink exact to='/user/like/party-room'>
                  <UserIcon />
                </NavLink>
              )
: (
                <NavLink exact to='/user/settings'>
                  <UserIcon />
                </NavLink>
              )}
            </div>
          </div>
        )}
        <div className={styles.hamburger} onClick={() => setToggle(!toggle)}>
          <HamburgerIcon height='25px' />
        </div>
      </div>
    </div>
  )
}
