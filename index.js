const express = require('express');
const path = require('path');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');

const config = require('./config');
const { loadPlugins } = require('./lib/pluginLoader');
const { reply } = require('./lib/reply');

let plugins = loadPlugins();
let sock;
let pendingPairNumber = null;

// ---------- Web server (pairing site + API) ----------
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/pair', async (req, res) => {
  const { number } = req.body;

  if (!number || !/^\d{8,15}$/.test(number)) {
    return res.status(400).json({ error: 'Invalid number format.' });
  }

  if (sock?.authState?.creds?.registered) {
    return res.json({ alreadyConnected: true });
  }

  try {
    pendingPairNumber = number;
    const code = await sock.requestPairingCode(number);
    return res.json({ code });
  } catch (err) {
    console.error('[PAIR ERROR]', err.message);
    return res.status(500).json({ error: 'Failed to generate pairing code. Try again.' });
  }
});

app.listen(config.PORT, () => {
  console.log(`🌐 Pairing site running at http://localhost:${config.PORT}`);
});

// ---------- WhatsApp bot ----------
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false, // pairing happens through the web site instead
    browser: [config.BOT_NAME, 'Chrome', '1.0.0'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) startBot();
      else console.log('Logged out. Delete /session and pair again via the web site.');
    } else if (connection === 'open') {
      console.log(`✅ ${config.BOT_NAME} connected successfully!`);
      pendingPairNumber = null;
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption ||
      '';

    // Owner hot-reload: send ".reload"
    if (body === `${config.PREFIX}reload`) {
      const sender = msg.key.participant || from;
      if (sender.includes(config.OWNER_NUMBER)) {
        plugins = loadPlugins();
        await reply(sock, from, '🔄 Plugins reloaded.', msg);
        return;
      }
    }

    if (!body.startsWith(config.PREFIX)) return;

    const args = body.slice(config.PREFIX.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const plugin = plugins.get(cmdName);
    if (!plugin) return;

    try {
      await plugin.handler({ sock, msg, from, args, body });
    } catch (err) {
      console.error(`[COMMAND ERROR] ${cmdName}:`, err);
      await reply(sock, from, '⚠️ Command execution failed.', msg);
    }
  });

  return sock;
}

startBot().catch((err) => console.error('Fatal error starting bot:', err));
