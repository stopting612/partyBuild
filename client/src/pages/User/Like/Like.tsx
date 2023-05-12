import Header from 'components/common/Header/Header'
import LikePageNavbar from 'components/common/Navbars/LikePageNavbar'
import styles from 'pages/User/Like/Like.module.css'
import { AlcoholLikeList } from './AlcoholLike'
import { FoodLikeList } from './FoodLike'
import { PartyRoomLikeList } from './PartyRoomLike'
import React, { useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { fetchGetUserLikeList } from 'redux/User/Like/action'

export function Like() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchGetUserLikeList())
  }, [])
  return (
    <>
      <Helmet>
        <title>我的收藏 | Party Build</title>
      </Helmet>
      <div className={styles.container}>
        <Header>我的收藏</Header>
        <LikePageNavbar />
        <Switch>
          <Route path='/user/like/party-room'>
            <PartyRoomLikeList />
          </Route>
          <Route path='/user/like/food-list'>
            <FoodLikeList />
          </Route>
          <Route path='/user/like/beverage-list'>
            <AlcoholLikeList />
          </Route>
          <Route>
            <Redirect to='/user/like/party-room' />
          </Route>
        </Switch>
      </div>
    </>
  )
}
