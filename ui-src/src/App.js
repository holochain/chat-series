import React from 'react';
import './index.css'
import { CreateMessageForm } from './components/CreateMessageForm/index';
import { MessageList } from './components/MessageList/index';

export const App = ({ sendMessage, messages }) => (
  <main>
    <section>
      <row->
        <col->
          <MessageList messages={messages} />
          <CreateMessageForm sendMessage={sendMessage} />
        </col->
      </row->
    </section>
  </main>
);

export default App;
