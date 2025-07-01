import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from 'src/schema/artist.schema';
import { Favourite, FavouriteSchema } from 'src/schema/favourite.chema';
import { User, UserSchema } from 'src/schema/users.chema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }, { name: Favourite.name, schema: FavouriteSchema },{ name: User.name, schema: UserSchema },]),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
