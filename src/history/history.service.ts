import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { History } from 'src/schema/history.schema';
import { PodcastService } from 'src/podcast/podcast.service';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name)
    private readonly historyModel: Model<History>,
    private readonly podcastService: PodcastService // Inject PodcastService
  ) {}

  async postHistory(uuid: string, updateHistoryDto: UpdateHistoryDto): Promise<{ message: string }> {
    try {
      const { podcastId, recentPlay, episodeIndex } = updateHistoryDto;
      console.log('Received updateHistoryDto:', updateHistoryDto);
      const history = await this.historyModel.findOne({ uuid });
      if (!history) {
        return { message: 'History not found' };
      }

      if (podcastId) {
        history.podCasts.push(podcastId);
      }
      if (recentPlay) {
        history.recentPlayed.push(recentPlay);
      }
      
        history.episodeIndex.push(episodeIndex);
      

      await history.save();
      return { message: 'History updated successfully' };
    } catch (error) {
      console.error('Error updating history:', error);
      throw new Error('Failed to update history');
    }
  }

  async getHistory(uuid: string): Promise<any> {
    try {
      const history = await this.historyModel.findOne({ uuid });
      if (!history) {
        throw new Error('History not found');
      }
  
      // Zip the arrays together
      const combined = history.podCasts.map((id, index) => ({
        podcastId: id,
        recentPlayed: history.recentPlayed[index],
        episodeIndex: history.episodeIndex[index],
      }));
  
      // Reverse the combined array
      const reversed = combined.reverse();
  
      // Fetch podcast details and rebuild arrays
      const podcasts = await Promise.all(
        reversed.map(async (item) => {
          return this.podcastService.getPodcastById(item.podcastId);
        })
      );
  
      const recentPlayed = reversed.map(item => item.recentPlayed);
      const episodeIndex = reversed.map(item => item.episodeIndex);
  
      return {
        podCasts: podcasts,
        recentPlayed,
        episodeIndex,
      };
    } catch (error) {
      console.error('Error fetching history:', error);
      throw new Error('Failed to fetch history');
    }
  }
}  
