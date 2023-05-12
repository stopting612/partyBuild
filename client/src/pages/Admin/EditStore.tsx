import Button from 'components/common/Button/Button'
import Header from 'components/common/Header/Header'
import InputSelect from 'components/common/InputSelect/InputSelect'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  editStore,
  fetchDistrictOptions,
  fetchStoreData,
  fetchStoreList
} from 'redux/admin/action'
import { RootState } from 'store'
import styles from './RegisterStore.module.css'

export interface EditStoreForm {
  id: string
  storeName: string
  address: string
  districtId: string
  area: string
  maxPeople: string
  minPeople: string
  introduction: string
  image: FileList
  facilities: Array<string>
  facilitiesDetail: string
  importantMatter: string
  contactPerson: string
  contactNumber: string
  whatsapp: string
  email: string
}

export default function EditStore() {
  const dispatch = useDispatch()

  const districtOptions = useSelector(
    (state: RootState) => state.admin.options.districts
  )
  const storeList = useSelector((state: RootState) => state.admin.storeList)
  const storeData = useSelector((state: RootState) => state.admin.storeData)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues
  } = useForm<EditStoreForm>()
  const onSubmit = (data: EditStoreForm) => {
    dispatch(editStore(data))
  }

  useEffect(() => {
    dispatch(fetchDistrictOptions())
    dispatch(fetchStoreList())
  }, [])

  useEffect(() => {
    if (getValues('id')) {
      dispatch(fetchStoreData(Number(getValues('id'))))
    }
  }, [storeList])

  useEffect(() => {
    setValue('storeName', storeData?.name)
    setValue('address', storeData?.address)
    setValue('districtId', storeData?.districtId)
    setValue('area', storeData?.area)
    setValue('maxPeople', storeData?.maxPeople)
    setValue('minPeople', storeData?.minPeople)
    setValue('introduction', storeData?.introduction)
    setValue('facilitiesDetail', storeData?.facilitiesDetail)
    setValue('importantMatter', storeData?.importantMatter)
    setValue('image', null)
    setValue('contactPerson', storeData?.contactPerson)
    setValue('contactNumber', storeData?.contactNumber)
    setValue('whatsapp', storeData?.whatsapp)
    setValue('email', storeData?.email)
  }, [storeData])

  return (
    <>
      <Helmet>
        <title>修改店舖資料</title>
      </Helmet>
      <div className={styles.container}>
        <Header>修改店舖資料</Header>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>選擇店舖</label>
            <InputSelect
              name='id'
              register={register}
              options={storeList.map((store) => {
                return {
                  id: store.id,
                  value: `${store.name} (ID: ${store.id})`
                }
              })}
              onChange={(e) => dispatch(fetchStoreData(Number(e.target.value)))}
            />
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
              {storeData?.facilities.map((facility) => (
                <div key={facility.id}>
                  <label htmlFor={facility.name}>{facility.name}</label>
                  <input
                    id={facility.name}
                    type='checkbox'
                    name='facilities'
                    value={facility.id}
                    ref={register}
                    defaultChecked={facility.isAvailable}
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
