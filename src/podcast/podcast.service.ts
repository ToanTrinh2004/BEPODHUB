import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import {mapItunesResultToPodcast  } from 'src/helper/parsefeedurl';
import { parseStringPromise } from 'xml2js';
import { Podcast } from './podcast.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Favourite } from 'src/schema/favourite.chema';
import { Model } from 'mongoose';
import { User } from 'src/schema/users.chema';

@Injectable()
export class PodcastService {
   @InjectModel(Favourite.name)
      private readonly favouriteModel: Model<Favourite>
  
      @InjectModel(User.name)
      private readonly userModel: Model<User>
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
        artworkUrl100: result.artworkUrl600,
        feedUrl: result.feedUrl,
        channelImage: '',
        episodes: [],
      };

      // if (result.feedUrl) {
      //   const { channelImage, episodes } = await parsePodcastFeed(result.feedUrl);
      //   podcast.channelImage = channelImage;
      //   podcast.episodes = episodes;
      // }

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
async getEpisodesByFeedUrl(feedUrl: string, episodeLimit = 10): Promise<any[]> {
  try {
    const feedRes = await axios.get(feedUrl);
    const parsed = await parseStringPromise(feedRes.data, { explicitArray: false });
    const channel = parsed.rss.channel;

    const items = Array.isArray(channel.item) ? channel.item : [channel.item];

    const episodes = items.slice(0, episodeLimit).map((item) => ({
      title: item.title,
      description: item.description,
      audioUrl: item.enclosure?.$.url || '',
      image: item['itunes:image']?.$?.href || '',
    }));

    return episodes; 
  } catch (err) {
    console.error(`Failed to parse podcast feed: ${feedUrl}`, err.message);
    throw new Error(`Unable to fetch episodes from the feed URL: ${feedUrl}`);
  }
}

async getPodcastById(podcastId: number): Promise<Podcast> {
  try {
    const response = await axios.get('https://itunes.apple.com/lookup', {
      params: { id: podcastId, entity: 'podcast' },
    });

    const results = response.data.results || [];

    // Find the item with kind === 'podcast'
    const item = results.find((r: any) => r.kind === 'podcast');
    if (!item) {
      throw new HttpException('Podcast not found', HttpStatus.NOT_FOUND);
    }

    return mapItunesResultToPodcast(item);

  } catch (error) {
    throw new HttpException(
      { message: 'Failed to fetch podcast', error: error.message },
      HttpStatus.BAD_GATEWAY,
    );
  }
}

async getAllFavouritePodcasts(uuid: string): Promise<Podcast[]> {
  // Look up the favourite ID in the user
  const user = await this.userModel.findOne({ uuid }).populate('favourite');
  if (!user || !user.favourite) {
    throw new HttpException(
      'No favourite podcasts found for this user',
      HttpStatus.NOT_FOUND,
    );
  }

  // Find the favourite document by ID
  const favourite = await this.favouriteModel.findById(user.favourite);
  if (!favourite || !favourite.podCasts || favourite.podCasts.length === 0) {
    throw new HttpException(
      'No favourite podcasts found in the favourite document',
      HttpStatus.NOT_FOUND,
    );
  }

  // Loop through the podcast IDs and fetch podcast details
  const podcasts = await Promise.all(
    favourite.podCasts.map(async (podcastId: number) => {
      return this.getPodcastById(podcastId);
    })
  );

  return podcasts;
}

}
