import { CommandHandler } from '../handlers/commandHandler';

export function loadCommands(handler: CommandHandler) {
  
  // 🌟 Commandes Générales
  handler.register({
    name: 'ping',
    category: 'general',
    description: 'Test de latence',
    cooldown: 3,
    execute: async () => {
      const start = Date.now();
      return `🏓 Pong!\n⚡ Latence: *${Date.now() - start}ms*`;
    }
  });

  handler.register({
    name: 'help',
    aliases: ['menu', 'commands'],
    category: 'general',
    description: 'Menu des commandes',
    execute: async (ctx) => {
      const { CommandHandler } = await import('../handlers/commandHandler');
      const categories = ['general', 'fun', 'tools', 'group', 'owner'];
      
      let menu = `╔══════════════════════════╗\n║   🤖 *ASAKUSA-XMD* v1.0  ║\n╚══════════════════════════╝\n\n`;
      
      categories.forEach(cat => {
        const cmds = ctx.sock.commandHandler?.getCommandsByCategory(cat) || [];
        if (cmds.length > 0) {
          menu += `*${cat.toUpperCase()}* :\n`;
          cmds.forEach(c => menu += `  • !${c.name} - ${c.description}\n`);
          menu += '\n';
        }
      });
      
      return menu + `\n⚡ _Tape !<commande> pour utiliser_`;
    }
  });

  handler.register({
    name: 'info',
    category: 'general',
    description: 'Infos du bot',
    execute: async () => {
      const mem = process.memoryUsage();
      return `
🤖 *ASAKUSA-XMD* v1.0.0
📅 ${new Date().toLocaleDateString()}
⏱️ Uptime: ${formatUptime()}
💾 RAM: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB
🔧 Node.js ${process.version}
      `.trim();
    }
  });

  // 🎉 Commandes Fun
  handler.register({
    name: 'roll',
    category: 'fun',
    description: 'Lance un dé (1-6)',
    cooldown: 2,
    execute: async () => {
      const result = Math.floor(Math.random() * 6) + 1;
      return `🎲 Tu as obtenu: *${result}*`;
    }
  });

  handler.register({
    name: 'flip',
    category: 'fun',
    description: 'Pile ou face',
    cooldown: 2,
    execute: async () => {
      const result = Math.random() > 0.5 ? 'Pile' : 'Face';
      return `🪙 Résultat: *${result}*`;
    }
  });

  handler.register({
    name: '8ball',
    category: 'fun',
    description: 'Pose une question',
    cooldown: 5,
    execute: async (ctx) => {
      if (!ctx.args.length) return '❓ Pose une question !\nEx: !8ball Vais-je réussir ?';
      
      const responses = [
        '✅ Oui, certainement !',
        '❌ Non, pas du tout.',
        '🤔 Peut-être...',
        '⚡ Absolument !',
        '😅 Je ne suis pas sûr...',
        '🔮 Les signes disent oui',
        '⛔ Impossible',
        '🌟 Essaye encore !'
      ];
      
      return `🎱 ${responses[Math.floor(Math.random() * responses.length)]}`;
    }
  });

  // 🛠️ Commandes Outils
  handler.register({
    name: 'calc',
    category: 'tools',
    description: 'Calculatrice',
    execute: async (ctx) => {
      if (!ctx.args.length) return '❓ Usage: !calc 5 + 3';
      
      try {
        const expression = ctx.args.join(' ').replace(/[^0-9+\-*/.()]/g, '');
        // eslint-disable-next-line no-eval
        const result = eval(expression);
        return `🧮 *${expression}* = *${result}*`;
      } catch {
        return '❌ Calcul invalide !';
      }
    }
  });

  handler.register({
    name: 'time',
    category: 'tools',
    description: 'Heure actuelle',
    execute: async () => {
      const now = new Date();
      return `🕐 Il est *${now.toLocaleTimeString()}*\n📅 ${now.toLocaleDateString()}`;
    }
  });

  // 👑 Commandes Owner (admin)
  handler.register({
    name: 'broadcast',
    category: 'owner',
    description: 'Message à tous les chats',
    ownerOnly: true,
    execute: async (ctx) => {
      if (!ctx.args.length) return '❓ Usage: !broadcast <message>';
      
      const message = ctx.args.join(' ');
      // Logique de broadcast ici
      return `📢 Broadcast envoyé à *X* chats:\n${message}`;
    }
  });

  handler.register({
    name: 'restart',
    category: 'owner',
    description: 'Redémarre le bot',
    ownerOnly: true,
    execute: async () => {
      setTimeout(() => process.exit(0), 1000);
      return '🔄 Redémarrage en cours...';
    }
  });

  console.log('✅ Toutes les commandes chargées !');
}

function formatUptime(): string {
  const seconds = Math.floor(process.uptime());
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}
