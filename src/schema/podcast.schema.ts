import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PodcastDocument = Podcast & Document;

@Schema({ _id: false }) 
export class PodcastEpisode {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  audioUrl: string;

  @Prop()
  image: string;
}

@Schema({ timestamps: true })
export class Podcast {
  @Prop({ required: true })
  artistId: number;

  @Prop({ required: true })
  collectionId: number;

  @Prop({ required: true })
  trackId: number;

  @Prop({ required: true })
  artistName: string;

  @Prop({ required: true })
  collectionName: string;

  @Prop({ required: true })
  trackName: string;

  @Prop()
  artworkUrl100: string;

  @Prop()
  feedUrl: string;

  @Prop()
  channelImage: string;

  @Prop({ type: [PodcastEpisode], default: [] })
  episodes: PodcastEpisode[];
}

export const PodcastSchema = SchemaFactory.createForClass(Podcast);
