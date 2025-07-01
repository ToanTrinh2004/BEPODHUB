import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';

import { Favourite, FavouriteSchema } from 'src/schema/favourite.chema';
import { User, UserSchema } from 'src/schema/users.chema';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favourite.name, schema: FavouriteSchema },
      { name: User.name, schema: UserSchema }, // Assuming User schema is similar to Favourite
    ]),
  ],
  controllers: [PodcastController],
  providers: [PodcastService],
})
export class PodcastModule {}
