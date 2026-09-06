const config = require('../config');
const { replyImageUrl, reply } = require('../lib/reply');

module.exports = {
  command: ['gen', 'imagine'],
  description: 'Generate an AI image from a text prompt',
  handler: async ({ sock, msg, from, args }) => {
    const prompt = args.join(' ');

    if (!prompt) {
      await reply(sock, from, `⚠️ Usage: ${config.PREFIX}gen <describe the image>`, msg);
      return;
    }

    await sock.sendMessage(from, { text: '🎨 Generating your image...' }, { quoted: msg });

    try {
      // Pollinations.ai — free, no API key needed. seed randomizes the result per request.
      const seed = Math.floor(Math.random() * 100000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&nologo=true`;

      const caption =
        `🧚⭕*${config.BOT_NAME.toUpperCase()} IMAGE GENERATOR*🎨🧚\n\n` +
        `📝 *Prompt:* ${prompt}`;

      await replyImageUrl(sock, from, imageUrl, caption, msg);
    } catch (err) {
      console.error('[GEN ERROR]', err.message);
      await reply(sock, from, '❌ Image generation failed. Try a different prompt or try again shortly.', msg);
    }
  }
};
