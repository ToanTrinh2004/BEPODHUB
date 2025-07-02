import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module';
import { FavouriteModule } from './favourite/favourite.module';
import { PodcastModule } from './podcast/podcast.module';
import { ArtistModule } from './artist/artist.module';
import { PlaylistModule } from './playlist/playlist.module';
import { HistoryModule } from './history/history.module';
import { ScriptModule } from './script/script.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const uri = config.get<string>('MONGO_URI');
        console.log('Loaded MONGO_URI:', uri);
        return {
          uri, 
        };
      },
    }),
    UsersModule,
    FavouriteModule,
    PodcastModule,
    ArtistModule,
    PlaylistModule,
    HistoryModule,
    ScriptModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
