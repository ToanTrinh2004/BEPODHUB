import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { Favourite, FavouriteSchema } from 'src/schema/favourite.chema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/users.chema';

@Module({
   imports: [
      MongooseModule.forFeature([
        { name: Favourite.name, schema: FavouriteSchema },
        { name: User.name, schema: UserSchema }, // Assuming User schema is similar to Favourite
      ]),
    ],
  controllers: [FavouriteController],
  providers: [FavouriteService],
})
export class FavouriteModule {}
