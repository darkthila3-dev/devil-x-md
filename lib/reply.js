const fs = require('fs');
const config = require('../config');

/**
 * Builds the standard footer block appended to every command's output.
 * Matches the "© Powered By <name>" style with a closing emoji.
 */
function footerText() {
  return `\n\n© *Powered By ${config.FOOTER}*\n🍭`;
}

/**
 * Sends a text message with the bot footer appended.
 */
async function reply(sock, from, text, quoted, mentions) {
  const withFooter = `${text}${footerText()}`;
  const content = mentions ? { text: withFooter, mentions } : { text: withFooter };
  return sock.sendMessage(from, content, quoted ? { quoted } : {});
}

/**
 * Sends a local image file with a caption (footer appended).
 * imagePath is a path to a local file, e.g. path.join(__dirname, '..', 'assets', 'menu.png')
 */
async function replyImage(sock, from, imagePath, caption, quoted) {
  const withFooter = `${caption}${footerText()}`;
  return sock.sendMessage(
    from,
    { image: fs.readFileSync(imagePath), caption: withFooter },
    quoted ? { quoted } : {}
  );
}

/**
 * Sends an image from a remote URL with a caption (footer appended).
 * Use this for generated/downloaded images instead of a local file path.
 */
async function replyImageUrl(sock, from, imageUrl, caption, quoted) {
  const withFooter = `${caption}${footerText()}`;
  return sock.sendMessage(
    from,
    { image: { url: imageUrl }, caption: withFooter },
    quoted ? { quoted } : {}
  );
}

/**
 * Sends a video from a remote URL with a caption (footer appended).
 */
async function replyVideoUrl(sock, from, videoUrl, caption, quoted) {
  const withFooter = `${caption}${footerText()}`;
  return sock.sendMessage(
    from,
    { video: { url: videoUrl }, caption: withFooter },
    quoted ? { quoted } : {}
  );
}

module.exports = { reply, replyImage, replyImageUrl, replyVideoUrl, footerText };
