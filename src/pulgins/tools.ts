import { CommandHandler } from '../handlers/commandHandler';
import axios from 'axios';

export default function toolsPlugin(handler: CommandHandler) {
  
  handler.register({
    name: 'weather',
    aliases: ['meteo', 'w'],
    category: 'tools',
    description: 'Météo d\'une ville',
    cooldown: 10,
    execute: async (ctx) => {
      if (!ctx.args.length) return '❓ !weather <ville>';
      
      try {
        const city = ctx.args.join(' ');
        // Utilise une API météo gratuite comme OpenWeatherMap
        const apiKey = process.env.WEATHER_KEY || 'demo';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=fr`;
        
        const { data } = await axios.get(url);
        
        return `
🌍 *Météo: ${data.name}, ${data.sys.country}*

🌡️ Température: ${Math.round(data.main.temp)}°C
🌡️ Ressenti: ${Math.round(data.main.feels_like)}°C
💧 Humidité: ${data.main.humidity}%
☁️ Ciel: ${data.weather[0].description}
💨 Vent: ${data.wind.speed} m/s
        `.trim();
      } catch {
        return '❌ Ville non trouvée ou API indisponible';
      }
    },
  });

  handler.register({
    name: 'translate',
    aliases: ['tr'],
    category: 'tools',
    description: 'Traduit un texte',
    execute: async (ctx) => {
      if (ctx.args.length < 2) return '❓ !tr <lang> <texte>\nEx: !tr en Bonjour';
      
      const lang = ctx.args[0];
      const text = ctx.args.slice(1).join(' ');
      
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${lang}`;
        const { data } = await axios.get(url);
        return `🌐 *Traduction:*\n\n${data.responseData.translatedText}`;
      } catch {
        return '❌ Erreur de traduction';
      }
    },
  });

  handler.register({
    name: 'short',
    category: 'tools',
    description: 'Raccourcit une URL',
    execute: async (ctx) => {
      if (!ctx.args.length) return '❓ !short <url>';
      
      try {
        const url = ctx.args[0];
        const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        return `🔗 *URL raccourcie:*\n${data}`;
      } catch {
        return '❌ Erreur de raccourcissement';
      }
    },
  });

  handler.register({
    name: 'screenshot',
    aliases: ['ss', 'web'],
    category: 'tools',
    description: 'Capture d\'écran d\'un site',
    cooldown: 15,
    execute: async (ctx) => {
      if (!ctx.args.length) return '❓ !ss <url>';
      
      const url = ctx.args[0];
      if (!url.startsWith('http')) return '❌ URL invalide (doit commencer par http)';
      
      const screenshotUrl = `https://api.screenshotmachine.com?key=demo&url=${encodeURIComponent(url)}&dimension=1024x768`;
      
      await ctx.sock.sendMessage(ctx.jid, {
        image: { url: screenshotUrl },
        caption: `🖥️ Capture de: ${url}`,
      });
    },
  });

  console.log('🛠️ Plugin Tools chargé');
}
