import React from 'react';
import { action } from '@storybook/addon-actions';
import { MessageList } from '../src/components/MessageList/index';
import { specs } from 'storybook-addon-specifications';
import { messageListTests } from '../src/components/MessageList/index.test'

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
  specs(() => messageListTests);
  return story;
}

noMessages.story = {
  name: 'No messages'
}
