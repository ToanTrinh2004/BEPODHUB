
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { parsePodcastFeed } from 'src/helper/parsefeedurl';
import { parseStringPromise } from 'xml2js';
import { Podcast } from './podcast.interface';

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



async getPodcastsWithEpisodes(term: string = 'pride', limit = 5): Promise<Podcast[]> {
  try {
    const searchRes = await axios.get('https://itunes.apple.com/search', {
      params: { media: 'podcast', term, limit },
    });

    const results = searchRes.data.results;

    const podcasts: Podcast[] = [];

    for (const result of results) {
      const podcast: Podcast = {
        artistId: result.artistId,
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
        const { channelImage, episodes } = await parsePodcastFeed(result.feedUrl);
        podcast.channelImage = channelImage;
        podcast.episodes = episodes;
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


