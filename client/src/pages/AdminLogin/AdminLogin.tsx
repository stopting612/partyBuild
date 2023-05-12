import Button from 'components/common/Button/Button'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { clearMessage, adminLogin } from 'redux/auth/action'
import { RootState } from 'store'
import styles from './AdminLogin.module.css'

interface LoginForm {
  name: string
  password: string
}

export default function AdminLogin() {
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const message = useSelector((state: RootState) => state.auth.message)
  const onSubmit = (data: LoginForm) => {
    if (data.name && data.password) {
      const { name, password } = data
      dispatch(adminLogin(name, password))
    }
  }

  useEffect(() => {
    dispatch(clearMessage())
  }, [])

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Admin Portal | Party Build</title>
      </Helmet>
      <h2>Admin Portal</h2>
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
    </div>
  )
}
