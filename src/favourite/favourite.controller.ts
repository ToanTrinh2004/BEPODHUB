import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';

@Controller('favourite')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  /**
   * Adds artists and categories to the user's favourites.
   * @param uuid - User UUID
   * @param dto - Data Transfer Object containing artists and categories
   */
  @Post('collect/:uuid')
  async collectFavourite(
    @Param('uuid') uuid: string,
    @Body() dto: CreateFavouriteDto
  ) {
    const res = this.favouriteService.collectFavourite(uuid, dto);
    return {
      message : 'Favourite updated successfully',
    }
  }

  /**
   * Fetches suggested podcasts based on the user's favourites.
   * @param uuid - User UUID
   */
  @Get('/suggest/:uuid')
  async getSuggestedPodcasts(@Param('uuid') uuid: string) {
    return this.favouriteService.getSuggestedPodcasts(uuid);
  }

  /**
   * Adds or removes a podcast from the user's favourites.
   * @param uuid - User UUID
   * @param trackId - Podcast track ID
   */
  @Post('/podcast/:uuid/:trackId')
  async addPodcastToFavourite(
    @Param('uuid') uuid: string,
    @Param('trackId') trackId: number
  ) {
    return this.favouriteService.addPodcastToFavourite(uuid, trackId);
  }

  /**
   * Checks if a podcast is in the user's favourites.
   * @param uuid - User UUID
   * @param trackId - Podcast track ID
   */
  @Get('/check/:uuid/:trackId')
  async checkPodcastInFavourite(
    @Param('uuid') uuid: string,
    @Param('trackId') trackId: number
  ) {
    return this.favouriteService.checkPodcastInFavourite(uuid, trackId);
  }
  /**
   * Adds or removes an artist from the user's favourites.
   * @param uuid - User UUID
   * @param artistId - Artist ID
   */
  @Post('/artist/:uuid/:artistId')
  async addArtistToFavourite(
    @Param('uuid') uuid: string,
    @Param('artistId') artistId: number
  ) {
    return this.favouriteService.addArtistToFavourite(uuid, artistId);
  }

  /**
   * Checks if an artist is in the user's favourites.
   * @param uuid - User UUID
   * @param artistId - Artist ID
   */
  @Get('/check/artist/:uuid/:artistId')
  async checkArtistInFavourite(
    @Param('uuid') uuid: string,
    @Param('artistId') artistId: number
  ) {
    return this.favouriteService.checkArtistInFavourite(uuid, artistId);
  }
}
