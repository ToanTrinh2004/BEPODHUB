import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HistoryDocument = History & Document;

@Schema({ timestamps: true })
export class History {
  @Prop({ required: true })
  uuid: string;

  @Prop({ type: [Number], default: [] })
  podCasts: number[];

  @Prop({
    type: [Number], 
    default: []
  })
  recentPlayed: number[]; 
  @Prop({ type: [Number], default: [] })
  episodeIndex: number[]; 
}

export const HistorySchema = SchemaFactory.createForClass(History);
