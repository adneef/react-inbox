import React, { Component } from 'react'
import Toolbar from './Toolbar'
import MessageList from './MessageList'
import './App.css'
const API = `${process.env.REACT_APP_API_URL}`

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  async componentDidMount() {
    const res = await fetch(`${API}/messages`)
    const json = await res.json()
    this.setState({
      messages: json._embedded.messages
    })
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

  async toggleSelect(message) {
    this.toggleProperty(message, 'selected')
  }

  async request(method ='GET', body = null) {
    if (body) {
      body = JSON.stringify(body)
    }
    return await fetch(`http://localhost:8181/api/messages`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: body
    })
  }

  async updateMessages(payload) {
    await this.request('PATCH', payload)
  }

  async starClick(message) {
    await this.updateMessages({
      "messageIds": [message.id],
      "command": "star",
      "star": message.starred
    })

    this.toggleProperty(message, 'starred')
  }

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

  async deleteMessages() {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "delete"
    })

    const messages = this.state.messages.filter(message => !message.selected)
    this.setState({ messages })
  }

  // deleteMessages() {
  //   const messages = this.state.messages.filter(message => !message.selected)
  //   this.setState({ messages })
  // }

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
