import { CommandHandler } from '../handlers/commandHandler';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default function ownerPlugin(handler: CommandHandler) {
  
  handler.register({
    name: 'eval',
    category: 'owner',
    description: 'Exécute du code JS',
    ownerOnly: true,
    execute: async (ctx) => {
      if (!ctx.args.length) return '❓ !eval <code>';
      
      try {
        const code = ctx.args.join(' ');
        const result = eval(code);
        return `✅ *Résultat:*\n\`\`\`${result}\`\`\``;
      } catch (error: any) {
        return `❌ *Erreur:*\n\`\`\`${error.message}\`\`\``;
      }
    },
  });

  handler.register({
    name: 'exec',
    category: 'owner',
    description: 'Exécute une commande shell',
    ownerOnly: true,
    execute: async (ctx) => {
      if (!ctx.args.length) return '❓ !exec <commande>';
      
      try {
        const { stdout, stderr } = await execAsync(ctx.args.join(' '));
        return `📟 *Output:*\n\`\`\`${stdout || stderr}\`\`\``;
      } catch (error: any) {
        return `❌ *Erreur:*\n\`\`\`${error.message}\`\`\``;
      }
    },
  });

  handler.register({
    name: 'broadcast',
    category: 'owner',
    description: 'Message à tous les chats',
    ownerOnly: true,
    execute: async (ctx) => {
      if (!ctx.args.length) return '❓ !broadcast <message>';
      
      const message = ctx.args.join(' ');
      const chats = await ctx.sock.groupFetchAllParticipating();
      const privateChats = []; // Tu peux stocker les JIDs dans la DB
      
      let sent = 0;
      
      // Envoie aux groupes
      for (const [jid] of Object.entries(chats)) {
        await ctx.sock.sendMessage(jid, { 
          text: `📢 *BROADCAST*\n\n${message}\n\n_De la part du propriétaire_` 
        });
        sent++;
      }
      
      return `✅ Broadcast envoyé à ${sent} groupes`;
    },
  });

  handler.register({
    name: 'ban',
    category: 'owner',
    description: 'Bannir un utilisateur',
    ownerOnly: true,
    execute: async (ctx) => {
      // Logique de ban avec la DB
      return '🔨 Utilisateur banni';
    },
  });

  handler.register({
    name: 'statsfull',
    category: 'owner',
    description: 'Stats complètes système',
    ownerOnly: true,
    execute: async () => {
      const mem = process.memoryUsage();
      const cpu = process.cpuUsage();
      
      return `
📊 *STATS SYSTÈME*

💾 *Mémoire:*
RSS: ${(mem.rss / 1024 / 1024).toFixed(2)} MB
Heap: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB

⚡ *CPU:*
User: ${(cpu.user / 1000000).toFixed(2)}s
System: ${(cpu.system / 1000000).toFixed(2)}s

🔧 *Process:*
PID: ${process.pid}
Node: ${process.version}
Plateforme: ${process.platform}
      `.trim();
    },
  });

  console.log('👑 Plugin Owner chargé');
}
