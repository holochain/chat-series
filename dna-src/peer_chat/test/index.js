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
  const all_messages = await alice.call("chat", "chat", "get_messages", {});
  t.deepEqual(all_messages.Ok.length, 2);
})

orchestrator.run()
