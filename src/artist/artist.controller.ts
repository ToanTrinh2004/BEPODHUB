import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.createArtist(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistService.getAllArtists();
    // return this.artistService.findAll();
  }
  @Get(':artistId')
  getAllPodCastByArtistId(@Param('artistId') artistId: number) {
    return this.artistService.getAllPodCastByArtistId(artistId);
  }
  @Get('favourite/:uuid')
  getAllFavouriteArtists(@Param('uuid') uuid: string) {
    return this.artistService.getAllFavouriteArtists(uuid);
  }
  @Get('info/:artistId')
  getInfoArtist(@Param('artistId') artistId: number) {
    return this.artistService.getInfoArtist(artistId);
  }
  
}
