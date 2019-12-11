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

Please remember I am assuming you know how to use the tools I am uisng, please read their various docs. I am also publishing the Storybook as I go to [Github Pages](!https://holochain.github.io/chat-series) so you can see each component, each state it can be in and the unit tests for that state.


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
And we need a create message and a list messages function in our zome. Follow the steps in the tutorial https://developer.holochain.org/docs/tutorials/coreconcepts/hello_holo/ but make the project name **peer_chat** and the zome **chat**
- Now update the structs and zome names etc in the generated lib.rs file to reflect the entry we designed above.
```rust
#![feature(proc_macro_hygiene)]
#[macro_use]
extern crate hdk;
extern crate hdk_proc_macros;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;
#[macro_use]
extern crate holochain_json_derive;

use hdk::{
    entry_definition::ValidatingEntryType,
    error::ZomeApiResult,
};
use hdk::holochain_core_types::{
    entry::Entry,
    dna::entry_types::Sharing,
};

use hdk::holochain_json_api::{
    json::JsonString,
    error::JsonError
};

use hdk::holochain_persistence_api::{
    cas::content::Address
};

use hdk_proc_macros::zome;

#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
#[serde(rename_all = "camelCase")]
pub struct Message {
    id: String,
    created_at: u32,
    text: String
}

#[zome]
mod chat {

    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        Ok(())
    }

    #[entry_def]
     fn message_entry_def() -> ValidatingEntryType {
        entry!(
            name: "message",
            description: "The message in a chat list",
            sharing: Sharing::Public,
            validation_package: || {
                hdk::ValidationPackageDefinition::Entry
            },
            validation: | _validation_data: hdk::EntryValidationData<Message>| {
                Ok(())
            }
        )
    }

    #[zome_fn("hc_public")]
    fn post_message(entry: Message) -> ZomeApiResult<Address> {
        let entry = Entry::App("message".into(), entry.into());
        let address = hdk::commit_entry(&entry)?;
        Ok(address)
    }

    #[zome_fn("hc_public")]
    fn get_message(address: Address) -> ZomeApiResult<Option<Entry>> {
        hdk::get_entry(&address)
    }
}

```
- run ```hc package``` to make sure it builds
- Update the generated test and run it ```hc test```
```jsx
const path = require('path')
const tape = require('tape')

const { Orchestrator, Config, tapeExecutor, singleConductor, combine  } = require('@holochain/try-o-rama')

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.error('got unhandledRejection:', error);
});

const dnaPath = path.join(__dirname, "../dist/peer_chat.dna.json")

const orchestrator = new Orchestrator({
  middleware: combine(
    // squash all instances from all conductors down into a single conductor,
    // for in-memory testing purposes.
    // Remove this middleware for other "real" network types which can actually
    // send messages across conductors
    singleConductor,

    // use the tape harness to run the tests, injects the tape API into each scenario
    // as the second argument
    tapeExecutor(require('tape'))
  ),

  globalConfig: {
    logger: false,
    network: {
      type: 'sim2h',
      sim2h_url: 'wss://localhost:9000'
    }
  },

  // the following are optional:

  waiter: {
    softTimeout: 5000,
    hardTimeout: 10000,
  },
})

const conductorConfig = {
  instances: {
    chat: Config.dna(dnaPath, 'scaffold-test')
  }
}

orchestrator.registerScenario("Post a message and check it can be retrieved.", async (s, t) => {

  const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig})

  // Make a call to a Zome function
  // indicating the function, and passing it an input
  const addr = await alice.call("chat", "chat", "post_message", {"entry" : {"id": "messageId1", "createdAt": 1234567, "text": "A test message"}})
  // Wait for all network activity to
  await s.consistency()

  const result = await alice.call("chat", "chat", "get_message", {"address": addr.Ok})

  // check for equality of the actual and expected results
  t.deepEqual(result, { Ok: { App: [ 'message', '{"id":"messageId1","createdAt":1234567,"text":"A test message"}' ] } })
})

orchestrator.run()

```

Cool now we can com mit an entry and retrieve if we know the Address, sort of useful but our UI design is to retrieve a list of messages. To do this we need to link our posted messages to soemthing we call an anchor. There is a new crate called **holochin_anchors** that we can use to create the anchor that we will link the posted messags from. Then we can write a new function to get all the messages.

I'm using 0.0.40-alpha1 that I built locally from the holocahin-rust repo as I need a fix that's not in the Holonix version yet. To make sure yarn runs the right binary my package.json scripts looks like this, note the **TRYORAMA_HOLOCHAIN_PATH** variable.

```json
  "scripts": {
    "test": "cd dna-src/peer_chat && TRYORAMA_HOLOCHAIN_PATH=~/holochain/Holochain/holochain-rust/.cargo/bin/holochain ~/holochain/Holochain/holochain-rust/.cargo/bin/hc test",
    "build": "cd dna-src/peer_chat && ~/holochain/Holochain/holochain-rust/.cargo/bin/hc package"
  },
```

- Add the rust dependency to the cargo.toml file 
```rust
holochain_anchors = "0.1.1"
```
- In the lib.rs file add the hdk prelude for LinkMatch
```rust
use hdk::prelude::LinkMatch;
```
- Add the entry definitions for the anchor
```rust
    #[entry_def]
    fn anchor_def() -> ValidatingEntryType {
        holochain_anchors::anchor_definition()
    }
    
    #[entry_def]
    fn root_anchor_def() -> ValidatingEntryType {
        holochain_anchors::root_anchor_definition()
    }
```
- Update the message entry def to be able to link from the achor
```rust
#[entry_def]
     fn message_entry_def() -> ValidatingEntryType {
        entry!(
            name: "message",
            description: "The message in a chat list",
            sharing: Sharing::Public,
            validation_package: || {
                hdk::ValidationPackageDefinition::Entry
            },
            validation: | _validation_data: hdk::EntryValidationData<Message>| {
                Ok(())
            },
            links: [
                from!(
                    holochain_anchors::ANCHOR_TYPE,
                    link_type: "motorcycle_link_to",
                    validation_package: || {
                        hdk::ValidationPackageDefinition::Entry
                    },

                    validation: |_validation_data: hdk::LinkValidationData| {
                        Ok(())
                    }
                )
            ]
        )
    }
```
Now add the code to Post a new message, get a message by its Address and also get all messages linked to the Anchor.
```rust
#[zome_fn("hc_public")]
    fn post_message(entry: Message) -> ZomeApiResult<Address> {
        let entry = Entry::App("message".into(), entry.into());
        let address = hdk::commit_entry(&entry)?;
        let anchor_address = holochain_anchors::create_anchor("messages".into(), "mine".into())?;
        hdk::link_entries(&anchor_address, &address, "message_link_to", "")?;
        Ok(address)
    }

    #[zome_fn("hc_public")]
    fn get_message(address: Address) -> ZomeApiResult<Option<Entry>> {
        hdk::get_entry(&address)
    }

    #[zome_fn("hc_public")]
    fn get_messages(anchor_type: String, anchor_text: String) -> ZomeApiResult<Vec<Message>> {
        let anchor_address = holochain_anchors::create_anchor(anchor_type, anchor_text)?;
        hdk::utils::get_links_and_load_type(&anchor_address, LinkMatch::Exactly("message_link_to"), LinkMatch::Any)
    }
```
Now let's test our code with Try-O-Rama the Holochain test framework. It's very similar to other frameworks like Mocha. The code below sets up the singleConductor to use sim2h_server and runs 3 tests with the Alice player.

```jsx
const path = require('path')
const tape = require('tape')
const { Orchestrator, Config, tapeExecutor, singleConductor, combine  } = require('@holochain/try-o-rama')

process.on('unhandledRejection', error => {
  console.error('got unhandledRejection:', error);
});

const dnaPath = path.join(__dirname, "../dist/peer_chat.dna.json")

const orchestrator = new Orchestrator({
  middleware: combine(
    singleConductor,
    tapeExecutor(require('tape'))
  ),
  globalConfig: {
    logger: false,
    network: {
      type: 'sim2h',
      sim2h_url: 'wss://localhost:9000'
    }
  },
  waiter: {
    softTimeout: 5000,
    hardTimeout: 10000,
  },
})

const conductorConfig = {
  instances: {
    chat: Config.dna(dnaPath, 'chat-series')
  }
}

orchestrator.registerScenario("Post a message.", async (s, t) => {
  const {alice} = await s.players({alice: conductorConfig})
  const addr = await alice.call("chat", "chat", "post_message", {"entry" : {"id": "messageId1", "createdAt": 1234567, "text": "A test message"}})
  await s.consistency()
  t.deepEqual(addr.Ok.length, 46)
})

orchestrator.registerScenario("Post a message and check it can be retrieved.", async (s, t) => {
  const {alice} = await s.players({alice: conductorConfig})
  const addr = await alice.call("chat", "chat", "post_message", {"entry" : {"id": "messageId1", "createdAt": 1234567, "text": "A test message"}})
  await s.consistency()
  const result = await alice.call("chat", "chat", "get_message", {"address": addr.Ok})
  t.deepEqual(result, { Ok: { App: [ 'message', '{"id":"messageId1","createdAt":1234567,"text":"A test message"}' ] } })
})

orchestrator.registerScenario("Post two messages and check they can be listed.", async (s, t) => {
  const {alice} = await s.players({alice: conductorConfig})
  const addr = await alice.call("chat", "chat", "post_message", {"entry" : {"id": "messageId1", "createdAt": 1234567, "text": "A test message"}})
  await alice.call("chat", "chat", "post_message", {"entry" : {"id": "messageId2", "createdAt": 1234568, "text": "A second test message"}})
  await s.consistency()
  const all_messages = await alice.call("chat", "chat", "get_messages", {"anchor_type": "messages", "anchor_text": "mine"});
  t.deepEqual(all_messages.Ok.length, 2);
})

orchestrator.run()
```
Awesome, the zome code meets the requirements for the UI. One of the reasons I love using Storybook is that I can develop my "Welcome" story to show all of the built components. Not only does this make it easy to see what the app is looking like but i can then either make a layout component or just copy the code over to the "live" app. This is my Welcome story for this first stage of a Super Basic Chat.
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
  name: 'Super Basic Chat',
};
```
Next thing is to update the App.js file to show our shiny new components
```jsx
import React from 'react';
import logo from './logo.svg';
import './index.css'
import { CreateMessageForm } from './components/CreateMessageForm/index';
import { Message } from './components/Message/index';
import { MessageList } from './components/MessageList/index';
import { testMessages } from './testData/messageList';

