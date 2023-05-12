import Button from 'components/common/Button/Button'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { clearMessage, businessLogin } from 'redux/auth/action'
import { history, RootState } from 'store'
import styles from './BusinessLogin.module.css'

interface LoginForm {
  name: string
  password: string
}

export default function BusinessLogin() {
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const message = useSelector((state: RootState) => state.auth.message)
  const onSubmit = (data: LoginForm) => {
    if (data.name && data.password) {
      const { name, password } = data
      dispatch(businessLogin(name, password))
    }
  }

  useEffect(() => {
    dispatch(clearMessage())
  }, [])

  return (
    <div className={styles.container}>
      <Helmet>
        <title>店主登入 | Party Build</title>
      </Helmet>
      <h2>店主登入</h2>
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
            onClick={() => history.push('/become-copartner')}>
            成為店主
          </Button>
      </div>
    </div>
  )
}
