import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { PowerBIEmbed } from 'powerbi-client-react'
import { models } from 'powerbi-client'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { fetchPowerBIToken } from 'redux/Business/action'
import styles from './BusinessData.module.css'

export default function BusinessData() {
  const dispatch = useDispatch()

  const accessToken = useSelector(
    (state: RootState) => state.business.powerbiToken
  )
  useEffect(() => {
    dispatch(fetchPowerBIToken())
  }, [])
  return (
    <>
      <Helmet>
        <title>數據分析 | Party Build</title>
      </Helmet>
      <div className={styles.container}>
        {accessToken && (
          <PowerBIEmbed
            embedConfig={{
              type: 'report', // Supported types: report, dashboard, tile, visual and qna
              id: 'a29453d9-7409-43a0-91fa-fe1d1f68aebb',
              accessToken: accessToken,
              tokenType: models.TokenType.Embed
            }}
            cssClassName={styles.report}
          />
        )}
      </div>
    </>
  )
}
