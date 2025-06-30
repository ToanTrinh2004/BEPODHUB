import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // Add this import
import { Model } from 'mongoose'; // Add this import
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { parsePodcastFeed } from 'src/helper/parsefeedurl';
import { Podcast } from 'src/podcast/podcast.interface';
import axios from 'axios';
import { Artist } from 'src/schema/artist.schema';

@Injectable()
export class ArtistService {
  @InjectModel(Artist.name)
  private readonly artistModel: Model<Artist>; 

  create(createArtistDto: CreateArtistDto) {
    return 'This action adds a new artist';
  }

  findAll() {
    return `This action returns all artist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} artist`;
  }

  update(id: number, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} artist`;
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }

  async getAllPodCastByArtistId(artistId: number): Promise<Podcast[]> {
    const artist = await this.artistModel.findOne({ artistId }).lean();
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${artistId} not found`);
    }

    const response = await axios.get('https://itunes.apple.com/lookup', {
      params: {
        id: artistId,
        entity: 'podcast',
        limit: 10,
      },
    });

    const results = response.data.results || [];
    const podcasts: Podcast[] = [];

    for (const item of results.slice(1)) {
      const podcast: Podcast = {
        artistId: item.artistId,
        collectionId: item.collectionId,
        trackId: item.trackId,
        artistName: item.artistName,
        collectionName: item.collectionName,
        trackName: item.trackName,
        artworkUrl100: item.artworkUrl100,
        feedUrl: item.feedUrl,
        channelImage: '',
        episodes: [],
      };

      if (item.feedUrl) {
        const { channelImage, episodes } = await parsePodcastFeed(item.feedUrl);
        podcast.channelImage = channelImage;
        podcast.episodes = episodes;
      }

      podcasts.push(podcast);
    }

    return podcasts;
  }

  async getInfoArtist(artistId: number) {
    const artist = await this.artistModel.findOne({ artistId }).lean();
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${artistId} not found`);
    }
    return artist;
  }
  async getAllArtists(): Promise<Artist[]> {
    const artists = await this.artistModel.find().lean();
    if (!artists || artists.length === 0) {
      throw new NotFoundException('No artists found');
    }
    return artists;
  }
  createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = new this.artistModel(createArtistDto);
    return newArtist.save();
  }
}
