import React from 'react';
import { action } from '@storybook/addon-actions';
import { MessageList } from '../src/components/MessageList/index';
import { specs } from 'storybook-addon-specifications';
import { noMessageListTests } from '../src/components/MessageList/index.test'
import { messageListTests } from '../src/components/MessageList/index.test'
import { testMessages } from '../src/testData/messageList';
export default {
  title: 'Message List'
};

export const noMessages = () => {
  let props = {
    messages: []
  }
  const story = (
    <MessageList {...props} />
  );
  specs(() => noMessageListTests);
  return story;
}

noMessages.story = {
  name: 'No messages'
}

export const messages = () => {
  let props = {
    messages: testMessages
  }
  const story = (
    <MessageList {...props} />
  );
  specs(() => messageListTests);
  return story;
}

messages.story = {
  name: 'Messages'
}
