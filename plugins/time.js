const { reply } = require('../lib/reply');

module.exports = {
  command: ['time', 'date'],
  description: 'Show current date and time',
  handler: async ({ sock, msg, from }) => {
    const now = new Date();
    const formatted = now.toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'medium',
    });
    await reply(sock, from, `🕒 ${formatted}`, msg);
  }
};
