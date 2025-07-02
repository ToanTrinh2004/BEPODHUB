import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SubtitleSegmentDto {
  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  textVi?: string;
}

export class CreateScriptDto {
  @IsNumber()
  podcastId: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  segments: SubtitleSegmentDto[];

  @IsOptional()
  @IsString()
  translateAudio?: string;
}
