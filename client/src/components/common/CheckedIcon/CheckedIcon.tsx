import React from 'react'

export default function CheckedIcon(props: {
  checked: boolean
  height: string
}) {
  if (props.checked) {
    return (
      <svg
        aria-hidden='true'
        focusable='false'
        data-prefix='fas'
        data-icon='check-circle'
        className='svg-inline--fa fa-check-circle fa-w-16'
        role='img'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 512 512'
        height={props.height}>
        <path
          fill='currentColor'
          d='M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z'
        />
      </svg>
    )
  } else {
    return (
      <svg
        aria-hidden='true'
        focusable='false'
        data-prefix='far'
        data-icon='check-circle'
        className='svg-inline--fa fa-check-circle fa-w-16'
        role='img'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 512 512'
        height={props.height}>
        <path
          fill='currentColor'
          d='M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z'
        />
      </svg>
    )
  }
}
