import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { History, HistorySchema } from 'src/schema/history.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/users.chema';
import { PodcastModule } from 'src/podcast/podcast.module';

@Module({
   imports: [PodcastModule,
      MongooseModule.forFeature([
        { name: History.name, schema: HistorySchema },
        { name: User.name, schema: UserSchema }, 
      ]),],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
