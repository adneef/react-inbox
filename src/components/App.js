import React, { Component } from 'react'
import Toolbar from './Toolbar'
import MessageList from './MessageList'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { messages: props.messages }
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

  starClick(message) {
    this.toggleProperty(message, 'starred')
  }

  selected(message) {
    this.toggleProperty(message, 'selected')
  }

  render() {
    return (
      <div className="App">
        <Toolbar/>
        <MessageList messages={this.state.messages} starClick={this.starClick.bind(this)} selected={this.selected.bind(this)}/>
      </div>
    )
  }
}



export default App
