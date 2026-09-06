const { ttdl } = require('btch-downloader');
const { reply, replyVideoUrl } = require('../lib/reply');
const config = require('../config');

module.exports = {
  command: ['tiktok', 'tt'],
  description: 'Download a TikTok video (no watermark)',
  handler: async ({ sock, msg, from, args }) => {
    const url = args[0];

    if (!url || !url.includes('tiktok.com')) {
      await reply(sock, from, `⚠️ Usage: ${config.PREFIX}tiktok <tiktok video url>`, msg);
      return;
    }

    await sock.sendMessage(from, { text: '⏳ Fetching TikTok video...' }, { quoted: msg });

    try {
      const data = await ttdl(url);
      const videoUrl = data?.video?.[0];

      if (!videoUrl) {
        await reply(sock, from, '❌ Could not fetch this TikTok video. It may be private or the link is invalid.', msg);
        return;
      }

      await replyVideoUrl(sock, from, videoUrl, `🎵 ${data.title || 'TikTok video'}`, msg);
    } catch (err) {
      console.error('[TIKTOK ERROR]', err.message);
      await reply(sock, from, '❌ Failed to download. The TikTok downloader API may be temporarily down.', msg);
    }
  }
};
