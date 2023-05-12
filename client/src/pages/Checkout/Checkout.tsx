import { loadStripe } from '@stripe/stripe-js'
import Button from 'components/common/Button/Button'
import Header from 'components/common/Header/Header'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { createPayment, fetchPaymentInfo } from 'redux/checkout/action'
import { RootState } from 'store'
import styles from './Checkout.module.css'
import moment from 'moment'
import InputSelect from 'components/common/InputSelect/InputSelect'
import { Helmet } from 'react-helmet'
const stripePromise = loadStripe(
  'pk_test_51IfgPRFp69OakVIRGnROCi4Sqwg9ckaGDTzSznf50GflTj2KzIWoq0DpQt27vnbJvRTnBKSQsMYyolD8Lz3aZB5900UpneZs42'
)

interface PaymentForm {
  contactName: string
  phoneNumber: string
  date: string
  startTime: string
  address: string
  specialRequirement: string
}

export default function Checkout() {
  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>()
  const paymentDetails = useSelector((state: RootState) => state.checkout)
  const minDate = moment(new Date()).add(3, 'd').format('YYYY-MM-DD')

  useEffect(() => {
    dispatch(fetchPaymentInfo(Number(id)))
  }, [])

  const { register, handleSubmit, setValue } = useForm<PaymentForm>({
    defaultValues: {
      contactName: '',
      phoneNumber: '',
      date: '',
      startTime: '',
      address: '',
      specialRequirement: ''
    }
  })

  useEffect(() => {
    setValue('address', paymentDetails.address)
    setValue('date', moment(paymentDetails.date).format('YYYY-MM-DD'))
    setValue('startTime', paymentDetails.startTime?.slice(0, -3))
  }, [paymentDetails])

  const onSubmit = (data: PaymentForm) => {
    dispatch(
      createPayment({ ...data, shoppingBasketId: Number(id) }, stripePromise)
    )
  }

  const zeroTo23 = Array.from(Array(24).keys())

  return (
    <>
      <Helmet>
        <title>訂單資料</title>
      </Helmet>
      <div className={styles.container}>
        <Header>訂單資料</Header>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputField}>
            <label>聯絡人姓名</label>
            <input type='text' name='contactName' required ref={register} />
          </div>
          <div className={styles.inputField}>
            <label>聯絡人電話</label>
            <input type='number' name='phoneNumber' required ref={register} />
          </div>
          <div className={styles.inputField}>
            <label>送貨日期</label>
            <input type='date' name='date' min={minDate} required ref={register} />
          </div>
          <div className={styles.inputField}>
            <label>送貨時間</label>
            <InputSelect
              name='startTime'
              register={register}
              options={zeroTo23.map((hour) => `${`0${hour}`.slice(-2)}:00`)}
              required={true}
            />
          </div>
          <div className={styles.inputField}>
            <label>送貨地址</label>
            <input type='text' name='address' required ref={register} />
          </div>
          <div className={styles.inputField}>
            <label>其他要求</label>
            <input type='text' name='specialRequirement' ref={register} />
          </div>
          <div className={styles.buttonContainer}>
            <Button type='submit'>前往付款</Button>
          </div>
        </form>
      </div>
    </>
  )
}
