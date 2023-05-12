import MinusIcon from 'assets/MinusIcon'
import PlusIcon from 'assets/PlusIcon'
import React, { useState } from 'react'
import styles from './NumberInput.module.css'

export default function NumberInput(props: {
  name: string
  id: string
  value?: any
  max?: number
  register?: any
  buttonColor?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  increment: ((name: string) => void) | (() => void)
  decrement: ((name: string) => void) | (() => void)
}) {
  const [interval, setInterval] = useState<number | null>(null)
  const [timeout, setTimeout] = useState<number | null>(null)
  const incrementHandler = () => {
    props.increment(props.name)
    const currentTimeout = window.setTimeout(() => {
      const currentInterval = window.setInterval(() => {
        props.increment(props.name)
      }, 100)
      setInterval(currentInterval)
    }, 300)
    setTimeout(currentTimeout)
  }

  const decrementHandler = () => {
    props.decrement(props.name)
    const currentTimeout = window.setTimeout(() => {
      const currentInterval = window.setInterval(() => props.decrement(props.name), 100)
      setInterval(currentInterval)
    }, 300)
    setTimeout(currentTimeout)
  }

  const clearTimer = () => {
    if (timeout) {
      window.clearTimeout(timeout)
    }
    if (interval) {
      window.clearInterval(interval)
    }
  }

  return (
    <div className={styles.container} style={{ color: props.buttonColor }}>
      <input
        type='number'
        name={props.name}
        value={props.value}
        min='1'
        max={props.max}
        required
        ref={props.register}
        onChange={props.onChange}
        readOnly
      />
      <div
        className={styles.buttons}
        onPointerDown={decrementHandler}
        onPointerUp={clearTimer}
        onPointerLeave={clearTimer}>
        <MinusIcon height='25px' />
      </div>
      <div
        className={styles.buttons}
        onPointerDown={incrementHandler}
        onPointerUp={clearTimer}
        onPointerLeave={clearTimer}>
        <PlusIcon height='25px' />
      </div>
    </div>
  )
}
