import React, { useState } from 'react'

export default function AccountApplicationStatus(props: {
  status: string
  dispatchThunk: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  const [status, setStatus] = useState<string>(props.status)
  return (
    <select
      value={status}
      onChange={(e) => {
        setStatus(e.target.value)
        props.dispatchThunk(e)
      }}>
      <option>未處理</option>
      <option>處理中</option>
      <option>已完成</option>
    </select>
  )
}
