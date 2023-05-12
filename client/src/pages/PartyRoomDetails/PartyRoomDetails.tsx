import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchPartyRoomDetails,
  resetPartyRoomDetails
} from 'redux/partyRoomDetails/action'
import { useParams } from 'react-router-dom'
import AddToCartForm from '../../components/PartyRoomDetails/AddToCartForm/AddToCartForm'
import PartyRoomFacility from '../../components/PartyRoomDetails/PartyRoomFacility/PartyRoomFacility'
import PartyRoomHeader from '../../components/PartyRoomDetails/PartyRoomHeader/PartyRoomHeader'
import ShopIcon from '../../components/common/ShopIcon/ShopIcon'
import PartyRoomIntro from '../../components/PartyRoomDetails/PartyRoomIntro/PartyRoomIntro'
import PartyRoomNotice from '../../components/PartyRoomDetails/PartyRoomNotice/PartyRoomNotice'
import PartyRoomPrice from '../../components/PartyRoomDetails/PartyRoomPrice/PartyRoomPrice'
import styles from '../styles/ShopDetails.module.css'
import CommentList from '../../components/comment/CommentList'
import FacilityDetails from 'components/PartyRoomDetails/FacilityDetails/FacilityDetails'
import GoogleMap from 'components/PartyRoomDetails/GoogleMap/GoogleMap'
import { history, RootState } from 'store'
import { fetchComments, resetComments } from 'redux/comment/action'
import { createPartyRoomLike } from 'redux/PartyRoomList/action'

export default function PartyRoomDetails(props: {
  showCart?: boolean
  id?: number
}) {
  const id = useParams<{ id: string }>().id ?? props.id
  const dispatch = useDispatch()
  const [facilityToggle, setFacilityToggle] = useState(false)
  const partyRoomImage = useSelector(
    (state: RootState) => state.partyRoomDetails.image
  )
  const phoneNumber = useSelector(
    (state: RootState) => state.partyRoomDetails.phoneNumber
  )
  const address = useSelector(
    (state: RootState) => state.partyRoomDetails.address
  )
  const commentPage = useSelector((state: RootState) => state.comments.page)

  useEffect(() => {
    if (isNaN(Number(id))) {
      history.push('/party-room')
    } else {
      dispatch(fetchPartyRoomDetails(Number(id)))
      dispatch(fetchComments('partyRoom', Number(id)))
    }
    return () => {
      dispatch(resetPartyRoomDetails())
      dispatch(resetComments())
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.section}>
          <div>
            <ShopIcon
              createLike={() => {
                dispatch(createPartyRoomLike(Number(id)))
              }}
              image={partyRoomImage}
              phoneNumber={phoneNumber}
            />
          </div>
          <div>
            <PartyRoomHeader />
            {props.showCart && <AddToCartForm id={Number(id)} />}
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <PartyRoomIntro />
        {address && <GoogleMap address={address} />}
      </div>
      <div className={styles.section}>
        <PartyRoomFacility
          onToggle={() => {
            setFacilityToggle(!facilityToggle)
          }}
        />
        {facilityToggle && (
          <FacilityDetails
            onToggle={() => {
              setFacilityToggle(!facilityToggle)
            }}
          />
        )}
      </div>
      <div className={styles.section}>
        <PartyRoomPrice />
      </div>
      <div className={styles.section}>
        <PartyRoomNotice />
      </div>
      <div className={styles.section}>
        <CommentList
          loadMoreComment={() =>
            dispatch(fetchComments('partyRoom', Number(id), commentPage))
          }
        />
      </div>
    </div>
  )
}

PartyRoomDetails.defaultProps = {
  showCart: true
}
