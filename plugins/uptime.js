const { reply } = require('../lib/reply');

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

module.exports = {
  command: ['uptime', 'runtime'],
  description: 'Show how long the bot has been running',
  handler: async ({ sock, msg, from }) => {
    await reply(sock, from, `⏱️ Uptime: ${formatUptime(process.uptime())}`, msg);
  }
};
