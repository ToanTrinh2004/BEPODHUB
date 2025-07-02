import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/users.chema';
import { Favourite,FavouriteSchema } from 'src/schema/favourite.chema';
import { History, HistorySchema } from 'src/schema/history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Favourite.name, schema: FavouriteSchema },
       { name: History.name, schema: HistorySchema }
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
