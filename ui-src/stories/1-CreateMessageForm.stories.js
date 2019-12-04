import React from 'react';
import { action } from '@storybook/addon-actions';
import { CreateMessageForm } from '../src/components/CreateMessageForm/index';
import { specs } from 'storybook-addon-specifications';
import { createMessageFormTests } from '../src/components/CreateMessageForm/index.test'

export default {
  title: 'Create Message Form'
};

export const empty = () => {
  const story = (
    <CreateMessageForm sendMessage={action('Send the message')} />
  );
  specs(() => createMessageFormTests);
  return story;
}

empty.story = {
  name: 'Default'
}
