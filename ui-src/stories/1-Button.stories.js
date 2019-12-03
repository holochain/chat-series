import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { specs } from 'storybook-addon-specifications';
import { buttonTests } from '../src/button.test'


export default {
  title: 'Button'
};

export const text = () => {
  const story = (
    <Button onClick={action('Hello World')}>
      Hello World
    </Button>
  );

  specs(() => buttonTests);

  return story;
}

text.story = {
  name: 'Text'
}

export const emoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