function App() {
  let messageListProps = {
    messages: testMessages
  }
  let createMessageFormprops = {
    sendMessage: () => {}
  }
  return (
    <main>
      <section>
        <col->
          <MessageList {...messageListProps} />
          <CreateMessageForm {...createMessageFormprops} />
        </col->
      </section>
    </main>
  );
}

export default App;
```
And run ```yarn start```

## Connecting the UI to the Holochain Conductor

Our hApp is looking good so far in test and component library mode so let's turn it into a complete hApp by connecting the UI to a running Holochain conductor.

### Get a conductor running

- Create a test agent key with no passphrase in your root directory
 ```
    hc keygen -n --path ./agent1.keystore
```
- Create a conductor-config.toml in the root and add (make sure you use the Public address you generated)
```rust
    # -----------  Agents  -----------
    [[agents]]
      id = "test_agent1"
      name = "Agent 1"
      public_address = "HcSCJzVFVEJ3aarhscwK7KRN84A5TxsdkWPTs38oQJs3oon4rGj6YHtOFr3xnga"
      keystore_file = "./agent1.keystore"
```
- Package your DNA ```yarn package```
    > I added the following script
    > ```json= 
    > "package": "cd dna-src/peer_chat && ~/holochain/Holochain/holochain-rust/.cargo/bin/hc package",
    > ```

- and add the DNA section to the config
```rust
    # -----------  DNAs  -----------
    [[dnas]]
      id = "Peer Chat"
      file = "./dna-src/peer_chat/dist/peer_chat.dna.json"
      hash = "QmRKwm988KKHTSsELCqfk1rNjQ3jckHbAACzpR4wNeC7MB"
