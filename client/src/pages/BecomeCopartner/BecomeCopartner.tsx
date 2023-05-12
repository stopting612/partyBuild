import styles from '../BecomeCopartner/BecomeCopartner.module.css'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import React from 'react'
import Button from 'components/common/Button/Button'
import { newNotification } from 'redux/notifications/action'

interface CopartnerContact {
  name: string
  email: string
  phoneNumber: number
}

export function BecomeCopartner() {
  const dispatch = useDispatch()
  const { register, handleSubmit, reset } = useForm<CopartnerContact>({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: undefined
    }
  })

  async function fetchBecomeCopartner(data: CopartnerContact) {
    const res = await fetch(
      `${process.env.REACT_APP_API_SERVER}/copartner/new-copartners`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
    const result = await res.json()
    if (res.status !== 200) {
      dispatch(newNotification(result.message))
      return
    }
    dispatch(newNotification('已成功'))
    reset()
  }
  const onSubmit = (data: CopartnerContact) => {
    fetchBecomeCopartner(data)
  }
  // Add new copartners: POST “/api/v1/copartner/new-copartners”
  return (
    <div className={styles.container}>
      <h2>成為店主</h2>
      <h4>留下資料 我們會盡快聯絡你</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='name'>聯絡人名字</label>
          <input name='name' required ref={register} />
        </div>
        <div>
          <label htmlFor='email'>電郵</label>
          <input type='email' name='email' required ref={register} />
        </div>
        <div>
          <label htmlFor='phoneNumber'>聯絡電話</label>
          <input
            type='phoneNumber'
            name='phoneNumber'
            required
            ref={register}
          />
        </div>
        <div className={styles.loginButton}>
          <Button type='submit'>註冊</Button>
        </div>
      </form>
    </div>
  )
}
