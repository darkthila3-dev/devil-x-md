const path = require('path');
const config = require('../config');
const { replyImage } = require('../lib/reply');

module.exports = {
  command: 'alive',
  description: 'Check if bot is online',
  handler: async ({ sock, msg, from }) => {
    const img = path.join(__dirname, '..', 'assets', 'alive.png');
    await replyImage(sock, from, img, `✅ ${config.BOT_NAME} is alive and running!`, msg);
  }
};
