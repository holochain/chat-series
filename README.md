# Developing a Full Featured P2P Chat hApp for Holochain - Series
> [name="Philip Beadle"]
## Introduction
Over the last 18 months or so I have been building various hApps to demonstrate various Holochain features and to test out Holochain from a hApp developers point of view. Most of that work was done in the [Identity Manager](!https://github.com/holochain/identity-manager/) and various iterations of a chat hApp. Both of these hApps have now become quite complicated as they implement a large number of Holochain features and have had to be refactored as Holochain evolved. Thus they are not really useful as teaching tools and do not provide a navigable path to becoming a Holochain hApp developer. Whilst the team was in Barcelona November 2019 we came upm with the idea of a series of chat hApps that progressively add features to become a full featured chat hApp using a series of branches that show the development with step by step instructions in the README.md file of what was done. This README.md will be like a blog series and along with the explicit code steps will contain discussion around why things were done. The hApp will be built so that it runs in a development environment, in Holo and also Holoscape.

The **master** branch contains the latest code containing all of the work done so please remember to start from the **lets-get-started** branch. The [Holochain Documentation](!https://developer.holochain.org/docs/) and [hdk API](!https://docs.rs/hdk/0.0.40-alpha1/hdk/) will be referenced and you should familiarise yourself with [Holochain](!https://developer.holochain.org/docs/) the [Core Concepts](!https://developer.holochain.org/docs/concepts/), how to [install](!https://developer.holochain.org/docs/install) and the [tutorials](!https://developer.holochain.org/docs/tutorials/coreconcepts) before you attempt to follow this development journey. 
As you work your way through the steps you can compare your work by selecting the branch for the step you are up to. Specific commits will also be referenced. The purpose is to enable developers to start with a very simple Chat hApp to get used to building Holochain hApps and then work through the series as more and more features are built. The projected features will be:

- [ ] A simple straight up chat feed that only allows anyone to run it and add messages to a single stream of messages.
- [ ] Next is to add a "handle" and "avatar" to distinguish which Agent wrote the message
- [ ] The we will add # tags, @ mentions and ability to put images in messages
- [ ] Then we will add multiple conversations
- [ ] Next up is to integrate the Personas & Profiles hApp
- [ ] Then we will start to use the Capabilities Claims & Grants security model built into Holochain
- [ ] Next is the ability to add remove people from a capability
- [ ] At this stage the last feature will be the ability to add and remove DHT's enabling super secure and private chat room.

## Development Process

We will use a UI component first then Zome code with automated tests to build each feature of the hApp. UI components will be built with React and we will use Storybook to render the components in their various states which will define the data structures we need. Unit tests will be written as we develop to confirm the UI and the data structures. Once the UI states and data strutures are confirmed we will build the Holochain Zome using the scaffolding tools and write scenario tests with the Holochain test framework Try-O-Rama. A limited number of happy path End 2 End Integration tests will be written in Cypress.io.

Please remember I am assuming you know how to use the tools I am uisng, please read their various docs.


## Let's get started

We will be developing the UI and DNA in the same repo and be using the holonix nix-shell and **npm** to simplify the terminal commands speed up development. If you have no idea what that means please go read the developer docs referenced above.

- [ ] Create 2 folders **ui-src** & **dna-src**
- [ ] Run nix-shell ```nix-shell https://holochain.love```
- [ ] Initialise npm in the root folder ```npm init```
- [ ] Install React ```npx create-react-app . ``` & Storybook ``` npx -p @storybook/cli sb init --type react ``` in the **ui-src** folder
- [ ] Check they both work ```yarn start``` & ```yarn storybook```

Storybook uses a new Component Story Format which is a lot more concise than previous versions and they are working on using MDX sa a way of writing live docs.
Next thing is to set up to be able to write a unit test with Enzyme that can both run in Storybook and Jest.
- [ ] Install Enzyme ```yarn add -D enzyme enzyme-adapter-react-16```
- [ ] Install the Storybook addon ```yarn add -D storybook-addon-specifications```
- [ ] Add this line to your addons.js ```import 'storybook-addon-specifications/register';```

Firstly we'll get a simple spec running on the existing button story in **ui-src/stories/1-Button.stories.js**

```jsx 
import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { specs, describe, it } from 'storybook-addon-specifications';
import { shallow, mount } from 'enzyme';
import expect from 'expect';
import { configure as enzymeConfigure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

enzymeConfigure({ adapter: new Adapter() })

export default {
  title: 'Button'
};

export const text = () => {
  const story = (
    <Button onClick={action('Hello World')}>
      Hello World
    </Button>
  );

  specs(() => describe('Text', function () {
    it('Should have the Hello World label', function () {
      let wrap = shallow(story);
      expect(wrap.text()).toContain('Hello World');
    });
  }));

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

```
Now we will move that test into a test folder so Jest can run it too.

- Add a setupTests.js file and move the Enzyme config to there.
```jsx
import { configure as enzymeConfigure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
enzymeConfigure({ adapter: new Adapter() });
```
- Add a button.test.js file to the src folder
```jsx
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
```
- Import the button.test.js into the story ```import { buttonTests } from '../src/button.test'```
- Change the specs to ```specs(() => buttonTests);```

You can now run the tests with ```yarn test``` and they will also show up as specs in Storybook.

At this poiunt your code should look like https://github.com/holochain/chat-series/tree/9fa63370fe3b002a4f86b0d2ff8fb6a7b3463463

## Create Message Form
let's start building the chat interface. First thing to build is a way to create a message.

This is what I did:
- Create a folder called **components/CreateMessageForm**
- Copy the **index.module.css** file from the Peer Chat [repo](!https://github.com/holochain/peer-chat/tree/develop/ui-src/src/components/CreateMessageForm)
- Create an index.test.js file with 
```jsx
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
```
- run ```yarn test``` which will fail as there is no comonent yet
- Write a new story in the *stories** folder 
```jsx=
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
```
- Create the component **index.js**
```jsx
import React from 'react'
import style from './index.module.css'

export const CreateMessageForm = ({
  sendMessage
}) =>
    <form
      className={style.component}
      onSubmit={e => {
        e.preventDefault()
        const message = e.target[0].value.trim()
        if (message.length === 0) {
          return
        }
        e.target[0].value = ''
        sendMessage({
            text: message
          })
      }}
    >
      <input
        placeholder='Type a Message..'
      />
      <button type='submit'>
        <svg>
          <use xlinkHref='index.svg#send' />
        </svg>
      </button>
    </form>
```
- Test and Story now work and you can see the specs in storybook and typing somehting in the form and clicking the arrow shows an action as well.