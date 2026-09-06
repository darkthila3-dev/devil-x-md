require('dotenv').config();

module.exports = {
  BOT_NAME: process.env.BOT_NAME || 'Devil',
  FOOTER: process.env.FOOTER || 'Devil X MD',
  PREFIX: process.env.PREFIX || '.',
  OWNER_NUMBER: process.env.OWNER_NUMBER || '94700000000', // country code, no +
  PORT: process.env.PORT || 3000,
};
