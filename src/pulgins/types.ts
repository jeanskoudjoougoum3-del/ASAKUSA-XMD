export interface PluginContext {
  jid: string;
  args: string[];
  msg: any;
  sock: any;
  isOwner: boolean;
  isMod: boolean;
  isGroup: boolean;
  pushName: string;
  reply: (text: string) => Promise<void>;
  sendImage: (url: string, caption?: string) => Promise<void>;
  sendVideo: (url: string, caption?: string) => Promise<void>;
  sendAudio: (url: string) => Promise<void>;
}
