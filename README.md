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
- [ ] 
