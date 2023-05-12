/* eslint-disable react/display-name */
import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, RouteProps } from 'react-router-dom'
import { RootState } from 'store'

export function BusinessRoute(props: RouteProps) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const accountType = useSelector(
    (state: RootState) => state.auth.type
  )
  return (
    <>
      {isAuthenticated && accountType === 'business'
? (props.children)
: (
        <Redirect
          to={{
            pathname: '/business/login',
            state: { from: props.location }
          }}
        />
      )}
    </>
  )
}
