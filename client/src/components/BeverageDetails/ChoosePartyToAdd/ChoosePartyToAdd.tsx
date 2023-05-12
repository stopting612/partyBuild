import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToParty } from 'redux/beverageDetails/action'
import { fetchGetMyPartyList } from 'redux/User/Myparty/action'
import { RootState } from 'store'
import { ICart } from '../AddToCartForm/AddToCartForm'
import CreateNewParty from '../CreateNewParty/CreateNewParty'
import styles from './ChoosePartyToAdd.module.css'
import plusImage from 'assets/plus.png'
import defaultImg from 'assets/logo02.png'

export default function ChoosePartyToAdd(props: {
  setValue: any
  handleSubmit: any
}) {
  const dispatch = useDispatch()
  const [toggle, setToggle] = useState(false)
  const beverageID = useSelector((state: RootState) => state.beverageDetails.id)
  const myPartyList = useSelector(
    (state: RootState) => state.myPartyList.shoppingBaskets
  )
  useEffect(() => {
    dispatch(fetchGetMyPartyList())
  }, [])

  const onClick = (data: ICart) => {
    dispatch(addToParty(beverageID!, data.partyID!, data.quantity))
  }

  return (
    <>
      {!toggle && (
        <div className={styles.container} onClick={(e) => e.stopPropagation()}>
          <h3>加入Party</h3>
          <div>
            <ul>
              <li onClick={() => setToggle(true)}>
                <img src={plusImage} />
                <div className={styles.details}>
                  <span className={styles.newParty}>+ 建立新Party</span>
                </div>
              </li>
              {myPartyList.map((party) => (
                <li
                  key={party.id}
                  onClick={() => {
                    props.setValue('partyID', party.id)
                    props.handleSubmit(onClick)()
                  }}>
                  <img
                    src={
                      party.image !== 'http://cdn.partybuildhk.com/undefined'
                        ? party.image
                        : defaultImg
                    }
                  />
                  <div className={styles.details}>
                    <span>{party.name}</span>
                    <span>
                      <span>開始日期: </span>
                      <span className={styles.noWrap}>
                        {party.date
                          ? new Date(party.date).toLocaleDateString()
                          : '未設定日期'}
                      </span>
                    </span>
                    <span>
                      <span>開始時間: </span>
                      <span className={styles.noWrap}>
                        {party.startTime
                          ? new Date(party.startTime).toLocaleTimeString()
                          : '未設定時間'}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {toggle && <CreateNewParty handleSubmit={props.handleSubmit} />}
    </>
  )
}
