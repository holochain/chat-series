import React from 'react';
import { action } from '@storybook/addon-actions';
import { Message } from '../src/components/Message/index';
import { specs } from 'storybook-addon-specifications';
import { messageTests } from '../src/components/Message/index.test'

export default {
  title: 'Message'
};

export const withMessage = () => {
  let props = {
    message: {
      id: 'messageid',
      createdAt: Date.now(),
      text: 'Here is the message text https://philt3r.com'
    }
  }
  const story = (
    <Message {...props} />
  );
  specs(() => messageTests);
  return story;
}

withMessage.story = {
  name: 'With message'
}
