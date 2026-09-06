const path = require('path');
const { replyImage } = require('../lib/reply');

module.exports = {
  command: 'ping',
  description: 'Check bot response speed',
  handler: async ({ sock, msg, from }) => {
    const start = Date.now();
    await sock.sendMessage(from, { text: 'Pinging...' }, { quoted: msg });
    const end = Date.now();

    const img = path.join(__dirname, '..', 'assets', 'ping.png');
    await replyImage(sock, from, img, `🏓 Pong! ${end - start}ms`, msg);
  }
};
