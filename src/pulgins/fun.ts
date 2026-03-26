import { CommandHandler } from '../handlers/commandHandler';

export default function funPlugin(handler: CommandHandler) {
  
  handler.register({
    name: 'joke',
    category: 'fun',
    description: 'Blague aléatoire',
    cooldown: 5,
    execute: async () => {
      const jokes = [
        "Pourquoi les plongeurs plongent-ils toujours en arrière ?\n\nParce que sinon ils tombent dans le bateau ! 😄",
        "Quel est le comble pour un électricien ?\n\nDe ne pas être au courant ! ⚡",
        "Pourquoi les poissons détestent l'ordinateur ?\n\nÀ cause du réseau ! 🐟",
        "Que dit une maman tomate à sa petite tomate qui traîne ?\n\nKetchup ! 🍅",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    },
  });

  handler.register({
    name: 'quote',
    category: 'fun',
    description: 'Citation inspirante',
    execute: async () => {
      const quotes = [
        "« Le succès c'est d'aller d'échec en échec sans perdre son enthousiasme. » - Churchill",
        "« La vie est ce qui arrive quand on est occupé à faire d'autres projets. » - Lennon",
        "« Le seul moyen de faire du bon travail est d'aimer ce que vous faites. » - Jobs",
      ];
      return quotes[Math.floor(Math.random() * quotes.length)];
    },
  });

  handler.register({
    name: 'ship',
    category: 'fun',
    description: 'Calcule la compatibilité amoureuse',
    execute: async (ctx) => {
      if (ctx.args.length < 2) return '❓ Usage: !ship @user1 @user2';
      
      const percent = Math.floor(Math.random() * 100) + 1;
      let emoji = '💔';
      if (percent > 30) emoji = '💛';
      if (percent > 60) emoji = '💚';
      if (percent > 80) emoji = '💜';
      if (percent > 95) emoji = '💎';
      
      return `${emoji} *Compatibilité:* ${percent}%\n${'█'.repeat(percent/10)}${'░'.repeat(10-percent/10)}`;
    },
  });

  console.log('🎉 Plugin Fun chargé');
}
