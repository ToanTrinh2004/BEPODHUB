
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class PodcastService {
  create(createPodcastDto: CreatePodcastDto) {
    return 'This action adds a new podcast';
  }

  findAll() {
    return `This action returns all podcast`;
  }

  findOne(id: number) {
    return `This action returns a #${id} podcast`;
  }

  update(id: number, updatePodcastDto: UpdatePodcastDto) {
    return `This action updates a #${id} podcast`;
  }

  remove(id: number) {
    return `This action removes a #${id} podcast`;
  }



  async getPodcastsWithEpisodes(term: string = 'pride', limit = 5) {
    try {
      const searchRes = await axios.get('https://itunes.apple.com/search', {
        params: { media: 'podcast', term, limit },
      });

      const results = searchRes.data.results;
      const podcasts: {
        collectionId: any;
        trackId: any;
        artistName: any;
        collectionName: any;
        trackName: any;
        artworkUrl100: any;
        feedUrl: any;
        channelImage: string;
        episodes: {
          title: string;
          description: string;
          audioUrl: string;
          image: string;
        }[];
      }[] = [];

      for (const result of results) {
        const podcast = {
          collectionId: result.collectionId,
          trackId: result.trackId,
          artistName: result.artistName,
          collectionName: result.collectionName,
          trackName: result.trackName,
          artworkUrl100: result.artworkUrl100,
          feedUrl: result.feedUrl,
          channelImage: '',
          episodes: [],
        };

        if (result.feedUrl) {
          try {
            const feedRes = await axios.get(result.feedUrl);
            const parsed = await parseStringPromise(feedRes.data, { explicitArray: false });
            const channel = parsed.rss.channel;

            podcast.channelImage = channel['itunes:image']?.$?.href || '';

            const items = Array.isArray(channel.item) ? channel.item : [channel.item];
            podcast.episodes = items.slice(0, 3).map((item) => ({
              title: item.title,
              description: item.description,
              audioUrl: item.enclosure?.$.url || '',
              image: item['itunes:image']?.$?.href || '',
            }));
          } catch (feedError) {
            console.warn(`Failed to fetch feed for ${result.trackName}:`, feedError.message);
          }
        }

        podcasts.push(podcast);
      }

      return podcasts;
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to fetch podcasts', error: error.message },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
