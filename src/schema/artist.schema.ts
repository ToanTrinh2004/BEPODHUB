import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArtistDocument = Artist & Document;

@Schema({ timestamps: true })
export class Artist {
  @Prop({ required: true, unique: true })
  artistId: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
