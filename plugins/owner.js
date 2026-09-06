const config = require('../config');
const { reply } = require('../lib/reply');

module.exports = {
  command: ['owner', 'creator'],
  description: 'Show bot owner contact',
  handler: async ({ sock, msg, from }) => {
    await reply(sock, from, `👤 Owner: wa.me/${config.OWNER_NUMBER}`, msg);
  }
};
