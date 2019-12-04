import React from 'react';
import { mount } from 'enzyme';
import { CreateMessageForm } from './index';

export const createMessageFormTests = describe('Default', function () {
  const component = (
    <CreateMessageForm sendMessage={jest.fn()}/>
  );
  it('Renders witout crashing', function () {
    mount(component);
  });
})
