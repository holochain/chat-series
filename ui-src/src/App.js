import React from 'react';
import logo from './logo.svg';
import './index.css'
import { CreateMessageForm } from './components/CreateMessageForm/index';
import { Message } from './components/Message/index';
import { MessageList } from './components/MessageList/index';

export const App = ({ sendMessage, messages }) => (
  <main>
    <section>
      <col->
        <MessageList messages={messages} />
        <CreateMessageForm sendMessage={sendMessage} />
      </col->
    </section>
  </main>
);

export default App;
