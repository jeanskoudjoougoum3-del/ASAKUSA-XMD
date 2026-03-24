export const CONFIG = {
  botName: 'ASAKUSA-XMD',
  version: '1.0.0',
  prefix: ['!', '.', '/'],
  owner: process.env.OWNER_NUMBER || '',
  mods: (process.env.MODS || '').split(',').filter(Boolean),

  // ⚡ Performance
  maxRequestsPerMinute: 30,
  cacheTimeout: 3600,

  // 🔧 Features
  autoRead: true,
  autoTyping: true,
  antiCall: true,

  // 🌐 API Keys (à mettre dans .env)
  openai: process.env.OPENAI_KEY || '',
  weather: process.env.WEATHER_KEY || '',
};

export const MESSAGES = {
  notAuthorized: '❌ Tu n\'as pas la permission !',
  cooldown: '⏳ Attends un peu avant de réutiliser cette commande...',
  error: '❌ Une erreur est survenue !',
  maintenance: '🔧 Commande en maintenance',
};