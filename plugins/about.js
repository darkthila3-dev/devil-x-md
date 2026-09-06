const config = require('../config');
const { reply } = require('../lib/reply');

module.exports = {
  command: 'about',
  description: 'Show info about the bot',
  handler: async ({ sock, msg, from }) => {
    const text = `${config.BOT_NAME} — built on Node.js + Baileys.\nPrefix: ${config.PREFIX}\nType ${config.PREFIX}menu for commands.`;
    await reply(sock, from, text, msg);
  }
};
