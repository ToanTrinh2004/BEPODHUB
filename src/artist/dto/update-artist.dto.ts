import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';


export class UpdateArtistDto {
    name?: string; // Optional property for partial updates
    avatar?: string; // Optional property for partial updates
  }