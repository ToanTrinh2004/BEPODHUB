import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true, unique: true })
  uuid: string;

  @Prop({ type: [Types.ObjectId], ref: 'Playlist', default: [] })
  playListId: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'History', default: [] })
  histories: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Favourite' })
  favourite: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
