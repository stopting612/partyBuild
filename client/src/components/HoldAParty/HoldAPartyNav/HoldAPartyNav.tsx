import Steps from 'assets/Steps'
import StepsStart from 'assets/StepsStart'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './HoldAPartyNav.module.css'

export default function HoldAPartyNav() {
  const location = useLocation()
  return (
    <div className={styles.container}>
      <div>
        <Link to='/hold-a-party/party-room'>
          <div className={styles.step}>
            <StepsStart
              active={location.pathname === '/hold-a-party/party-room'}
            />
            <span>場地要求</span>
          </div>
        </Link>
        <Link to='/hold-a-party/party-room-choice'>
          <div className={styles.step}>
            <Steps
              active={location.pathname === '/hold-a-party/party-room-choice'}
            />
            <span>揀場地</span>
          </div>
        </Link>
        <Link to='/hold-a-party/food'>
          <div className={styles.step}>
            <Steps active={location.pathname === '/hold-a-party/food'} />
            <span>到會要求</span>
          </div>
        </Link>
      </div>
      <div>
        <Link to='/hold-a-party/food-choice'>
          <div className={styles.step}>
            <Steps active={location.pathname === '/hold-a-party/food-choice'} />
            <span>揀到會</span>
          </div>
        </Link>
        <Link to='/hold-a-party/beverage'>
          <div className={styles.step}>
            <Steps active={location.pathname === '/hold-a-party/beverage'} />
            <span>酒類要求</span>
          </div>
        </Link>
        <Link to='/hold-a-party/beverage-choice'>
          <div className={styles.step}>
            <Steps
              active={location.pathname === '/hold-a-party/beverage-choice'}
            />
            <span>揀酒類</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
