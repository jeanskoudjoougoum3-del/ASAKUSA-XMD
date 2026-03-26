import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { CommandHandler } from '../handlers/commandHandler';

export class PluginLoader {
  private plugins: Map<string, any> = new Map();

  async loadAll(commandHandler: CommandHandler) {
    const pluginsDir = join(__dirname);
    
    if (!existsSync(pluginsDir)) {
      console.log('📁 Dossier plugins créé');
      return;
    }

    const files = readdirSync(pluginsDir).filter(f => 
      f.endsWith('.ts') && f !== 'loader.ts' && f !== 'types.ts'
    );

    for (const file of files) {
      try {
        const plugin = await import(join(pluginsDir, file));
        if (plugin.default) {
          await plugin.default(commandHandler);
          this.plugins.set(file.replace('.ts', ''), plugin);
          console.log(`🔌 Plugin chargé: ${file}`);
        }
      } catch (error) {
        console.error(`❌ Erreur plugin ${file}:`, error);
      }
    }

    console.log(`✅ ${this.plugins.size} plugins actifs`);
  }
}
