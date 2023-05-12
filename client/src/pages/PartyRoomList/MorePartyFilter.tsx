import CrossIcon from 'assets/CrossIcon'
import Button from 'components/common/Button/Button'
import styles from 'pages/PartyRoomList/MorePartyFilter.module.css'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOptions } from 'redux/holdAParty/action'
import { fetchFilterOption } from 'redux/PartyRoomList/action'
import { RootState } from 'store'

interface IPartyRoomFilter {
  location: string[]
  facilities: string[]
}

export function MorePartyRoomFilter(props: {
  onToggle: () => void
  onClose: () => void
}) {
  const dispatch = useDispatch()
  const districtOptions = useSelector(
    (state: RootState) => state.holdAParty.options.districts
  )
  const facilityOptions = useSelector(
    (state: RootState) => state.holdAParty.options.facilities
  )

  const { register, handleSubmit } = useForm<IPartyRoomFilter>({
    defaultValues: {
      location: [],
      facilities: []
    }
  })

  const onSubmit = (data: IPartyRoomFilter) => {
    dispatch(fetchFilterOption(data))
    props.onClose()
  }
  useEffect(() => {
    dispatch(fetchOptions())
  }, [])
  return (
    <div className={styles.container} onClick={props.onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <div className={styles.title}>
            <h3>更多篩選條件</h3>
          </div>
          <div className={styles.district}>
            <h4>地區</h4>
            <div className={styles.checkboxContainer}>
              {districtOptions.map((districtOption) => (
                <div key={districtOption.id}>
                  <div className={styles.checkboxEach}>
                    <input
                      type='checkbox'
                      id={districtOption.name}
                      name='location'
                      value={districtOption.id}
                      ref={register}
                    />
                    <label htmlFor={districtOption.name}>
                      {districtOption.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.facility}>
            <h4>設施</h4>
            <div className={styles.checkboxContainer}>
              {facilityOptions.map((facilityOption) => (
                <div key={facilityOption.id}>
                  <div className={styles.checkboxEach}>
                    <input
                      type='checkbox'
                      id={facilityOption.type}
                      name='facilities'
                      value={facilityOption.id}
                      ref={register}
                    />
                    <label htmlFor={facilityOption.type}>
                      {facilityOption.type}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.button}>
            <Button>搜尋</Button>
          </div>
          <div className={styles.closeButton} onClick={props.onToggle}>
            <CrossIcon height='20px' />
          </div>
        </div>
      </form>
    </div>
  )
}
