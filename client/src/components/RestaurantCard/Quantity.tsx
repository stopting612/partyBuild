import Button from 'components/common/Button/Button'
import InputSelect from 'components/common/InputSelect/InputSelect'
import NumberInput from 'components/common/NumberInput/NumberInput'
import React, { Dispatch, SetStateAction, useState } from 'react'
import styles from './Quantity.module.css'

export default function Quantity(props: {
  shippingFees?: {
    id: number
    price: string
    area: string
  }[]
  shippingFee?: number
  setShippingFee?: Dispatch<SetStateAction<number>>
  quantity: number
  setQuantity: Dispatch<SetStateAction<number>>
  onClickDetails?: () => void
  onSubmit: () => void
}) {
  const [toggle, setToggle] = useState(false)
  return (
    <>
      <div className={styles.formContainer}>
        <form>
          {!toggle && (
            <>
              {props.shippingFees && (
                <>
                  <label>送貨地區:</label>
                  <InputSelect
                    name='area'
                    options={props.shippingFees.map((shippingFee) => {
                      return { id: shippingFee.id, value: shippingFee.area }
                    })}
                    value={props.shippingFee}
                    required={true}
                    register={null}
                    onChange={(e) =>
                      props.setShippingFee!(Number(e.target.value))
                    }
                  />
                </>
              )}
              <NumberInput
                name='quantity'
                id='quantity'
                buttonColor='var(--color-text-main)'
                value={props.quantity}
                increment={() => props.setQuantity((quantity) => quantity + 1)}
                decrement={() =>
                  props.setQuantity((quantity) =>
                    quantity > 1 ? quantity - 1 : 1
                  )
                }
              />
              <Button
                onClick={() => {
                  setToggle(!toggle)
                  props.onSubmit()
                }}>
                加入Party
              </Button>
            </>
          )}
          {toggle && (
            <>
              {props.shippingFees && (
                <>
                  <label>送貨地區:</label>
                  <InputSelect
                    name='area'
                    options={props.shippingFees.map((shippingFee) => {
                      return { id: shippingFee.id, value: shippingFee.area }
                    })}
                    value={props.shippingFee}
                    required={true}
                    disabled={true}
                    register={null}
                    onChange={(e) =>
                      props.setShippingFee!(Number(e.target.value))
                    }
                  />
                </>
              )}
              <NumberInput
                name='quantity'
                id='quantity'
                buttonColor='#999'
                value={props.quantity}
                increment={() => {}}
                decrement={() => {}}
              />
              <Button disabled={true}>已加入</Button>
            </>
          )}
        </form>
      </div>
      <div>
        <Button onClick={props.onClickDetails}>詳情</Button>
      </div>
    </>
  )
}
