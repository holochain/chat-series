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
- Write a [new story](!https://holochain.github.io/chat-series/?path=/story/create-message-form--empty) in the *stories** folder 
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
- Test and [Create Message Form Story](!https://holochain.github.io/chat-series/?path=/story/create-message-form--empty) now work and you can see the specs in storybook and typing something in the form and clicking the arrow shows an action as well.

## Message List
Now that we have a way to crete a message let's make a list to show them in. Same approach we just used, create the folder and copy the css from Peer Chat for both Message and MessageList. The MessageList component will render a list of Message components.

- I wrote these tests for the Message component
```jsx
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
```
- I wrote one [story for the Message](!https://holochain.github.io/chat-series/?path=/story/message--with-message)
```jsx
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
```
- and this is the component 
```jsx
import React from 'react'
import style from './index.module.css'
import Linkify from 'react-linkify'

const time = timestamp => {
  const date = new Date(timestamp * 1000)
  const minutes = date.getMinutes()
  return `${date.getHours()}:${minutes < 10 ? '0' + minutes : minutes}`
}

export const Message = ({ message }) =>
  <li key={message.id} className={style.component}>
    <div>
      <span name='createAtTime'>{time(message.createdAt)}</span>
      <p>
        <Linkify properties={{ target: '_blank' }}>{message.text}</Linkify>
      </p>
    </div>
  </li>
  ```

Now we have a message component let's set up the List and write tests and Stories. Tests have a few more cases now and note how the Describe will match the Stories, this is so the Specs tab in Storybook shows the tests for the component in that state. this makes writing tests a bit more understandable as the tests relate to a specific state the component is in.

- Write the tests
```jsx
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
```
- Write the stories for the two options of has [messages](!https://holochain.github.io/chat-series/?path=/story/message-list--messages) and [no messages](!https://holochain.github.io/chat-series/?path=/story/message-list--no-messages)
```jsx
import React from 'react';
import { action } from '@storybook/addon-actions';
import { MessageList } from '../src/components/MessageList/index';
import { specs } from 'storybook-addon-specifications';
import { noMessageListTests } from '../src/components/MessageList/index.test'
import { messageListTests } from '../src/components/MessageList/index.test'
import { testMessages } from '../src/testData/messageList';
export default {
  title: 'Message List'
};

export const noMessages = () => {
  let props = {
    messages: []
  }
  const story = (
    <MessageList {...props} />
  );
  specs(() => noMessageListTests);
  return story;
}

noMessages.story = {
  name: 'No messages'
}

export const messages = () => {
  let props = {
    messages: testMessages
  }
  const story = (
    <MessageList {...props} />
  );
  specs(() => messageListTests);
  return story;
}

messages.story = {
  name: 'Messages'
}
```
- Write the component
```jsx 
import React from 'react'
import style from './index.module.css'
import { Message } from '../Message'

const emptyList = (
  <div className={style.empty}>
    <span role='img' aria-label='post'>
      📝
    </span>
    <h2>No Messages Yet</h2>
    <p>Be the first to post in this conversation!</p>
  </div>
)

export const MessageList = ({ messages = [] }) => (
  <ul id='messages' className={style.component}>
    {
      messages.length > 0 ? (
        <wrapper->
          {
            messages
              .sort((a, b) => { return b.createdAt - a.createdAt })
              .map(message => <Message message={message} />)
          }
        </wrapper->
      ) : (
        emptyList
      )
    }
  </ul>
)
```

Great we now have a way toi write a message and to show it in a list. Couple of other things I did was to put the test data in a separate file so it can be shared across the tests, stories and the welcome story. I modified the welcome story to show all the components as they will appear in the live application so we can see what it will [look like](!https://holochain.github.io/chat-series/?path=/story/welcome--to-peer-chat) and copied the index.css over from Peer Chat.
```jsx
import React from 'react';
import '../src/index.css'
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { CreateMessageForm } from '../src/components/CreateMessageForm/index';
import { Message } from '../src/components/Message/index';
import { MessageList } from '../src/components/MessageList/index';
import { testMessages } from '../src/testData/messageList';


export default {
  title: 'Welcome',
};

export const toPeerChat = () => {
  let messageListProps = {
    messages: testMessages
  }
  let createMessageFormprops = {
    sendMessage: action('Send the message')
  }

  const story = (
    <main>
      <section>
        <col->
          <a href="https://github.com/holochain/chat-series" alt="github repo for chat series"><h1>Peer Chat Developer Series</h1></a>
          <MessageList {...messageListProps} />
          <CreateMessageForm {...createMessageFormprops} />
        </col->
      </section>
    </main>
  );

    return story
};

toPeerChat.story = {
  name: 'to Peer Chat',
};
```

At this point the UI does everything we need, is fully unit tested and has Stories so anyone can, including us, can see exactly what each component does. We also know that our message entry to store in Holochain looks like:
```json=
{
    id: 'messageid1',
    createdAt: timestamp.setMinutes(timestamp.getMinutes() - 90),
    text: 'Message 1'
  }
```
And we need a create message and a list messages function in our zome.