```
- Add an instance of your DNA for your Agent and set it's storage to memory
    > good for testing as it resets each time you stop the conductor
```rust
    [[instances]]
      id = "peer-chat"
      dna = "Peer Chat"
      agent = "test_agent1"
    [instances.storage]
      type = "memory"
```
- Configure thee websocket so the UI can connect to the conductor on PORT:3401
```rust
    [[interfaces]]
      id = "websocket_interface"
      admin = true
    [interfaces.driver]
      type = "websocket"
      port = 3401
    [[interfaces.instances]]
      id = "peer-chat"
```
- Lastly set up the same networking we used in the Try-O-Rama tests
  > You will need to run your own sim2h_server
```rust
    # -----------  Networking  -----------

    [network]
      type = "sim2h"
      sim2h_url = 'wss://localhost:9000'
```
- Run the conductor ```yarn conductor```
    > I added the following script
    > ```json
    > "conductor": "~/holochain/Holochain/holochain-rust/.cargo/bin/holochain -c ./conductor-config.toml"
    > ```

### Connect UI to conductor
> I fixed the list rendering issue by moving the key to the MessageList.
> ```jsx
> ....
>  <wrapper->
>    {
>      messages
>       .sort((a, b) => { return b.createdAt - a.createdAt })
>       .map(message => <Message key={message.id} message={message} />)
>    }
>  </wrapper->
> .....
> ```

First thing I want to do is the minimal code to be able to post a message to Holochain and prove it worked by logging the returned message Address.
We are going to modify the index.js to do the connection setup and set properties for the rest of the components.

- First update app.js to accept properties
```jsx
    ...
    export const App = ({ sendMessage, messages }) => (
      <main>
        <section>
          <col->
            <MessageList messages={messages} />
            <CreateMessageForm sendMessage={sendMessage} />
          </col->
        </section>
      </main>
    );
    ...
