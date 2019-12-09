import React from 'react';
import '../src/index.css'
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { CreateMessageForm } from '../src/components/CreateMessageForm/index';
import { Message } from '../src/components/Message/index';
import { MessageList } from '../src/components/MessageList/index';
import { testMessages } from '../src/testData/messageList';

export default {
  title: 'Welcome',
};

export const toPeerChat = () => {
  let messageListProps = {
    messages: testMessages
  }
  let createMessageFormprops = {
    sendMessage: action('Send the message')
  }
  const story = (
    <main>
      <section>
        <col->
          <a href="https://github.com/holochain/chat-series" alt="github repo for chat series"><h1>Peer Chat Developer Series</h1></a>
          <MessageList {...messageListProps} />
          <CreateMessageForm {...createMessageFormprops} />
        </col->
      </section>
    </main>
  );
  return story
};

toPeerChat.story = {
  name: 'Super Basic Chat',
};
