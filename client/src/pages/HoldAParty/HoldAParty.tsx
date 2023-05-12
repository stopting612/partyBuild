import BeverageChoice from 'components/HoldAParty/BeverageChoice'
import BeverageReq from 'components/HoldAParty/BeverageReq'
import FoodChoice from 'components/HoldAParty/FoodChoice'
import FoodReq from 'components/HoldAParty/FoodReq'
import HoldAPartyNav from 'components/HoldAParty/HoldAPartyNav/HoldAPartyNav'
import PartyRoomChoice from 'components/HoldAParty/PartyRoomChoice'
import PartyRoomReq from 'components/HoldAParty/PartyRoomReq'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import { fetchOptions, reset } from 'redux/holdAParty/action'
import styles from './HoldAParty.module.css'

export default function HoldAParty() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchOptions())
    return () => {
      dispatch(reset())
    }
  }, [])

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Helmet>
          <title>我要開Party | Party Build</title>
        </Helmet>
        <HoldAPartyNav />
        <Route path='/hold-a-party/party-room'>
          <PartyRoomReq />
        </Route>
        <Route path='/hold-a-party/party-room-choice'>
          <PartyRoomChoice />
        </Route>
        <Route path='/hold-a-party/food'>
          <FoodReq />
        </Route>
        <Route path='/hold-a-party/food-choice'>
          <FoodChoice />
        </Route>
        <Route path='/hold-a-party/beverage'>
          <BeverageReq />
        </Route>
        <Route path='/hold-a-party/beverage-choice'>
          <BeverageChoice />
        </Route>
        <Route>
          <Redirect to='/hold-a-party/party-room' />
        </Route>
      </div>
    </div>
  )
}
