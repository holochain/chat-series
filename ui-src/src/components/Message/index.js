import React from 'react'
import style from './index.module.css'
import Linkify from 'react-linkify'

const time = timestamp => {
  const date = new Date(timestamp * 1000)
  const minutes = date.getMinutes()
  return `${date.getHours()}:${minutes < 10 ? '0' + minutes : minutes}`
}

export const Message = ({ message }) =>
  <li key={message.id} className={style.component}>
    <div>
      <span name='createAtTime'>{time(message.createdAt)}</span>
      <p>
        <Linkify properties={{ target: '_blank' }}>{message.text}</Linkify>
      </p>
    </div>
  </li>
