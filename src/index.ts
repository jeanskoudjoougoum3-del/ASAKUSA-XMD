import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import P from 'pino';
import { config } from 'dotenv';

// ⚡ Charge les variables d'environnement
config();

// 🚀 Logger optimisé
const logger = P({ level: 'silent' });

console.log(`
╔══════════════════════════════════════════╗
║                                          ║
║          🤖 ASAKUSA-XMD v1.0.0           ║
║     Bot WhatsApp Ultra-Puissant          ║
║                                          ║
╚══════════════════════════════════════════╝
`);

class AsakusaXMD {
  private sock: ReturnType<typeof makeWASocket> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async start() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState('auth_info');
      const { version, isLatest } = await fetchLatestBaileysVersion();

      console.log(`📱 WhatsApp Version: ${version.join('.')} ${isLatest ? '(Dernière)' : ''}`);

      this.sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: true,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        browser: ['ASAKUSA-XMD', 'Chrome', '1.0.0'],
        // ⚡ Optimisations ultra-rapides
        syncFullHistory: false,
        markOnlineOnConnect: true,
        fireInitQueries: true,
        shouldIgnoreJid: (jid) => {
          const ignore = jid?.includes('broadcast') || jid?.endsWith('@newsletter');
          return ignore || false;
        },
        // 🔥 Performance maximale
        msgRetryCounterCache: undefined,
        generateHighQualityLinkPreview: true,
        getMessage: async () => undefined,
      });

      this.setupEventHandlers(saveCreds);
      
    } catch (error) {
      console.error('❌ Erreur démarrage:', error);
      this.handleReconnect();
    }
  }

  private setupEventHandlers(saveCreds: () => Promise<void>) {
    if (!this.sock) return;

    // 🔐 Sauvegarde des credentials
    this.sock.ev.on('creds.update', saveCreds);

    // 🔄 Gestion connexion
    this.sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('\n📲 Scan ce QR code avec WhatsApp:\n');
        qrcode.generate(qr, { small: true });
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          console.log('🔄 Connexion perdue, reconnexion...');
          this.handleReconnect();
        } else {
          console.log('👋 Déconnecté. Scan QR pour reconnecter.');
          process.exit(0);
        }
      } else if (connection === 'open') {
        console.log('✅ ASAKUSA-XMD connecté et opérationnel !');
        console.log(`🤖 Prêt à servir | ${new Date().toLocaleString()}`);
        this.reconnectAttempts = 0;
      }
    });

    // 💬 Gestionnaire de messages ultra-rapide
    this.sock.ev.on('messages.upsert', async (m) => {
      if (m.type !== 'notify') return;

      for (const msg of m.messages) {
        // Ignore ses propres messages
        if (msg.key.fromMe) continue;
        
        // Traitement async immédiat
        this.processMessage(msg).catch((err) => {
          console.error('❌ Erreur traitement message:', err);
        });
      }
    });

    // 👥 Mises à jour des groupes
    this.sock.ev.on('groups.upsert', (groups) => {
      console.log(`📊 ${groups.length} groupe(s) mis à jour`);
    });
  }

  private async processMessage(msg: any) {
    const startTime = Date.now();
    const jid = msg.key.remoteJid;
    
    // Extraction ultra-rapide du texte
    const messageContent = msg.message;
    if (!messageContent) return;

    const text = (
      messageContent.conversation ||
      messageContent.extendedTextMessage?.text ||
      messageContent.imageMessage?.caption ||
      messageContent.videoMessage?.caption ||
      messageContent.documentMessage?.caption ||
      ''
    ).trim();

    if (!text) return;

    console.log(`💬 [${jid}] > ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);

    // 🎯 Détection des commandes
    if (text.startsWith('!') || text.startsWith('.')) {
      await this.handleCommand(jid, text, msg);
    } else {
      // Réponse IA ou automatique (optionnel)
      // await this.handleChat(jid, text, msg);
    }

    const duration = Date.now() - startTime;
    console.log(`⚡ Traité en ${duration}ms`);
  }

  private async handleCommand(jid: string, text: string, msg: any) {
    const args = text.slice(1).trim().split(/\s+/);
    const command = args.shift()?.toLowerCase();

    const commands: Record<string, () => Promise<string>> = {
      'ping': async () => '🏓 Pong! ASAKUSA-XMD est en ligne ⚡',
      'help': async () => this.getHelpMenu(),
      'info': async () => this.getBotInfo(),
      'status': async () => `📊 Statut: En ligne\n⏱️ Uptime: ${process.uptime().toFixed(0)}s`,
    };

    const handler = commands[command || ''];
    
    if (handler) {
      const response = await handler();
      await this.sendMessage(jid, response, msg);
    } else {
      await this.sendMessage(jid, `❓ Commande *!${command}* inconnue.\nTape *!help* pour voir les commandes.`, msg);
    }
  }

  private async sendMessage(jid: string, text: string, quotedMsg?: any) {
    if (!this.sock) return;
    
    await this.sock.sendMessage(jid, { 
      text,
      contextInfo: quotedMsg ? {
        quotedMessage: quotedMsg.message,
        stanzaId: quotedMsg.key.id,
        participant: quotedMsg.key.participant || quotedMsg.key.remoteJid,
      } : undefined
    });
  }

  private getHelpMenu(): string {
    return `
╔══════════════════════════════════╗
║     🤖 ASAKUSA-XMD COMMANDS      ║
╠══════════════════════════════════╣
║ !ping    → Test de latence       ║
║ !help    → Ce menu               ║
║ !info    → Infos du bot          ║
║ !status  → Statut système        ║
╚══════════════════════════════════╝
    `.trim();
  }

  private getBotInfo(): string {
    return `
🤖 *ASAKUSA-XMD* v1.0.0
⚡ Bot WhatsApp Ultra-Puissant
📅 ${new Date().toLocaleDateString()}
🔧 Node.js ${process.version}
💾 ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB utilisés
    `.trim();
  }

  private handleReconnect() {
    this.reconnectAttempts++;
    
    if (this.reconnectAttempts > this.maxReconnectAttempts) {
      console.error('❌ Trop de tentatives de reconnexion. Arrêt.');
      process.exit(1);
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`⏳ Nouvelle tentative dans ${delay/1000}s... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => this.start(), delay);
  }
}

// 🚀 Lancement
const bot = new AsakusaXMD();
bot.start();

// 🛑 Gestion gracieuse de l'arrêt
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt de ASAKUSA-XMD...');
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('⚠️ Erreur non gérée:', err);
});
