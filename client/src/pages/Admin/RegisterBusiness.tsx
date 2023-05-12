import Button from 'components/common/Button/Button'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { registerBusiness } from 'redux/admin/action'
import { clearMessage } from 'redux/auth/action'
import { RootState } from 'store'
import styles from '../styles/loginForm.module.css'

interface RegisterForm {
  email: string
}

export default function RegisterBusiness() {
  const dispatch = useDispatch()
  const registerSuccess = useSelector(
    (state: RootState) => state.auth.registerSuccess
  )
  const { register, handleSubmit, reset } = useForm()
  const message = useSelector((state: RootState) => state.auth.message)
  const onSubmit = (data: RegisterForm) => {
    dispatch(registerBusiness(data.email))
    reset()
  }

  useEffect(() => {
    dispatch(clearMessage())
  }, [])

  return (
    <div className={styles.container}>
      <Helmet>
        <title>註冊店主 | Party Build</title>
      </Helmet>
      {!registerSuccess && (
        <>
          <h2>註冊店主</h2>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor='email'>Email</label>
              <input type='email' name='email' required ref={register} />
            </div>
            <div className={styles.errorMessage}>
              {message ? <div>{message}</div> : ''}
            </div>
            <div className={styles.loginButton}>
              <Button type='submit'>註冊帳戶</Button>
            </div>
          </form>
        </>
      )}
      {registerSuccess && <p>註冊成功！請檢查電郵啟動帳戶。</p>}
    </div>
  )
}
