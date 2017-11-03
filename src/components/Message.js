import React from 'react'

// function onClick = ()

class Message extends React.Component {

  constructor(props){
    super(props)
    this.state = {message: this.props.message}

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState(prevState => ({
      message: !prevState.message.read
    }))
  }

  render() {
    return (
      <div onClick={this.handleClick} className={this.state.message.read===false ? "row message unread" : "row message read"}>
        <div className="col-xs-1">
          <div className="row">
            <div className="col-xs-2">
              <input type="checkbox" />
            </div>
            <div className="col-xs-2">
              <i className={this.props.message.starred ? "star fa fa-star" : "star fa fa-star-o"}></i>
            </div>
          </div>
        </div>
        <div className="col-xs-11">
          {this.props.message.labels.map((label, i) => <span key={i+1} className="label label-warning">{label}</span>)}
          <a href="">
            {this.props.message.subject}
          </a>
        </div>
      </div>
    )
  }
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
