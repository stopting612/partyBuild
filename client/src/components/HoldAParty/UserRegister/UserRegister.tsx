import Button from 'components/common/Button/Button'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  checkLogin,
  clearMessage,
  errorMessage,
  registerUser
} from 'redux/auth/action'
import { RootState } from 'store'
import styles from '../UserLogin/UserLogin.module.css'

interface RegisterForm {
  name: string
  email: string
  password: string
  passwordRepeat: string
}

export default function UserRegister(props: {
  setRegisterPage: React.Dispatch<React.SetStateAction<boolean>>
}) {
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
    <div className={styles.container} onClick={(e) => e.stopPropagation()}>
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
            <button
              type='button'
              className={styles.underlineButton}
              onClick={() => {
                props.setRegisterPage(false)
              }}>
              已有帳戶?
            </button>
          </div>
        </>
      )}
      {registerSuccess && (
        <>
          <p>註冊成功！請檢查電郵啟動帳戶。</p>
          <Button
            onClick={() => {
              dispatch(checkLogin())
              props.setRegisterPage(false)
            }}>
            啟動帳戶後按此繼續
          </Button>
        </>
      )}
    </div>
  )
}
