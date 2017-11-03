import React from 'react'

const Message = ({message, starClick, selected}) => {

  const starShow = (e) => {
    e.stopPropagation()
    starClick(message)
  }

  return (
    <div className={`row ${message.read ? "message unread" : "message read"} ${message.selected ? "selected" : ""}`} onClick={() => selected(message)}>
      <div className="col-xs-1">
        <div className="row">
          <div className="col-xs-2">
            <input type="checkbox" />
          </div>
          <div className="col-xs-2" onClick ={ starShow }>
            <i className={message.starred ? "star fa fa-star" : "star fa fa-star-o"}></i>
          </div>
        </div>
      </div>
      <div className="col-xs-11">
        {message.labels.map((label, i) => <span key={i+1} className="label label-warning">{label}</span>)}
        <a href="">
          {message.subject}
        </a>
      </div>
    </div>
  )
}

// const MessageBody = () => {
//   return (
//     <div class="row message-body">
//       <div class="col-xs-11 col-xs-offset-1">
//         This is the body of the message.
//       </div>
//     </div>
//   )
// }

export default Message
