const path = require('path');
const config = require('../config');
const { replyImage } = require('../lib/reply');

module.exports = {
  command: ['menu', 'help'],
  description: 'Show bot menu',
  handler: async ({ sock, msg, from }) => {
    const text = `
╭───「 *${config.BOT_NAME}* 」
│ ▢ ${config.PREFIX}menu
│ ▢ ${config.PREFIX}ping
│ ▢ ${config.PREFIX}alive
│ ▢ ${config.PREFIX}uptime
│ ▢ ${config.PREFIX}owner
│ ▢ ${config.PREFIX}about
│ ▢ ${config.PREFIX}jid
│ ▢ ${config.PREFIX}time
│ ▢ ${config.PREFIX}tagall
│ ▢ ${config.PREFIX}groupinfo
│ ▢ ${config.PREFIX}tiktok <url>
│ ▢ ${config.PREFIX}fb <url>
│ ▢ ${config.PREFIX}gen <prompt>
╰────────────────

Add your own commands inside /plugins
    `.trim();

    const img = path.join(__dirname, '..', 'assets', 'menu.png');
    await replyImage(sock, from, img, text, msg);
  }
};
