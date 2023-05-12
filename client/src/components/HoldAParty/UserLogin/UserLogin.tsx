import Button from 'components/common/Button/Button'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { clearMessage, login } from 'redux/auth/action'
import { RootState } from 'store'
import styles from './UserLogin.module.css'

export interface LoginForm {
  name: string
  password: string
}

export default function UserLogin(props: {
  setRegisterPage: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const message = useSelector((state: RootState) => state.auth.message)
  const onSubmit = (data: LoginForm) => {
    if (data.name && data.password) {
      const { name, password } = data
      dispatch(login(name, password, false))
    }
  }

  useEffect(() => {
    dispatch(clearMessage())
  }, [])

  return (
    <div className={styles.container} onClick={(e) => e.stopPropagation()}>
      <h2>用戶登入</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='name'>用戶名稱</label>
          <input name='name' required ref={register} />
        </div>
        <div>
          <label htmlFor='password'>密碼</label>
          <input type='password' name='password' required ref={register} />
        </div>
        <div className={styles.errorMessage}>
          {message ? <div>{message}</div> : ''}
        </div>
        <div className={styles.loginButton}>
          <Button type='submit'>登入</Button>
        </div>
      </form>
      <div className={styles.registerButton}>
        <Button
          type='button'
          color='var(--color-text-main)'
          backgroundColor='var(--color-background-secondary)'
          onClick={() => props.setRegisterPage(true)}>
          註冊帳戶
        </Button>
      </div>
      <div>
        <button type='button' className={styles.underlineButton}>
          忘記密碼
        </button>
      </div>
    </div>
  )
}
