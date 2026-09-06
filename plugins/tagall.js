const { reply } = require('../lib/reply');

module.exports = {
  command: ['tagall', 'everyone'],
  description: 'Mention all members in a group',
  handler: async ({ sock, msg, from, args }) => {
    if (!from.endsWith('@g.us')) {
      await reply(sock, from, '⚠️ This command only works in groups.', msg);
      return;
    }

    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants.map(p => p.id);
    const note = args.join(' ') || 'Tagging everyone';

    const mentionText = participants.map(id => `@${id.split('@')[0]}`).join(' ');
    await reply(sock, from, `${note}\n\n${mentionText}`.trim(), msg, participants);
  }
};
