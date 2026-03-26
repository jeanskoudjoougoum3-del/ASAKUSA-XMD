  // 🎵 Téléchargement
  handler.register({
    name: 'play',
    category: 'tools',
    description: 'Télécharge musique YouTube',
    cooldown: 10,
    execute: async (ctx) => {
      if (!ctx.args.length) return '❓ !play <titre>';
      const { downloader } = await import('../services/downloader');
      const result = await downloader.youtubeAudio(ctx.args.join(' '));
      if (!result) return '❌ Musique non trouvée';
      return `🎵 *${result.title}*\n\n⬇️ Lien: ${result.url}\n\n_(Téléchargement en développement)_`;
    },
  });

  // 🤖 IA
  handler.register({
    name: 'ai',
    aliases: ['gpt', 'ask'],
    category: 'tools',
    description: 'Pose une question à l\'IA',
    cooldown: 5,
    execute: async (ctx) => {
      if (!ctx.args.length) return '❓ !ai <question>';
      const { ai } = await import('../services/ai');
      const response = await ai.chat(ctx.args.join(' '));
      return `🤖 *ASAKUSA AI:*\n\n${response}`;
    },
  });

  // 👥 Groupe
  handler.register({
    name: 'tagall',
    category: 'group',
    description: 'Tag tous les membres',
    execute: async (ctx) => {
      if (!ctx.isGroup) return '❌ Commande groupe uniquement';
      const { GroupManager } = await import('../services/groupManager');
      const gm = new GroupManager(ctx.sock);
      await gm.tagAll(ctx.jid, ctx.args.join(' ') || 'Attention !');
      return '';
    },
  });

  // 📊 Stats
  handler.register({
    name: 'stats',
    category: 'general',
    description: 'Statistiques du bot',
    execute: async () => {
      const { db } = await import('../database/database');
      const stats = db.getStats();
      return `
📊 *STATISTIQUES ASAKUSA-XMD*

👤 Utilisateurs: ${stats.totalUsers}
👥 Groupes: ${stats.totalGroups}
💬 Messages: ${stats.totalMessages}
⚡ Commandes: ${stats.totalCommands}
      `.trim();
    },
  });

  // 🏆 Profil utilisateur
  handler.register({
    name: 'profile',
    category: 'general',
    description: 'Ton profil',
    execute: async (ctx) => {
      const { db } = await import('../database/database');
      const user = db.getUser(ctx.jid);
      return `
👤 *PROFIL*

📝 Messages: ${user.messages}
⚡ Commandes: ${user.commands}
📅 Inscrit: ${new Date(user.joined).toLocaleDateString()}
      `.trim();
    },
  });
