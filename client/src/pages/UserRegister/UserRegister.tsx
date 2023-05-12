import Button from 'components/common/Button/Button'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { clearMessage, errorMessage, registerUser } from 'redux/auth/action'
import { RootState } from 'store'
import styles from '../styles/loginForm.module.css'

interface RegisterForm {
  name: string
  email: string
  password: string
  passwordRepeat: string
}

export default function UserRegister() {
  const dispatch = useDispatch()
  const registerSuccess = useSelector(
    (state: RootState) => state.auth.registerSuccess
  )
  const { register, handleSubmit } = useForm()
  const message = useSelector((state: RootState) => state.auth.message)
  const onSubmit = (data: RegisterForm) => {
    if (data.password !== data.passwordRepeat) {
      dispatch(errorMessage('請檢查密碼'))
    }
    if (
      data.name &&
      data.email &&
      data.password &&
      data.passwordRepeat === data.password
    ) {
      const { name, email, password } = data
      dispatch(registerUser(name, password, email))
    }
  }

  useEffect(() => {
    dispatch(clearMessage())
  }, [])

  return (
    <div className={styles.container}>
      <Helmet>
        <title>用戶註冊 | Party Build</title>
      </Helmet>
      {!registerSuccess && (
        <>
          <h2>用戶註冊</h2>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor='name'>用戶名稱</label>
              <input name='name' required ref={register} />
            </div>
            <div>
              <label htmlFor='email'>Email</label>
              <input type='email' name='email' required ref={register} />
            </div>
            <div>
              <label htmlFor='password'>密碼</label>
              <input type='password' name='password' required ref={register} />
            </div>
            <div>
              <label htmlFor='passwordRepeat'>確認密碼</label>
              <input
                type='password'
                name='passwordRepeat'
                required
                ref={register}
              />
            </div>
            <div className={styles.errorMessage}>
              {message ? <div>{message}</div> : ''}
            </div>
            <div className={styles.loginButton}>
              <Button type='submit'>註冊帳戶</Button>
            </div>
          </form>
          <div className={styles.registerButton}>
            <Link to='/login'>
              <button type='button' className={styles.underlineButton}>
                已有帳戶?
              </button>
            </Link>
          </div>
        </>
      )}
      {registerSuccess && <p>註冊成功！請檢查電郵啟動帳戶。</p>}
    </div>
  )
}
