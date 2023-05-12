import BusinessAddSlot from 'components/Business/BusinessAddSlot/BusinessAddSlot'
import BusinessEditSlot from 'components/Business/BusinessEditSlot/BusinessEditSlot'
import Button from 'components/common/Button/Button'
import Pagination from 'components/common/Pagination/Pagination'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import {
  deleteOpenTime,
  fetchOpenTime,
  fetchStoreList,
  selectBranch
} from 'redux/Business/action'
import { OpenTime, Store } from 'redux/Business/state'
import { history, RootState } from 'store'
import styles from './BusinessBranch.module.css'

export default function BusinessBranch() {
  const dispatch = useDispatch()
  const selectedStoreID = new URLSearchParams(useLocation().search).get(
    'branch'
  )
  const storeList = useSelector((state: RootState) => state.business.storeList)
  const selectedBranch = useSelector(
    (state: RootState) => state.business.selectedBranch
  )
  const openTimes = useSelector(
    (state: RootState) => state.business.selectedBranch.openTimes
  )
  const recordsPerPage = 20
  const [currentPage, setCurrentPage] = useState(1)
  const pages = Array.from(
    Array(Math.ceil(openTimes.length / recordsPerPage)).keys(),
    (x) => x + 1
  )
  const currentOpenTimes = openTimes.slice(
    recordsPerPage * (currentPage - 1),
    recordsPerPage * currentPage
  )
  const [editSlot, setEditSlot] = useState<OpenTime | null>(null)
  const [openNewSlot, setOpenNewSlot] = useState(false)
  useEffect(() => {
    dispatch(fetchStoreList())
  }, [])

  useEffect(() => {
    let selectedBranch = storeList[0]
    let selectedBranchArr: Store[]
    if (selectedStoreID) {
      selectedBranchArr = storeList.filter(
        (store) => store.id === Number(selectedStoreID)
      )
      if (selectedBranchArr.length) {
        selectedBranch = selectedBranchArr[0]
      }
    }
    dispatch(selectBranch(selectedBranch))
  }, [storeList])

  useEffect(() => {
    dispatch(fetchOpenTime(String(selectedBranch.id)))
  }, [selectedBranch.id])
  return (
    <>
      <Helmet>
        <title>店舖管理 | Party Build</title>
      </Helmet>
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.branchNav}>
            <span>選擇店舖</span>
            {storeList.map((store) => (
              <span
                className={styles.branchButton}
                key={store.id}
                onClick={() => dispatch(selectBranch(store))}>
                {store.name}
              </span>
            ))}
          </div>
          <div className={styles.currentBranchContainer}>
            <div>
              <span className={styles.currentBranch}>
                {selectedBranch.name}
              </span>
              <Button
                onClick={() =>
                  history.push(`/business/branch/${selectedBranch.id}`)
                }>
                查看/更改資料
              </Button>
            </div>
            <div>
              <Button onClick={() => setOpenNewSlot(true)}>新增時段</Button>
            </div>
          </div>
          <div className={styles.header}>
            <span>日期</span>
            <span>時段</span>
            <span className={styles.status}>狀態</span>
          </div>
          {currentOpenTimes.map((openTime) => (
            <div className={styles.content} key={openTime.id}>
              <span>{new Date(openTime.date).toLocaleDateString()}</span>
              <span>
                {new Date(openTime.startTime).toLocaleTimeString().slice(0, -3)}{' '}
                - {new Date(openTime.endTime).toLocaleTimeString().slice(0, -3)}
              </span>
              <span
                className={
                  openTime.isBook
                    ? `${styles.status} ${styles.statusRed}`
                    : `${styles.status} ${styles.statusGreen}`
                }>
                {openTime.isBook ? '已預訂' : '開放'}
              </span>
              <span className={styles.editButton}>
                <Button onClick={() => setEditSlot(openTime)}>修改</Button>
              </span>
              <span className={styles.deleteButton}>
                <Button
                  onClick={() => dispatch(deleteOpenTime(String(openTime.id)))}>
                  刪除
                </Button>
              </span>
            </div>
          ))}
          {pages.length > 1 && (
            <Pagination
              pages={pages}
              fetchHandler={(e) => {
                return () => setCurrentPage(Number(e.target.value))
              }}
            />
          )}
        </div>
        {openNewSlot && (
          <BusinessAddSlot onClick={() => setOpenNewSlot(false)} />
        )}
        {editSlot?.id && (
          <BusinessEditSlot
            editSlot={editSlot}
            onClick={() => setEditSlot(null)}
          />
        )}
      </div>
    </>
  )
}
