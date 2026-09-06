const { reply } = require('../lib/reply');

module.exports = {
  command: 'jid',
  description: 'Show this chat\'s ID',
  handler: async ({ sock, msg, from }) => {
    await reply(sock, from, `🆔 Chat ID:\n${from}`, msg);
  }
};
