import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import Header from '../common/Header/Header'
import styles from './HoldAParty.module.css'
import { useForm } from 'react-hook-form'
import NumberInput from 'components/common/NumberInput/NumberInput'
import Button from 'components/common/Button/Button'
import RightArrow from 'assets/RightArrow'
import {
  fetchBeverageChoices,
  updateBeverageReq
} from 'redux/holdAParty/action'
import React, { useState } from 'react'
import CreateNewParty from './CreateNewParty/CreateNewParty'
import UserRegister from './UserRegister/UserRegister'
import UserLogin from './UserLogin/UserLogin'

interface IBeverageReq {
  beveragePerson: string
  beverageTypes: string[]
}

export default function BeverageReq() {
  const dispatch = useDispatch()
  const [showCreate, toggleShowCreate] = useState<boolean>(false)
  const [registerPage, setRegisterPage] = useState(false)
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated)
  const type = useSelector((state: RootState) => state.auth.type)
  const beverageTypes = useSelector(
    (state: RootState) => state.holdAParty.options.beverageTypes
  )
  const beveragePerson = useSelector(
    (state: RootState) => state.holdAParty.partyDetails.beveragePerson
  )
  const beverageType = useSelector(
    (state: RootState) => state.holdAParty.partyRequirements.beverageTypes
  )
  const { register, handleSubmit, getValues, setValue } = useForm<IBeverageReq>(
    {
      defaultValues: {
        beveragePerson: beveragePerson || '1',
        beverageTypes: beverageType
      }
    }
  )

  const onSubmit = (data: IBeverageReq) => {
    dispatch(updateBeverageReq(data))
    dispatch(fetchBeverageChoices())
  }

  return (
    <div className={styles.container}>
      <Header>酒類要求</Header>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputField}>
          <label>幾多人飲野?</label>
          <NumberInput
            name='beveragePerson'
            id='beveragePerson'
            max={99}
            register={register}
            increment={(person) =>
              Number(getValues(person)) < 99
                ? setValue('beveragePerson', Number(getValues(person)) + 1)
                : setValue('beveragePerson', 99)
            }
            decrement={(person) =>
              Number(getValues(person)) > 1
                ? setValue('beveragePerson', Number(getValues(person)) - 1)
                : null
            }
          />
        </div>
        <div className={styles.optionsField}>
          <legend>要咩酒類?</legend>
          <div className={styles.options}>
            {beverageTypes.map((beverageType) => (
              <div key={beverageType.name}>
                <input
                  type='checkbox'
                  id={beverageType.name}
                  name='beverageTypes'
                  value={beverageType.id}
                  ref={register}
                />
                <label htmlFor={beverageType.name}>{beverageType.name}</label>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <button
            type='button'
            className={styles.skipButton}
            onClick={(e) => {
              e.preventDefault()
              toggleShowCreate(true)
            }}>
            之後再揀酒類
          </button>
          <Button type='submit'>
            <span>揀酒類</span>
            <RightArrow />
          </Button>
        </div>
      </form>
      {showCreate && (
        <div
          className={styles.createNewParty}
          onClick={() => toggleShowCreate(false)}>
          {registerPage ? (
            <UserRegister setRegisterPage={setRegisterPage} />
          ) : isAuth && type === 'user' ? (
            <CreateNewParty />
          ) : (
            <UserLogin setRegisterPage={setRegisterPage} />
          )}
        </div>
      )}
    </div>
  )
}
