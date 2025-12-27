const intents = require('./intents.json')

function detectIntent(message) {
  message = message.toLowerCase()

  for (const intent in intents) {
    for (const keyword of intents[intent]) {
      if (message.includes(keyword)) {
        return intent
      }
    }
  }
  return 'default'
}

module.exports = detectIntent
