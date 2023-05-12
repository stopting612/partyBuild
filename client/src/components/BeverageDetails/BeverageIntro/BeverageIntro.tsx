import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'

export default function BeverageIntro() {
  const beverageIntro = useSelector((state:RootState) => state.beverageDetails.introduction)
  return (<div>
    <h3>簡介</h3>
    <p>{beverageIntro}</p>
  </div>)
}
