import React, { Component } from 'react'
import Toolbar from './Toolbar'
import MessageList from './MessageList'
import ComposeMessage from './ComposeMessage'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  async componentDidMount() {
    const res = await this.request(`/api/messages`)
    const json = await res.json()
    this.setState({
      messages: json._embedded.messages
    })
  }

  toggleProperty(message, property) {
    const index = this.state.messages.indexOf(message)
    this.setState({
      messages: [
        ...this.state.messages.slice(0, index),
        {...message, [property]: !message[property]},
        ...this.state.messages.slice(index+1)
      ]
    })
  }

  async selected(message) {
    this.toggleProperty(message, 'selected')
  }

  async request(path, method='GET', body=null) {
    if (body) {
      body = JSON.stringify(body)
    }
    return await fetch(`${process.env.REACT_APP_API_URL}${path}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: body
    })
  }

  async updateMessages(payload) {
    await this.request('/api/messages', 'PATCH', payload)
  }

  async starClick(message) {
    await this.updateMessages({
      "messageIds": [ message.id ],
      "command": "star",
      "star": message.starred
    })
    this.toggleProperty(message, 'starred')
  }

  async markRead() {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "read",
      "read": true
    })

    this.setState({
      messages: this.state.messages.map(message => (
        message.selected ? { ...message, read: true } : message
      ))
    })
  }

  async markUnread() {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "read",
      "read": false
    })

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

  toggleSelectAll() {
    const selectedMessages = this.state.messages.filter(message => message.selected)
    const selected = selectedMessages.length !== this.state.messages.length
    this.setState({
      messages: this.state.messages.map(message => (
        message.selected !== selected ? { ...message, selected } : message
      ))
    })
  }

  toggleCompose() {
    this.setState({ composing: !this.state.composing })
  }

  async applyLabel(label) {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "addLabel",
      "label": label
    })

    const messages = this.state.messages.map(message => (
      message.selected && !message.labels.includes(label) ?
      { ...message, labels: [...message.labels, label].sort() }:
       message
    ))
    this.setState({ messages })
  }

  async removeLabel(label) {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "removeLabel",
      "label": label
    })

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

  async sendMessage(message) {
    const response = await this.request('/api/messages', 'POST', {
      subject: message.subject,
      body: message.body,
    })
    const newMessage = await response.json()

    const messages = [...this.state.messages, newMessage]
    this.setState({
      messages,
      composing: false
    })
  }

  render() {
    return <div>
      <div className="navbar navbar-default" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/">React Inbox</a>
          </div>
        </div>
      </div>

      <div className="App">
        <Toolbar
          messages={this.state.messages}
          markRead = {this.markRead.bind(this)}
          markUnread={this.markUnread.bind(this)}
          deleteMessages={this.deleteMessages.bind(this)}
          toggleSelectAll={this.toggleSelectAll.bind(this)}
          applyLabel={this.applyLabel.bind(this)}
          removeLabel={this.removeLabel.bind(this)}
          toggleCompose={this.toggleCompose.bind(this)}
        />

         {
            this.state.composing ?
              <ComposeMessage sendMessage={ this.sendMessage.bind(this) } /> :
              null
          }

        <MessageList
          messages={this.state.messages}
          starClick={this.starClick.bind(this)}
          selected={this.selected.bind(this)}
        />
      </div>
    </div>
  }
}



export default App
