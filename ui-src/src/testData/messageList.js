const timestamp = new Date();

export const testMessages = [
  {
    id: 'messageid1',
    createdAt: timestamp.setMinutes(timestamp.getMinutes() - 90),
    text: 'Message 1'
  },
  {
    id: 'messageid2',
    createdAt: timestamp.setMinutes(timestamp.getMinutes() - 45),
    text: 'This is Bogan Ipsum text - Lizard drinking larrikin brickie cooee fruit loop coldie. How vinnie\'s too right sickie oldies and blow in the bag. Top end sook dunny mate schooner you little ripper roo bar cut lunch commando. Counter meal spag bol whinge lets get some dipstick thingo wuss drongo budgie smugglers. Aussie rules footy rip snorter dead horse ironman fruit loop turps coldie. Mate\'s rates down under pokies vinnie\'s pinga quid spewin\' fisho. Grog strides your shout esky jumbuck we\'re going dole bludger bundy. Throw-down brass razoo prezzy blowie ten clicks away my aussie rules footy. Dunny gone walkabout jackaroo porky holy dooley yakka barrack. To mozzie divvy van gobsmacked slacker dinky-di. Greenie barbie cark it ya drongo dole bludger flanno.'
  },
  {
    id: 'messageid3',
    createdAt: timestamp.setMinutes(timestamp.getMinutes() - 110),
    text: 'Step by Step instructions and discussions on how Peer Chat for Holochain was developed. See the GitHub.This Storybook has all of the components and tests of Peer Chat as it is developed. Use the branches in the repo to compare your work and see how Peer Chat looked at each stage as its gets more complete and implements more Holochain features. Use the View Port Control to view is different devices.'
  },
]
