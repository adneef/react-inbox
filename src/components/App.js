import React, { Component } from 'react'
import Toolbar from './Toolbar'
import MessageList from './MessageList'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  async componentDidMount() {
    const messages = await this.getMessages()
    this.setState({
      messages: messages
    })
  }

  async getMessages() {
    const res = await fetch(`http://localhost:8082/api/messages`)
    const json = await res.json()
    // console.log(json._embedded.messages)
    return json._embedded.messages
  }

  toggleProperty( message, property ) {
    const index = this.state.messages.indexOf(message)
    this.setState({
      messages: [
        ...this.state.messages.slice(0, index),
        {...message, [property]: !message[property]},
        ...this.state.messages.slice(index + 1)
      ]
    })
  }

  starClick = async (message) => {

    this.toggleProperty(message, 'starred')

    return await fetch(`http://localhost:8082/api/messages`, {
      method: 'PATCH',
      body: JSON.stringify({
        "messageIds": [message.id],
        "command": "star",
        "star": message.starred
     }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  }

  // starClick(message) {
  //   console.log(message.id)
  //   this.toggleProperty(message, 'starred')
  // }

  selected(message) {
    this.toggleProperty(message, 'selected')
  }

  markRead() {
    this.setState({
      messages: this.state.messages.map(message => (
        message.selected ? { ...message, read: true } : message
      ))
    })
  }

  markUnread() {
    this.setState({
      messages: this.state.messages.map(message => (
        message.selected ? { ...message, read: false } : message
      ))
    })
  }

  deleteMessages() {
    const messages = this.state.messages.filter(message => !message.selected)
    this.setState({ messages })
  }

  toggleSelectAll() {
    const selectedMessages = this.state.messages.filter(message => message.selected)
    const selected = selectedMessages.length !== this.state.messages.length
    this.setState({
      messages: this.state.messages.map(message => (
        message.selected !== selected ? { ...message, selected } : message
      ))
    })
  }

  applyLabel(label) {
    const messages = this.state.messages.map(message => (
      message.selected && !message.labels.includes(label) ?
      { ...message, labels: [...message.labels, label].sort() }:
       message
    ))
    this.setState( { messages })
  }

  removeLabel(label) {
    const messages = this.state.messages.map(message => {
      const index = message.labels.indexOf(label)
      if(message.selected && index > -1) {
        return {
          ...message,
          labels: [
            ...message.labels.slice(0, index),
            ...message.labels.slice(index + 1)
          ]
        }
      }
      return message
    })
    this.setState({ messages })
  }

  render() {
    return (
      <div className="App">
        <Toolbar
          messages={this.state.messages}
          markRead = {this.markRead.bind(this)}
          markUnread={this.markUnread.bind(this)}
          deleteMessages={this.deleteMessages.bind(this)}
          toggleSelectAll={this.toggleSelectAll.bind(this)}
          applyLabel={this.applyLabel.bind(this)}
          removeLabel={this.removeLabel.bind(this)}
        />
        <MessageList
          messages={this.state.messages}
          starClick={this.starClick.bind(this)}
          selected={this.selected.bind(this)}
        />
      </div>
    )
  }
}



export default App
