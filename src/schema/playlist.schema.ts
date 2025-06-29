import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Podcast } from './podcast.schema'; 

export type PlaylistDocument = Playlist & Document;

@Schema({ timestamps: true })
export class Playlist {
  @Prop({ required: true, unique: true })
  playlistId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop({ type: [Types.ObjectId], ref: 'Podcast', default: [] })
  podCasts: Types.ObjectId[]; // References to Podcast documents
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