```
- Install **@holochain/hc-web-client**
- Do your imports and set up a debug Process variable for the websocket connection. When we use Holoscape the connection is automatically setup for you.
```jsx
    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import App from './App';
    import * as serviceWorker from './serviceWorker';
    import { connect } from '@holochain/hc-web-client'
    import { testMessages } from './testData/messageList';

    const REACT_APP_WEBSOCKET_INTERFACE = process.env.REACT_APP_WEBSOCKET_INTERFACE; // Use for debug
```
- In the constructor we will create the connection and store it in state and create an **action** that will be the sendMessage function whcih will log the result of our zome call.
```jsx
    export class View extends React.Component {
      constructor (props) {
        super(props)
        let connectUrl = {};
        if(REACT_APP_WEBSOCKET_INTERFACE){
          connectUrl = { url: REACT_APP_WEBSOCKET_INTERFACE }
        };
        this.state = {
          holochainConnection: connect(connectUrl),
          messages: testMessages
        };
        this.actions = {
          sendMessage: ({ text }) => {
            const message = {
              id: 'text',
              createdAt: Math.floor(Date.now() / 1000),
              text: text
            };
            console.log(message);
            this.makeHolochainCall('peer-chat/chat/post_message', {message}, (result) => {
              console.log('message posted', result);
            });
          }
        };
      };
 ```
 - Now we render the App and make a function to simplify calling the zome
```jsx
      makeHolochainCall (callString, params, callback) {
        const [instanceId, zome, func] = callString.split('/')
        this.state.holochainConnection.then(({ callZome }) => {
          callZome(instanceId, zome, func)(params).then((result) => callback(JSON.parse(result)))
        });
      };

      render () {
        let props = {
          messages: this.state.messages,
          sendMessage: this.actions.sendMessage
        }
        return (
          <App {...props} />
        );
      };
    }
```
You can now run the UI which will connect to the running conductor and post a message 😎

### List the messages

Now we can post messages let's show them in the MessageList component.
> I modified the Zome so get_messages uses the same anchor as post_message
> ```rust
> #[zome_fn("hc_public")]
>    fn get_messages() -> ZomeApiResult<Vec<Message>> {
>        let anchor_address = holochain_anchors::create_anchor("messages".into(), "mine".into())?;
>        hdk::utils::get_links_and_load_type(&anchor_address, LinkMatch::Exactly("message_link_to"), LinkMatch::Any)
>    }
> ```

When the hApp first starts up I want to list all of the messages and when a new message is posted add it to the feed.

- Use the React ComponentDidMount to get all the messages and add them to the state
```jsx
    componentDidMount () {
        this.state.holochainConnection.then(({ callZome }) => {
          console.log('Connected to Holochain Conductor');
          this.setState({ connected: true });
          callZome('peer-chat', 'chat', 'get_messages')({}).then((result) => {
            console.log('List of Messages ' + JSON.parse(result));
            this.setState({ messages: JSON.parse(result).Ok });
          })
        });
      };
 ```
 - Add the new message to the state in the sendMessage function
```jsx
    sendMessage: ({ text }) => {
        const message = {
          id: 'text',
          createdAt: Math.floor(Date.now() / 1000),
          text: text
        }
        this.setState({
          messages: [ ...this.state.messages, message ]
        })
        this.makeHolochainCall('peer-chat/chat/post_message', {message}, (result) => {
          console.log('message posted', result);
        })
    }
 ```
Now when you run the UI any messages will appear and new ones will too. 
We have now built the most simple chat hApp I could think of, but it shows off the process and all the bits we need to continue building a more useful chat hApp.