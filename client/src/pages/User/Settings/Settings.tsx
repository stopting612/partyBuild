import Button from 'components/common/Button/Button'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUserProfile,
  resetMessage,
  updateProfile
} from 'redux/User/settings/action'
import { RootState } from 'store'
import styles from './Settings.module.css'

export interface SettingsForm {
  name: string
  email: string
  password: string
  passwordRepeat: string
  image: FileList
}

export default function Settings() {
  const dispatch = useDispatch()
  const userProfile = useSelector((state: RootState) => state.settings.profile)
  const message = useSelector((state: RootState) => state.settings.message)

  useEffect(() => {
    dispatch(fetchUserProfile())
    return () => {
      dispatch(resetMessage())
    }
  }, [])

  const { register, handleSubmit, setValue } = useForm<SettingsForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordRepeat: '',
      image: ''
    }
  })

  useEffect(() => {
    setValue('name', userProfile.name)
    setValue('email', userProfile.email)
  }, [userProfile])

  const onSubmit = (data: SettingsForm) => {
    dispatch(updateProfile(data))
    setValue('password', '')
    setValue('passwordRepeat', '')
    setValue('image', '')
  }
  return (
    <>
      <Helmet>
        <title>用戶設定 | Party Build</title>
      </Helmet>
      <div className={styles.container}>
        <h2>設定</h2>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor='email'>登入名稱</label>
            <input type='email' name='email' readOnly ref={register} />
          </div>
          <div>
            <label htmlFor='name'>用戶名稱</label>
            <input name='name' required ref={register} />
          </div>
          <div>
            <label htmlFor='password'>更改密碼</label>
            <input type='password' name='password' required ref={register} />
          </div>
          <div>
            <label htmlFor='password'>確認密碼</label>
            <input
              type='password'
              name='passwordRepeat'
              required
              ref={register}
            />
          </div>
          <div>
            <label htmlFor='profilePic'>更換頭像</label>
            <input type='file' name='image' ref={register} />
          </div>
          <div className={styles.errorMessage}>
            {message ? <div>{message}</div> : ''}
          </div>
          <div>
            <Button type='submit'>確認</Button>
          </div>
        </form>
      </div>
    </>
  )
}
