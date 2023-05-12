import UserNavbar from 'components/common/Navbars/UserNavbar'
import { UserRoute } from 'components/PrivateRoute/UserRoute'
import MyParty from 'pages/User/MyParty/MyParty'
import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { RootState } from 'store'
import { Like } from './Like/Like'
import PartyHistory from './PartyHistory/PartyHistory'
import Settings from './Settings/Settings'
import styles from './User.module.css'

export default function User() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated)
  if (!isAuth) {
    return <Redirect to='/' />
  }
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.navbar}>
          <UserNavbar />
        </div>
        <div className={styles.content}>
          <Switch>
            <Route path='/user/settings'>
              <Settings />
            </Route>
            <UserRoute>
              <Switch>
                <Route path='/user/my-party'>
                  <MyParty />
                </Route>
                <Route path='/user/party-history'>
                  <PartyHistory />
                </Route>
                <Route path='/user/like'>
                  <Like />
                </Route>
                <Route>
                  <Redirect to='/user/settings' />
                </Route>
              </Switch>
            </UserRoute>
            <Route>
              <Redirect to='/user/settings' />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}
