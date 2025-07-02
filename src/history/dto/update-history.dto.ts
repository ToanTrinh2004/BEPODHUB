import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoryDto } from './create-history.dto';

import { IsInt, Min } from 'class-validator';

export class UpdateHistoryDto {
  @IsInt()
  podcastId: number;

  @IsInt()
  @Min(0)
  recentPlay: number; // playback time in milliseconds

  @IsInt()
  @Min(0)
  episodeIndex: number; // current episode index
}

