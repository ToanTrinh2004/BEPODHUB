import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { Playlist, PlaylistSchema } from 'src/schema/playlist.schema';
import { User, UserSchema } from 'src/schema/users.chema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
        MongooseModule.forFeature([
          { name: Playlist.name, schema: PlaylistSchema },
          { name: User.name, schema: UserSchema }, 
        ]),],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
