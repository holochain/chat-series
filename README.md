# Chat Series
A series of branches that show the development of a full featured P2P Chat App with step by step instructions in the README.md file of what was done. As you work your way through the steps you can compare your work by selecting the branch for the step you are up to. Specific commits will also be referenced. The purpose is to enable developers to start with a very simple Chat hApp to get used to building Holocahin hApps and then work through the series as more and more features are built. The projected features will be:

- [ ] A simple straight up chat feed that only allows anyone to run it and add messages to a single stream of messages.
- [ ] The we will add # tags, @ mentions and ability to put images in messages
- [ ] Then we will add multiple conversations
- [ ] Next up is to integrate the Personas & Profiles hApp
- [ ] Then we will start to use the Capabilities Claims & Grants security model built into Holochain
- [ ] Next is the ability to add remove people from a capability
- [ ] At this stage the last feature will be the ability to add and remove DHT's enabling super secure and private chat room.

## Development Process

We will use a UI component first then Zome code with automated tests to build each feature of the hApp. UI components will be built with React and we will use Storybook to render the components in their various states which will define the data structures we need. Unit tests will be written as we develop to confirm the UI and the data structures. Once the UI states and data strutures are confirmed we will build the Holochain Zome using the scaffolding tools and write scenario tests with the Holochain test framework Try-O-Rama. A limited number of happy path End 2 End Integration tests will be written in Cypress.io.
This document will be like a blog series and along with the explicit code steps will contain discussion around why things were done.


