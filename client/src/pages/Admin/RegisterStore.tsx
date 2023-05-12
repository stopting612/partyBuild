import Button from 'components/common/Button/Button'
import Header from 'components/common/Header/Header'
import InputSelect from 'components/common/InputSelect/InputSelect'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDistrictOptions,
  fetchFacilityOptions,
  registerStore
} from 'redux/admin/action'
import { RootState } from 'store'
import styles from './RegisterStore.module.css'

interface RegisterStoreForm {
  userEmail: string
  storeName: string
  address: string
  districtId: string
  area: string
  maxPeople: string
  minPeople: string
  introduction: string
  image: string
  facilities: Array<string>
  facilitiesDetail: string
  importantMatter: string
  contactPerson: string
  contactNumber: string
  whatsapp: string
  email: string
}

export default function RegisterStore() {
  const dispatch = useDispatch()

  const districtOptions = useSelector(
    (state: RootState) => state.admin.options.districts
  )
  const facilityOptions = useSelector(
    (state: RootState) => state.admin.options.facilities
  )
  const resetForm = useSelector((state: RootState) => state.admin.resetForm)

  const { register, handleSubmit, reset } = useForm<RegisterStoreForm>()
  const onSubmit = (data: RegisterStoreForm) => {
    dispatch(registerStore(data))
  }

  useEffect(() => {
    dispatch(fetchDistrictOptions())
    dispatch(fetchFacilityOptions())
  }, [])

  useEffect(() => {
    reset()
    window.scrollTo(0, 0)
  }, [resetForm])
  return (
    <>
      <Helmet>
        <title>登記店舖</title>
      </Helmet>
      <div className={styles.container}>
        <Header>登記店舖</Header>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>店主帳號</label>
            <input type='email' name='userEmail' ref={register} required />
          </div>
          <div>
            <label>店舖名稱</label>
            <input type='text' name='storeName' ref={register} required />
          </div>
          <div>
            <legend>地區</legend>
            <div className={styles.optionsContainer}>
                <InputSelect
                  name='districtId'
                  register={register}
                  options={districtOptions.map((district) => {
                    return { id: district.id, value: district.name }
                  })}
                />
            </div>
          </div>
          <div>
            <label>地址</label>
            <input type='text' name='address' ref={register} />
          </div>
          <div>
            <label>面積(平方尺)</label>
            <input type='number' name='area' min='1' required ref={register} />
          </div>
          <div className={styles.person}>
            <label>適合人數</label>
            <input
              type='number'
              name='minPeople'
              min='1'
              required
              ref={register}
            />
            <span>至</span>
            <input
              type='number'
              name='maxPeople'
              min='1'
              required
              ref={register}
            />
          </div>
          <div>
            <label>場地簡介</label>
            <textarea name='introduction' rows={8} ref={register} />
          </div>
          <div>
            <legend>場地設施</legend>
            <div className={styles.optionsContainer}>
              {facilityOptions.map((facility) => (
                <div className={styles.facility} key={facility.id}>
                  <label htmlFor={facility.type}>{facility.type}</label>
                  <input
                    id={facility.type}
                    type='checkbox'
                    name='facilities'
                    value={facility.id}
                    ref={register}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label>設施詳情</label>
            <textarea name='facilitiesDetail' rows={8} ref={register} />
          </div>
          <div>
            <label>重要事項</label>
            <textarea name='importantMatter' rows={8} ref={register} />
          </div>
          <div>
            <label>店舖照片</label>
            <input type='file' name='image' ref={register} />
          </div>
          <div>
            <label>聯絡人</label>
            <input type='text' name='contactPerson' ref={register} />
          </div>
          <div>
            <label>聯絡電話</label>
            <input type='number' name='contactNumber' ref={register} />
          </div>
          <div>
            <label>WhatsApp</label>
            <input type='number' name='whatsapp' ref={register} />
          </div>
          <div>
            <label>Email</label>
            <input type='email' name='email' ref={register} />
          </div>
          <div className={styles.buttonContainer}>
            <div>
              <Button type='submit'>儲存</Button>
            </div>
            <div className={styles.resetButton}>
              <Button
                type='button'
                backgroundColor='#ddd'
                onClick={() => reset()}>
                重置
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
