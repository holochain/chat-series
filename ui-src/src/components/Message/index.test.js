import React from 'react';
import { mount } from 'enzyme';
import { Message } from './index';

export const messageTests = describe('With message', function () {
  let props = {
    message: {
      id: 'messageid',
      createdAt: Date.now(),
      text: 'Here is the message text'
    }
  }
  const time = timestamp => {
    const date = new Date(timestamp * 1000)
    const minutes = date.getMinutes()
    return `${date.getHours()}:${minutes < 10 ? '0' + minutes : minutes}`
  }
  const component = (
    <Message {...props}/>
  );
  it('Renders witout crashing', function () {
    mount(component);
  });
  it('Shows the correct message', function () {
    let wrap = mount(component);
    expect(wrap.find('Linkify').text()).toEqual(props.message.text)
  });
  it('Shows the correct create at time', function () {
    let wrap = mount(component);
    expect(wrap.find('span[name="createAtTime"]').text()).toEqual(time(props.message.createdAt))
  });
})
