import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
import { Favourite } from 'src/schema/favourite.chema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/users.chema';
import { mapItunesResultToPodcast } from 'src/helper/parsefeedurl';
import axios from 'axios';
import { Podcast } from 'src/podcast/podcast.interface';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectModel(Favourite.name)
    private readonly favouriteModel: Model<Favourite>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  // Helper method to fetch user and favourite document
  private async getUserAndFavourite(userUuid: string): Promise<{ user: User; favourite: Favourite }> {
    const user = await this.userModel.findOne({ uuid: userUuid }).populate('favourite');
    if (!user) {
      throw new NotFoundException(`User with UUID ${userUuid} not found`);
    }

    const favouriteId = user.favourite;
    if (!favouriteId) {
      throw new NotFoundException(`Favourite not found for user with UUID ${userUuid}`);
    }

    const favourite = await this.favouriteModel.findById(favouriteId);
    if (!favourite) {
      throw new NotFoundException(`Favourite document not found for ID ${favouriteId}`);
    }

    return { user, favourite };
  }

  async collectFavourite(userUuid: string, createFavouriteDto: CreateFavouriteDto) {
    const { favourite } = await this.getUserAndFavourite(userUuid);

    const { artists, category } = createFavouriteDto;

    const updatedFavourite = await this.favouriteModel.findByIdAndUpdate(
      favourite._id,
      {
        $addToSet: {
          ...(artists ? { artists: { $each: artists } } : {}),
          ...(category ? { category: { $each: category } } : {}),
        },
      },
      { new: true }
    );

    return updatedFavourite;
  }

  async getSuggestedPodcasts(uuid: string): Promise<Podcast[]> {
    const { favourite } = await this.getUserAndFavourite(uuid);

    const ids = favourite
      ? [...(favourite.artists || []), ...(favourite.category || [])]
      : [];

    const podcasts: Podcast[] = [];

    for (const id of ids) {
      try {
        const res = await axios.get('https://itunes.apple.com/lookup', {
          params: {
            id,
            entity: 'podcast',
            limit: 10,
          },
        });

      

        // Loop through all results and add items with kind === 'podcast'
        const items = res.data.results || [];
        for (const item of items) {
          if (item.kind === 'podcast') {
            podcasts.push(mapItunesResultToPodcast(item));
          }
        }
      } catch (err) {
        
      }
    }

    // Shuffle and pick 6
    const shuffled = podcasts.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }

  async addPodcastToFavourite(userUuid: string, trackId: number): Promise<{ message: string }> {
    // Reuse the checkPodcastInFavourite method to determine if the podcast is already in favourites
    const isPodcastInFavourite = await this.checkPodcastInFavourite(userUuid, trackId);

    const { favourite } = await this.getUserAndFavourite(userUuid);

    let updatedFavourite;
    if (isPodcastInFavourite) {
      // Remove the podcast if it is already in favourites
      updatedFavourite = await this.favouriteModel.findByIdAndUpdate(
        favourite._id,
        { $pull: { podCasts: trackId } },
        { new: true }
      );
      return { message: `Podcast with trackId ${trackId} removed from favourites` };
    } else {
      // Add the podcast if it is not in favourites
      updatedFavourite = await this.favouriteModel.findByIdAndUpdate(
        favourite._id,
        { $addToSet: { podCasts: trackId } },
        { new: true }
      );
      return { message: `Podcast with trackId ${trackId} added to favourites` };
    }
  }

  async checkPodcastInFavourite(userUuid: string, trackId: number): Promise<boolean> {
    const { favourite } = await this.getUserAndFavourite(userUuid);
    return favourite.podCasts.includes(trackId);
  }
}


