import React from 'react'
import style from './index.module.css'

export const CreateMessageForm = ({
  sendMessage
}) =>
    <form
      className={style.component}
      onSubmit={e => {
        e.preventDefault()
        const message = e.target[0].value.trim()
        if (message.length === 0) {
          return
        }
        e.target[0].value = ''
        sendMessage({
            text: message
          })
      }}
    >
      <input
        placeholder='Type a Message..'
      />
      <button type='submit'>
        <svg>
          <use xlinkHref='index.svg#send' />
        </svg>
      </button>
    </form>
