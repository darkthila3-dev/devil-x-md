const { reply } = require('../lib/reply');

module.exports = {
  command: ['groupinfo', 'ginfo'],
  description: 'Show group name, member count, and description',
  handler: async ({ sock, msg, from }) => {
    if (!from.endsWith('@g.us')) {
      await reply(sock, from, '⚠️ This command only works in groups.', msg);
      return;
    }

    const metadata = await sock.groupMetadata(from);
    const text = `📌 *${metadata.subject}*\nMembers: ${metadata.participants.length}\n${metadata.desc ? `\n${metadata.desc}` : ''}`;
    await reply(sock, from, text.trim(), msg);
  }
};
