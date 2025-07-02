import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScriptDocument = Script & Document;

@Schema()
export class SubtitleSegment {
  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  text: string;

  @Prop()
  textVi?: string;
}

@Schema()
export class Script {
  @Prop({ required: true })
  podcastId: number;

  @Prop({ type: [SubtitleSegment], default: [] })
  segments: SubtitleSegment[];

  @Prop()
  translateAudio?: string;
}

export const ScriptSchema = SchemaFactory.createForClass(Script);
