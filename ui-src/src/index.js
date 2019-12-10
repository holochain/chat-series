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
    let connectUrl = {};
    if(REACT_APP_WEBSOCKET_INTERFACE){
      connectUrl = { url: REACT_APP_WEBSOCKET_INTERFACE }
    };
    this.state = {
      holochainConnection: connect(connectUrl),
      messages: testMessages
    };
    this.actions = {
      sendMessage: ({ text }) => {
        const message = {
          id: 'text',
          createdAt: Math.floor(Date.now() / 1000),
          text: text
        }
        this.setState({
            messages: [ ...this.state.messages, message ]
          })
        this.makeHolochainCall('peer-chat/chat/post_message', {message}, (result) => {
          console.log('message posted', result);
        })
      },
      getMessages: () => {
        this.makeHolochainCall('peer-chat/chat/get_messages', {}, (result) => {
          console.log('messages retrieved', result.Ok);
          this.setState({ messages: result.Ok });
        })
      }
    };
  };

  makeHolochainCall (callString, params, callback) {
    const [instanceId, zome, func] = callString.split('/')
    this.state.holochainConnection.then(({ callZome }) => {
      callZome(instanceId, zome, func)(params).then((result) => callback(JSON.parse(result)))
    });
  };

  componentDidMount () {
    this.state.holochainConnection.then(({ callZome }) => {
      console.log('Connected to Holochain Conductor');
      this.setState({ connected: true });
      callZome('peer-chat', 'chat', 'get_messages')({}).then((result) => {
        console.log('List of Messages ' + JSON.parse(result));
        this.setState({ messages: JSON.parse(result).Ok });
      })
    });
  };

  render () {
    let props = {
      messages: this.state.messages,
      sendMessage: this.actions.sendMessage
    };
    return (
      <App {...props} />
    );
  };
}

ReactDOM.render(<View />, document.querySelector('#root'))
serviceWorker.unregister();
