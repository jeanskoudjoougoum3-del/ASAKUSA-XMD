import { proto } from '@whiskeysockets/baileys';
import { CONFIG, MESSAGES } from '../config/config';

interface Command {
  name: string;
  aliases?: string[];
  category: 'general' | 'owner' | 'fun' | 'tools' | 'group';
  description: string;
  cooldown?: number;
  ownerOnly?: boolean;
  execute: (ctx: CommandContext) => Promise<string | void>;
}

interface CommandContext {
  jid: string;
  args: string[];
  msg: proto.IWebMessageInfo;
  sock: any;
  isOwner: boolean;
  isMod: boolean;
  isGroup: boolean;
  pushName?: string;
}

export class CommandHandler {
  private commands: Map<string, Command> = new Map();
  private aliases: Map<string, string> = new Map();
  private cooldowns: Map<string, Map<string, number>> = new Map();

  register(cmd: Command) {
    this.commands.set(cmd.name, cmd);
    
    if (cmd.aliases) {
      cmd.aliases.forEach(alias => {
        this.aliases.set(alias, cmd.name);
      });
    }
    
    console.log(`📥 Commande chargée: !${cmd.name}`);
  }

  async execute(commandName: string, ctx: CommandContext): Promise<string> {
    const name = this.aliases.get(commandName) || commandName;
    const cmd = this.commands.get(name);

    if (!cmd) return `❓ Commande *!${commandName}* inconnue.\nTape *!help* pour voir la liste.`;

    // 🔒 Vérification owner
    if (cmd.ownerOnly && !ctx.isOwner) {
      return MESSAGES.notAuthorized;
    }

    // ⏳ Vérification cooldown
    if (cmd.cooldown) {
      const userCooldowns = this.cooldowns.get(name) || new Map();
      const lastUsed = userCooldowns.get(ctx.jid) || 0;
      const now = Date.now();
      
      if (now - lastUsed < cmd.cooldown * 1000) {
        const remaining = Math.ceil((cmd.cooldown * 1000 - (now - lastUsed)) / 1000);
        return `⏳ Attends *${remaining}s* avant de réutiliser *!${name}*`;
      }
      
      userCooldowns.set(ctx.jid, now);
      this.cooldowns.set(name, userCooldowns);
    }

    try {
      const result = await cmd.execute(ctx);
      return result || '✅ Fait !';
    } catch (error) {
      console.error(`❌ Erreur commande ${name}:`, error);
      return MESSAGES.error;
    }
  }

  getCommandsByCategory(category?: string): Command[] {
    const cmds = Array.from(this.commands.values());
    return category ? cmds.filter(c => c.category === category) : cmds;
  }

  getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }
}
