import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // Add this import
import { Model } from 'mongoose'; // Add this import
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { mapItunesResultToPodcast} from 'src/helper/parsefeedurl';
import { Podcast } from 'src/podcast/podcast.interface';
import axios from 'axios';
import { Artist } from 'src/schema/artist.schema';
import { Favourite } from 'src/schema/favourite.chema';
import { User } from 'src/schema/users.chema';

@Injectable()
export class ArtistService {
  @InjectModel(Artist.name)
  private readonly artistModel: Model<Artist>; 
  @InjectModel(Favourite.name)
  private readonly favouriteModel: Model<Favourite>
  @InjectModel(User.name)
  private readonly userModel: Model<User>

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
    const response = await axios.get('https://itunes.apple.com/lookup', {
      params: {
        id: artistId,
        entity: 'podcast',
        limit: 10,
      },
    });
  
    const results = response.data.results || [];
  
    // Skip the first item (artist info), then map
    return results.slice(1).map(mapItunesResultToPodcast);
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
  async getAllFavouriteArtists(userUuid: string): Promise<Artist[]> {
    // Fetch the user and their favourite document
    const user = await this.userModel.findOne({ uuid: userUuid }).populate('favourite');
    if (!user) {
      throw new NotFoundException(`User with UUID ${userUuid} not found`);
    }

    const favourite = await this.favouriteModel.findById(user.favourite);
    if (!favourite) {
      throw new NotFoundException(`Favourite document not found for user with UUID ${userUuid}`);
    }
    console.log(favourite);

    const artistsId = favourite?.artists || [];
    if (artistsId.length === 0) {
      throw new NotFoundException('No favourite artists found for the user');
    }

    
    // Loop through artistsId and fetch artist info for each ID
    const artists = await Promise.all(
      artistsId.map(async (artistId) => {
        return this.getInfoArtist(artistId);
      })
    );

    return artists;
  }
}
