const fs = require('fs');
const path = require('path');

function loadPlugins() {
  const plugins = new Map();
  const pluginsDir = path.join(__dirname, '..', 'plugins');

  const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));

  for (const file of files) {
    try {
      delete require.cache[require.resolve(path.join(pluginsDir, file))];
      const plugin = require(path.join(pluginsDir, file));

      if (!plugin || !plugin.command) {
        console.log(`[PLUGIN SKIP] ${file} — no "command" export`);
        continue;
      }

      const commands = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      for (const cmd of commands) {
        plugins.set(cmd.toLowerCase(), plugin);
      }
    } catch (err) {
      console.error(`[PLUGIN ERROR] Failed loading ${file}:`, err.message);
    }
  }

  console.log(`[PLUGINS] Loaded ${plugins.size} command(s) from ${files.length} file(s).`);
  return plugins;
}

module.exports = { loadPlugins };
