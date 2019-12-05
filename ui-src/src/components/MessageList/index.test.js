import React from 'react';
import { mount } from 'enzyme';
import { MessageList } from './index';
import { testMessages } from '../../testData/messageList';

export const noMessageListTests = describe('No messages', function () {
  let props = {
    messages: []
  }

  const component = (
    <MessageList {...props}/>
  );
  it('Renders witout crashing', function () {
    mount(component);
  });
  it('Does not show any messages', function () {
    let wrap = mount(component);
    expect(wrap.find('Message').length).toEqual(0)
  });
  it('Shows the no messages message', function () {
    let wrap = mount(component);
    expect(wrap.find('h2').text()).toContain('No Messages Yet');
  });
})

export const messageListTests = describe('Messages', function () {
  let props = {
    messages: testMessages
  }

  const component = (
    <MessageList {...props}/>
  );
  it('Renders witout crashing', function () {
    mount(component);
  });
  it('Shows the messages', function () {
    let wrap = mount(component);
    expect(wrap.find('Message').length).toEqual(3)
  });
  it('Shows the correct message', function () {
    let wrap = mount(component);
    expect(wrap.find('Message').first().text()).toContain('Message 1');
  });
})
