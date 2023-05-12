import { BeverageCardMini } from 'components/BeverageList/MiniCard'
import { PartyRoomCardMini } from 'components/PartyRoomCard/PartyCardMini'
import { FoodCardMini } from 'components/RestaurantCard/MiniCard'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { newNotification } from 'redux/notifications/action'
import styles from './HotPick.module.css'

interface Menu {
  id: number
  image: string
  name: string
  numberOfRating: string
  avgRating: string
  price: string
  shippingFree: boolean
}

interface PartyRoom {
  id: number
  image: string
  name: string
  numberOfRating: string
  avgRating: string
  price: string
  district: string
}
interface IHomePageRecoomend {
  partyRooms: PartyRoom[]
  menu: Menu
  alcohol: Menu
}

export default function HotPick() {
  const [list, setNewList] = useState<IHomePageRecoomend>()
  const dispatch = useDispatch()
  useEffect(() => {
    async function fetchHotPick() {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/home-recommend`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.massage))
      }
      setNewList(result.data)
    }
    fetchHotPick().catch((e) => {
      console.log(e)
    })
  }, [])

  return (
    <div className={styles.container}>
      <h2>熱門選擇</h2>
      <div className={styles.cardContainer}>
        {list?.partyRooms && list.partyRooms.map((result) => (
          <div key= {result.id}>
          <PartyRoomCardMini key={result.id} result={result} />
          </div>
        ))}
        <div>
        {list?.menu && <FoodCardMini key={list.menu.id} result={list.menu} />
        }
        </div>
        <div>
         {list?.alcohol && <BeverageCardMini key={list.alcohol.id} result={list.alcohol} />}
        </div>
      </div>
    </div>
  )
}
