const { fbdown } = require('btch-downloader');
const { reply, replyVideoUrl } = require('../lib/reply');
const config = require('../config');

module.exports = {
  command: ['facebook', 'fb'],
  description: 'Download a Facebook video',
  handler: async ({ sock, msg, from, args }) => {
    const url = args[0];

    if (!url || !url.includes('facebook.com') && !url.includes('fb.watch')) {
      await reply(sock, from, `⚠️ Usage: ${config.PREFIX}fb <facebook video url>`, msg);
      return;
    }

    await sock.sendMessage(from, { text: '⏳ Fetching Facebook video...' }, { quoted: msg });

    try {
      const data = await fbdown(url);
      const videoUrl = data?.HD || data?.Normal_video;

      if (!videoUrl) {
        await reply(sock, from, '❌ Could not fetch this Facebook video. It may be private or the link is invalid.', msg);
        return;
      }

      await replyVideoUrl(sock, from, videoUrl, '📥 Downloaded from Facebook', msg);
    } catch (err) {
      console.error('[FB ERROR]', err.message);
      await reply(sock, from, '❌ Failed to download. The Facebook downloader API may be temporarily down.', msg);
    }
  }
};
