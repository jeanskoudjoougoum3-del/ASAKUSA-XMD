export class GroupManager {
  private sock: any;

  constructor(sock: any) {
    this.sock = sock;
  }

  // 🚫 Anti-lien
  async antiLink(jid: string, text: string, sender: string) {
    const links = ['http://', 'https://', 'www.', '.com', '.fr'];
    const hasLink = links.some(link => text.includes(link));
    
    if (hasLink) {
      await this.sock.sendMessage(jid, { 
        text: `🚫 @${sender.split('@')[0]}, les liens sont interdits !`,
        mentions: [sender],
      });
      // Option: retirer le membre
      // await this.sock.groupParticipantsUpdate(jid, [sender], 'remove');
      return true;
    }
    return false;
  }

  // 👋 Message de bienvenue
  async welcome(jid: string, participant: string) {
    const welcomeMsg = `👋 Bienvenue @${participant.split('@')[0]} !\n\n📜 Règles:\n1. Respecte tout le monde\n2. Pas de spam\n3. Amuse-toi !`;
    
    await this.sock.sendMessage(jid, {
      text: welcomeMsg,
      mentions: [participant],
    });
  }

  // 🔇 Mute/Unmute
  async muteGroup(jid: string, duration: number = 0) {
    await this.sock.groupSettingUpdate(jid, 'announcement');
    if (duration > 0) {
      setTimeout(() => {
        this.sock.groupSettingUpdate(jid, 'not_announcement');
      }, duration * 60 * 1000);
    }
  }

  async unmuteGroup(jid: string) {
    await this.sock.groupSettingUpdate(jid, 'not_announcement');
  }

  // 🏷️ Tagall
  async tagAll(jid: string, message: string) {
    const group = await this.sock.groupMetadata(jid);
    const mentions = group.participants.map((p: any) => p.id);
    
    await this.sock.sendMessage(jid, {
      text: `📢 ${message}\n\n${mentions.map((m: string) => `@${m.split('@')[0]}`).join(' ')}`,
      mentions,
    });
  }
}
