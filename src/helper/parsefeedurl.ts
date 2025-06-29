import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { HttpException, HttpStatus } from '@nestjs/common';

export async function parsePodcastFeed(feedUrl: string, episodeLimit = 3) {
  try {
    const feedRes = await axios.get(feedUrl);
    const parsed = await parseStringPromise(feedRes.data, { explicitArray: false });
    const channel = parsed.rss.channel;

    const channelImage = channel['itunes:image']?.$?.href || '';
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];

    const episodes = items.slice(0, episodeLimit).map((item) => ({
      title: item.title,
      description: item.description,
      audioUrl: item.enclosure?.$.url || '',
      image: item['itunes:image']?.$?.href || '',
    }));

    return { channelImage, episodes };
  } catch (err) {
    console.warn(`Failed to parse podcast feed: ${feedUrl}`, err.message);
    return { channelImage: '', episodes: [] };
  }
}
