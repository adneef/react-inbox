import React from 'react'
import Message from './Message'

const MessageList = ({messages, starClick, selected}) => {
  return (
    <div>
      { messages.map(message => <Message key={message.id} message={message} starClick={starClick} selected={selected}/>)}
    </div>
  )
}


export default MessageList
