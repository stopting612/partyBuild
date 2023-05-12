import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { clearMessage, verifyUser } from 'redux/auth/action'

export default function UserVerification() {
  const dispatch = useDispatch()
  const token = new URLSearchParams(useLocation().search).get('token')
  useEffect(() => {
    dispatch(clearMessage())
    dispatch(verifyUser(token))
  })
  return <div />
}
