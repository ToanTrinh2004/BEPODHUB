
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Favourite extends Document {
  @Prop({ type: [Number], default: [] })
  podCasts: number[];

  @Prop({ type: [Number], default: [] })
  artists: number[];

  @Prop({ type: [Number], default: [] })
  category: number[];

  @Prop({ type: [Number], default: [] })
  albums: number[];
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);
