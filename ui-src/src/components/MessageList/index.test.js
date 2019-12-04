import React from 'react';
import { mount } from 'enzyme';
import { MessageList } from './index';

export const messageListTests = describe('With message', function () {
  let props = {
    messages: []
  }

  const component = (
    <MessageList {...props}/>
  );
  it('Renders witout crashing', function () {
    mount(component);
  });
  // it('Shows the correct message', function () {
  //   let wrap = mount(component);
  //   expect(wrap.find('Linkify').text()).toEqual(props.message.text)
  // });
  // it('Shows the correct create at time', function () {
  //   let wrap = mount(component);
  //   expect(wrap.find('span[name="createAtTime"]').text()).toEqual(time(props.message.createdAt))
  // });
})
