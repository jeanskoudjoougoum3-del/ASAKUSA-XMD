import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

export class Database {
  private filePath: string;
  private data: any;

  constructor(filename: string = 'asakusa-db.json') {
    this.filePath = join(process.cwd(), filename);
    this.load();
  }

  private load() {
    if (existsSync(this.filePath)) {
      this.data = JSON.parse(readFileSync(this.filePath, 'utf-8'));
    } else {
      this.data = { users: {}, groups: {}, stats: {} };
      this.save();
    }
  }

  private save() {
    writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  }

  // 👤 Utilisateurs
  getUser(jid: string) {
    return this.data.users[jid] || { jid, messages: 0, commands: 0, joined: Date.now() };
  }

  updateUser(jid: string, update: any) {
    this.data.users[jid] = { ...this.getUser(jid), ...update };
    this.save();
  }

  addMessage(jid: string) {
    const user = this.getUser(jid);
    user.messages++;
    this.updateUser(jid, user);
  }

  addCommand(jid: string) {
    const user = this.getUser(jid);
    user.commands++;
    this.updateUser(jid, user);
  }

  // 👥 Groupes
  getGroup(jid: string) {
    return this.data.groups[jid] || { jid, members: {}, settings: {} };
  }

  updateGroup(jid: string, update: any) {
    this.data.groups[jid] = { ...this.getGroup(jid), ...update };
    this.save();
  }

  // 📊 Stats globales
  getStats() {
    return {
      totalUsers: Object.keys(this.data.users).length,
      totalGroups: Object.keys(this.data.groups).length,
      totalMessages: Object.values(this.data.users).reduce((a: any, u: any) => a + (u.messages || 0), 0),
      totalCommands: Object.values(this.data.users).reduce((a: any, u: any) => a + (u.commands || 0), 0),
    };
  }
}

export const db = new Database();
