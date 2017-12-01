import React from 'react'

const Message = ({message, starClick, selected}) => {

  return (
    <div className={`row ${message.read ? "message unread" : "message read"} ${message.selected ? "selected" : ""}`}>
      <div className="col-xs-1">
        <div className="row">
          <div className="col-xs-2">
            <input type="checkbox" checked={!!message.selected} readOnly={true} onClick={() => selected(message)}/>
          </div>
          <div className="col-xs-2" onClick={() => starClick(message)}>
            <i className={message.starred ? "star fa fa-star" : "star fa fa-star-o"}></i>
          </div>
        </div>
      </div>
      <div className="col-xs-11">
        {message.labels.map((label, i) => <span key={i} className="label label-warning">{label}</span>)}
        {message.subject}
      </div>
    </div>
  )
}

export default Message
