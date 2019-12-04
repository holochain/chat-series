import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';

export default {
  title: 'Welcome',
};

export const toPeerChat = () => <p>this is where we will put the chat window</p>;

toPeerChat.story = {
  name: 'to Peer Chat',
};
