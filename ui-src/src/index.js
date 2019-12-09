import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { connect } from '@holochain/hc-web-client'
import { testMessages } from './testData/messageList';

const REACT_APP_WEBSOCKET_INTERFACE = process.env.REACT_APP_WEBSOCKET_INTERFACE  //'ws://localhost:10000' //

export class View extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      holochainConnection: connect({ url: REACT_APP_WEBSOCKET_INTERFACE }), // Use for debug
      messages: testMessages
    }

    this.actions = {
      sendMessage: ({ text }) => {
        const message = {
          id: 'text',
          createdAt: Math.floor(Date.now() / 1000),
          text: text
        }
        this.makeHolochainCall('chat/chat/post_message', { message}, (result) => {
          console.log('message posted', result)
        })
      }
    }
  }

  makeHolochainCall (callString, params, callback) {
    const [instanceId, zome, func] = callString.split('/')
    this.state.holochainConnection.then(({ callZome }) => {
      callZome(instanceId, zome, func)(params).then((result) => callback(JSON.parse(result)))
    })
  }

  render () {
    let props = {
      messages: this.state.messages,
      sendMessage: this.actions.sendMessage
    }
    return (
      <App {...props} />
    )
  }
}

ReactDOM.render(<View />, document.querySelector('#root'))
serviceWorker.unregister();
