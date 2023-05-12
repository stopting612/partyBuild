import Header from 'components/common/Header/Header'
import Pagination from 'components/common/Pagination/Pagination'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAccountApplications,
  updateApplicationStatus
} from 'redux/admin/action'
import { RootState } from 'store'
import styles from './AccountApplications.module.css'
import AccountApplicationStatus from './AccountApplicationStatus'

export default function AccountApplications() {
  const dispatch = useDispatch()
  const accountApplications = useSelector(
    (state: RootState) => state.admin.accountApplications.data
  )
  const count = useSelector(
    (state: RootState) => state.admin.accountApplications.count
  )
  const pages = Array.from(Array(Math.ceil(count / 10)).keys(), (x) => x + 1)
  useEffect(() => {
    dispatch(fetchAccountApplications())
  }, [])
  return (
    <>
      <Helmet>
        <title>申請一覽</title>
      </Helmet>
      <div className={styles.background}>
        <div className={styles.container}>
          <Header>申請一覽</Header>
          <div className={styles.content}>
            <div className={styles.header}>
              <span>申請人</span>
              <span>Email</span>
              <span>電話</span>
              <span className={styles.status}>狀態</span>
            </div>
            {accountApplications.map((accountApplication) => (
              <div key={accountApplication.id}>
                <span>{accountApplication.name}</span>
                <span>{accountApplication.email}</span>
                <span>{accountApplication.phoneNumber}</span>
                <span className={styles.status}>
                  <AccountApplicationStatus
                    status={accountApplication.state}
                    dispatchThunk={(e) =>
                      dispatch(
                        updateApplicationStatus(
                          accountApplication.id,
                          e.target.value
                        )
                      )
                    }
                  />
                </span>
              </div>
            ))}
          </div>
          {pages.length > 1 && (
            <Pagination
              pages={pages}
              fetchHandler={(e) =>
                fetchAccountApplications(Number(e.target.value))
              }
            />
          )}
        </div>
      </div>
    </>
  )
}
