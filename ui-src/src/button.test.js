import React from 'react';
import { shallow, mount } from 'enzyme';
import { Button } from '@storybook/react/demo';

export const buttonTests = describe('Text', function () {
  const component = (
    <Button>
      Hello World
    </Button>
  );
  it('Should have the Hello World label', function () {
    let wrap = mount(component);
    expect(wrap.text()).toContain('Hello World');
  });
})
