import yts from 'yt-search';
import axios from 'axios';

export class Downloader {
  
  // 🎵 YouTube MP3
  async youtubeAudio(query: string): Promise<{ title: string, url: string, thumbnail: string } | null> {
    try {
      const search = await yts(query);
      const video = search.videos[0];
      if (!video) return null;

      // Note: En production, utilise une API de téléchargement fiable
      return {
        title: video.title,
        url: video.url,
        thumbnail: video.thumbnail,
      };
    } catch (error) {
      console.error('YT Error:', error);
      return null;
    }
  }

  // 🎬 YouTube MP4
  async youtubeVideo(query: string): Promise<any> {
    return this.youtubeAudio(query); // Même logique, format différent
  }

  // 📱 TikTok (via API externe)
  async tiktok(url: string): Promise<{ video: string, audio: string } | null> {
    try {
      // Utilise une API comme ssstik.io ou similaire
      const response = await axios.get(`https://api.example.com/tiktok?url=${encodeURIComponent(url)}`);
      return response.data;
    } catch {
      return null;
    }
  }

  // 📸 Instagram
  async instagram(url: string): Promise<string[] | null> {
    try {
      const response = await axios.get(`https://api.example.com/ig?url=${encodeURIComponent(url)}`);
      return response.data.medias;
    } catch {
      return null;
    }
  }
}

export const downloader = new Downloader();
