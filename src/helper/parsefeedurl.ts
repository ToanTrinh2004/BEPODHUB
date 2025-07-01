import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Podcast } from 'src/podcast/podcast.interface';

export function mapItunesResultToPodcast(item: any): Podcast {
  return {
    artistId: item.artistId,
    collectionId: item.collectionId,
    trackId: item.trackId,
    artistName: item.artistName,
    collectionName: item.collectionName,
    trackName: item.trackName,
    artworkUrl100: item.artworkUrl600 || item.artworkUrl100,
    feedUrl: item.feedUrl,
    channelImage: '',
    episodes: [],
  };
}

