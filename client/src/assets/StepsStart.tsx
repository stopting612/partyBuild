import React from 'react'

export default function StepsActive(
  props: { active?: boolean } = { active: false }
) {
  let borderColor = 'white'
  let fillColor = '#C1C9D2'

  if (props.active) {
    borderColor = '#F5FBFF'
    fillColor = '#7DABF8'
  }
  return (
    <svg
      width='157'
      height='60'
      viewBox='0 0 157 60'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <g filter='url(#filter0_d)'>
        <mask id='path-1-inside-1' fill='white'>
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M2 5C2 2.79086 3.79086 1 6 1H136.679C138.114 1 139.44 1.76914 140.152 3.01544L153.866 27.0154C154.569 28.2452 154.569 29.7548 153.866 30.9846L140.152 54.9846C139.44 56.2309 138.114 57 136.679 57H6C3.79086 57 2 55.2091 2 53V5Z'
          />
        </mask>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M2 5C2 2.79086 3.79086 1 6 1H136.679C138.114 1 139.44 1.76914 140.152 3.01544L153.866 27.0154C154.569 28.2452 154.569 29.7548 153.866 30.9846L140.152 54.9846C139.44 56.2309 138.114 57 136.679 57H6C3.79086 57 2 55.2091 2 53V5Z'
          fill={borderColor}
        />
        <path
          d='M153.866 27.0154L154.734 26.5193L154.734 26.5193L153.866 27.0154ZM153.866 30.9846L154.734 31.4807L154.734 31.4807L153.866 30.9846ZM140.152 54.9846L141.02 55.4807L140.152 54.9846ZM140.152 3.01544L141.02 2.51931L140.152 3.01544ZM136.679 0H6V2H136.679V0ZM139.283 3.51158L152.998 27.5116L154.734 26.5193L141.02 2.51931L139.283 3.51158ZM152.998 27.5116C153.525 28.4339 153.525 29.5661 152.998 30.4884L154.734 31.4807C155.613 29.9435 155.613 28.0565 154.734 26.5193L152.998 27.5116ZM152.998 30.4884L139.283 54.4884L141.02 55.4807L154.734 31.4807L152.998 30.4884ZM6 58H136.679V56H6V58ZM1 5V53H3V5H1ZM139.283 54.4884C138.749 55.4231 137.755 56 136.679 56V58C138.473 58 140.13 57.0386 141.02 55.4807L139.283 54.4884ZM6 0C3.23858 0 1 2.23858 1 5H3C3 3.34315 4.34315 2 6 2V0ZM6 56C4.34315 56 3 54.6569 3 53H1C1 55.7614 3.23858 58 6 58V56ZM136.679 2C137.755 2 138.749 2.57686 139.283 3.51158L141.02 2.51931C140.13 0.96143 138.473 0 136.679 0V2Z'
          fill={fillColor}
          mask='url(#path-1-inside-1)'
        />
      </g>
      <defs>
        <filter
          id='filter0_d'
          x='0'
          y='0'
          width='156.393'
          height='60'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'>
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          />
          <feOffset dy='1' />
          <feGaussianBlur stdDeviation='1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0.215686 0 0 0 0 0.254902 0 0 0 0 0.317647 0 0 0 0.08 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  )
}
